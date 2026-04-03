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

/**
 * POST /api/inquiry
 * Full inquiry server pipeline:
 * 1. Turnstile verify
 * 2. Honeypot check
 * 3. Zod validate
 * 4. Availability revalidate (bookings only)
 * 5. D1 persist
 * 6. Resend emails (outbox pattern)
 * 7. Return appropriate status code
 */
export const POST: APIRoute = async ({ request }) => {
  const db = env.DB;
  const turnstileSecret = env.TURNSTILE_SECRET_KEY ?? "";
  const resendKey = env.RESEND_API_KEY ?? "";
  const adminEmails = env.ADMIN_EMAILS ?? "";

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
    // Bot detected — return fake success
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

  // Persist to D1 (before email attempt — data never lost)
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
  const ownerEmails = adminEmails.split(",").map((e) => e.trim()).filter(Boolean);
  let emailSent = false;

  console.log("[inquiry] Email config:", { ownerEmails: ownerEmails.length, hasResendKey: !!resendKey, resendKeyLength: resendKey?.length });

  if (ownerEmails.length > 0 && resendKey) {
    // Owner notification
    const ownerResult = await sendEmail({
      to: ownerEmails,
      subject: `New inquiry${data.type === "booking" ? ` — ${data.checkIn} to ${data.checkOut}` : " — Quick question"}`,
      html: buildOwnerEmail(data, cleanName, cleanEmail, cleanPhone, cleanMessage, priceEstimate),
      replyTo: cleanEmail,
      apiKey: resendKey,
      from: "Apartmani Novoselec <noreply@graymatter.ch>",
    });

    // Guest auto-reply
    const guestResult = await sendEmail({
      to: [cleanEmail],
      subject: data.locale === "de"
        ? "Ihre Anfrage — Ferienwohnungen Ždrelac"
        : data.locale === "sl"
        ? "Vaše povpraševanje — Apartmaji Ždrelac"
        : data.locale === "en"
        ? "Your inquiry — Apartments Ždrelac"
        : "Vaš upit — Apartmani Novoselec",
      html: buildGuestEmail(data, data.locale),
      apiKey: resendKey,
      from: "Apartmani Novoselec <noreply@graymatter.ch>",
    });

    console.log("[inquiry] Owner email result:", ownerResult);
    console.log("[inquiry] Guest email result:", guestResult);
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
    `<h2 style="color:#0C2D48;font-weight:300;">New ${data.type === "booking" ? "Booking Inquiry" : "Quick Question"}</h2>`,
    `<p><strong>Name:</strong> ${name}</p>`,
    `<p><strong>Email:</strong> ${email}</p>`,
  ];

  if (phone) lines.push(`<p><strong>Phone:</strong> ${phone}</p>`);

  if (data.type === "booking") {
    lines.push(`<p><strong>Dates:</strong> ${data.checkIn} to ${data.checkOut}</p>`);
    lines.push(`<p><strong>Guests:</strong> ${data.adults} adults, ${data.childrenUnder12} children (<12), ${data.children12to17} children (12-17)</p>`);
    lines.push(`<p><strong>Apartment:</strong> ${stripHtml(data.apartmentId)}</p>`);
    if (data.hasPets) lines.push(`<p><strong>Pets:</strong> Yes${data.petNote ? ` — ${stripHtml(data.petNote)}` : ""}</p>`);
    if (priceEstimate) lines.push(`<p><strong>Price estimate:</strong> €${priceEstimate.toFixed(2)}</p>`);
  }

  if (message) lines.push(`<p><strong>Message:</strong> ${message}</p>`);
  lines.push(`<p style="color:#666;font-size:12px;">Locale: ${data.locale}</p>`);

  return `<div style="font-family:sans-serif;max-width:600px;">${lines.join("")}</div>`;
}

function buildGuestEmail(data: Inquiry, locale: string): string {
  const messages: Record<string, string> = {
    hr: "Hvala na upitu! Zaprimili smo Vaš zahtjev. Ovo je upit, ne potvrđena rezervacija. Datumi nisu rezervirani dok ne potvrdimo. Obično odgovaramo unutar 2 sata.",
    de: "Vielen Dank für Ihre Anfrage! Wir haben Ihre Nachricht erhalten. Dies ist eine Anfrage, keine bestätigte Buchung. Die Termine sind nicht reserviert, bis wir bestätigen. Wir antworten in der Regel innerhalb von 2 Stunden.",
    sl: "Hvala za povpraševanje! Prejeli smo vaš zahtevek. To je zahtevek, ne potrjena rezervacija. Datumi niso rezervirani, dokler ne potrdimo. Običajno odgovorimo v 2 urah.",
    en: "Thank you for your inquiry! We have received your request. This is a request, not a confirmed booking. Dates are not secured until we confirm. We typically respond within 2 hours.",
  };

  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
      <h2 style="color:#0C2D48;font-weight:300;">Apartmani Novoselec</h2>
      <p>${messages[locale] ?? messages.hr}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="color:#888;font-size:12px;">Ždrelac, Pašman, Croatia</p>
    </div>
  `;
}
