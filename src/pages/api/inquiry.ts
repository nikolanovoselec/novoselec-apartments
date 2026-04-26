// Implements REQ-BK-2
import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";
import type { Env } from "~/env";
const env = _env as unknown as Env;
import { inquirySchema, type Inquiry } from "~/schemas/inquiry";
import { verifyTurnstileToken, isTokenExpired } from "~/lib/turnstile";
import { hasOverlap } from "~/lib/availability";
import { sanitizeMessage, sanitizeName, sanitizeEmail, sanitizePhone, stripHtml } from "~/lib/sanitize";
import { computeStayPrice, type Season } from "~/lib/pricing";
import { sendEmail } from "~/lib/resend";


function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
/**
 * POST /api/inquiry
 * Full inquiry server pipeline:
 * 1. Zod validate
 * 2. Honeypot check
 * 3. Turnstile verify
 * 4. Availability revalidate (bookings only)
 * 5. D1 persist
 * 6. Resend emails (outbox pattern)
 * 7. Return appropriate status code
 */
export const POST: APIRoute = async ({ request }) => {
  const db = env.DB;
  const turnstileSecret = env.TURNSTILE_SECRET_KEY ?? "";
  const resendKey = env.RESEND_API_KEY ?? "";
  const recipients = env.RESEND_RECIPIENTS ?? "";

  // Parse body
  const rawBody = await request.json().catch(() => null);
  if (!rawBody) {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  // Zod validate
  const parsed = inquirySchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return jsonResponse({
      error: "validation_error",
      message: firstError?.message ?? "Invalid input",
      field: firstError?.path?.join("."),
    }, 400);
  }

  const data = parsed.data;

  // Honeypot check
  if (data.honeypot) {
    // Bot detected - return fake success
    return jsonResponse({ success: true });
  }

  // Turnstile verify
  const clientIp = request.headers.get("cf-connecting-ip");
  const turnstileResult = await verifyTurnstileToken(data.turnstileToken, turnstileSecret, clientIp);

  if (!turnstileResult.success) {
    return jsonResponse({
      error: isTokenExpired(turnstileResult.errorCodes) ? "turnstile_expired" : "turnstile_failed",
      message: "Security verification failed",
    }, 403);
  }

  // Sanitize inputs
  const cleanName = sanitizeName(data.name);
  const cleanEmail = sanitizeEmail(data.email);
  if (!cleanEmail) {
    return jsonResponse({ error: "validation_error", message: "Invalid email" }, 400);
  }

  const cleanMessage = data.message ? sanitizeMessage(data.message) : null;
  const cleanPhone = data.type === "booking" && data.phone ? sanitizePhone(data.phone) : null;

  // Booking-specific validation
  let priceEstimate: number | null = null;

  if (data.type === "booking") {
    // Server-side availability revalidation
    const blocks = await db
      .prepare("SELECT id, apartment_id, check_in, check_out FROM availability_blocks WHERE apartment_id = ? AND check_in < ? AND check_out > ?")
      .bind(data.apartmentId, data.checkOut, data.checkIn)
      .all<{ id: string; apartment_id: string; check_in: string; check_out: string }>();

    const existingBlocks = (blocks.results ?? []).map((r: { id: string; apartment_id: string; check_in: string; check_out: string }) => ({
      id: r.id,
      apartmentId: r.apartment_id,
      checkIn: r.check_in,
      checkOut: r.check_out,
    }));

    if (hasOverlap(existingBlocks, data.checkIn, data.checkOut)) {
      return jsonResponse({
        error: "stale_availability",
        message: "Selected dates are no longer available",
      }, 409);
    }

    // Compute price estimate
    const seasons = await db
      .prepare("SELECT id, apartment_id, name, start_date, end_date, price_per_night, min_stay FROM seasons WHERE apartment_id = ?")
      .bind(data.apartmentId)
      .all<{ id: string; apartment_id: string; name: string; start_date: string; end_date: string; price_per_night: number; min_stay: number }>();

    const seasonData: Season[] = (seasons.results ?? []).map((s: { id: string; apartment_id: string; name: string; start_date: string; end_date: string; price_per_night: number; min_stay: number }) => ({
      id: s.id,
      apartmentId: s.apartment_id,
      name: s.name,
      startDate: s.start_date,
      endDate: s.end_date,
      pricePerNight: s.price_per_night,
      minStay: s.min_stay,
    }));

    const breakdown = computeStayPrice({
      seasons: seasonData,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults,
      childrenUnder12: data.childrenUnder12,
      children12to17: data.children12to17,
      cleaningFee: 0, // TODO: get from apartment settings
      touristTaxRate: 1.35, // TODO: get from site settings
    });

    priceEstimate = breakdown.total;
  }

  // Persist to D1 (before email attempt - data never lost)
  const insertResult = await db
    .prepare(`INSERT INTO inquiries (
      type, apartment_id, check_in, check_out, adults, children_under_12, children_12_to_17,
      name, email, phone, message, has_pets, pet_note, locale, status, email_status,
      gdpr_consent_at, source, price_estimate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'pending', datetime('now'), ?, ?)`)
    .bind(
      data.type,
      data.type === "booking" ? data.apartmentId : (data.apartmentId ?? null),
      data.type === "booking" ? data.checkIn : null,
      data.type === "booking" ? data.checkOut : null,
      data.type === "booking" ? data.adults : null,
      data.type === "booking" ? data.childrenUnder12 : null,
      data.type === "booking" ? data.children12to17 : null,
      cleanName,
      cleanEmail,
      cleanPhone,
      cleanMessage,
      data.type === "booking" && data.hasPets ? 1 : 0,
      data.type === "booking" ? (data.petNote ?? null) : null,
      data.locale,
      data.type === "booking" ? "form" : "quick-question",
      priceEstimate,
    )
    .run();

  const inquiryId = insertResult.meta?.last_row_id;

  // Send emails
  const ownerEmails = recipients.split(";").map((e) => e.trim()).filter(Boolean);
  let emailSent = false;

  if (ownerEmails.length === 0) {
    console.error("[inquiry] RESEND_RECIPIENTS missing or empty — owner notification skipped (inquiry persisted to D1)");
  }

  if (ownerEmails.length > 0 && resendKey) {
    const fromAddress = "Apartmani Novoselec <noreply@graymatter.ch>";
    // bcc keeps recipients hidden from each other
    const ownerResult = await sendEmail({
      to: [fromAddress],
      bcc: ownerEmails,
      subject: `Novi upit${data.type === "booking" ? ` - ${data.checkIn} do ${data.checkOut}` : " - Brzo pitanje"}`,
      html: buildOwnerEmail(data, cleanName, cleanEmail, cleanPhone, cleanMessage, priceEstimate),
      replyTo: cleanEmail,
      apiKey: resendKey,
      from: fromAddress,
    });

    emailSent = ownerResult.success;

    // Update email status
    const emailStatus = ownerResult.success ? "sent" : "retry";
    await db
      .prepare("UPDATE inquiries SET email_status = ?, email_attempts = 1 WHERE id = ?")
      .bind(emailStatus, inquiryId)
      .run();

    if (!ownerResult.success) {
      // Set retry time
      await db
        .prepare("UPDATE inquiries SET retry_at = datetime('now', '+2 minutes') WHERE id = ?")
        .bind(inquiryId)
        .run();
    }
  }

  // Track event
  await db
    .prepare("INSERT INTO events (type, apartment_slug, locale, page_path) VALUES (?, ?, ?, ?)")
    .bind(
      data.type === "booking" ? "inquiry_submit" : "question_submit",
      data.type === "booking" ? data.apartmentId : null,
      data.locale,
      null,
    )
    .run();

  if (emailSent) {
    return jsonResponse({ success: true }, 200);
  }

  // Inquiry saved but email failed
  return jsonResponse({
    success: true,
    emailFailed: true,
    message: "Inquiry received. If you don't hear from us within 4 hours, please try WhatsApp.",
  }, 202);
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildOwnerEmail(
  data: Inquiry,
  name: string,
  email: string,
  phone: string | null,
  message: string | null,
  priceEstimate: number | null,
): string {
  const lines = [
    `<h2 style="color:#0C2D48;font-weight:300;">${data.type === "booking" ? "Novi upit za rezervaciju" : "Brzo pitanje"}</h2>`,
    `<p><strong>Ime:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
  ];

  if (phone) lines.push(`<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>`);

  if (data.type === "booking") {
    lines.push(`<p><strong>Datumi:</strong> ${data.checkIn} do ${data.checkOut}</p>`);
    lines.push(`<p><strong>Gosti:</strong> ${data.adults} odraslih, ${data.childrenUnder12} djece (<12), ${data.children12to17} djece (12-17)</p>`);
    lines.push(`<p><strong>Apartman:</strong> ${stripHtml(data.apartmentId)}</p>`);
    if (data.hasPets) lines.push(`<p><strong>Kućni ljubimci:</strong> Da${data.petNote ? ` - ${stripHtml(data.petNote)}` : ""}</p>`);
    if (priceEstimate) lines.push(`<p><strong>Procjena cijene:</strong> €${priceEstimate.toFixed(2)}</p>`);
  }

  if (message) lines.push(`<p><strong>Poruka:</strong> ${escapeHtml(message)}</p>`);
  lines.push(`<p style="color:#666;font-size:12px;">Jezik: ${data.locale}</p>`);

  return `<div style="font-family:sans-serif;max-width:600px;">${lines.join("")}</div>`;
}


