import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { generateCode, hashCode, isAdminEmail } from "~/lib/auth";
import { sendEmail } from "~/lib/resend";

/**
 * POST /admin/api/login
 * Send a 6-digit magic link code to the owner's email.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const adminEmails = env.ADMIN_EMAILS ?? "";
  const resendKey = env.RESEND_API_KEY ?? "";

  const body = await request.json().catch(() => null) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email) {
    return jsonResponse({ error: "Email required" }, 400);
  }

  // Always return success to prevent email enumeration
  if (!isAdminEmail(email, adminEmails)) {
    return jsonResponse({ success: true });
  }

  const db = env.DB;

  // Brute force protection: max 5 attempts per email per hour
  const recentAttempts = await db
    .prepare("SELECT COUNT(*) as count FROM auth_codes WHERE email = ? AND created_at > datetime('now', '-1 hour')")
    .bind(email)
    .first<{ count: number }>();

  if (recentAttempts && recentAttempts.count >= 5) {
    return jsonResponse({ success: true }); // Silent — don't reveal lockout
  }

  const code = generateCode();
  const codeHash = await hashCode(code);

  // Store hashed code with 10-minute expiry
  await db
    .prepare("INSERT INTO auth_codes (email, code_hash, created_at, expires_at) VALUES (?, ?, datetime('now'), datetime('now', '+10 minutes'))")
    .bind(email, codeHash)
    .run();

  // Send code via Resend — check result
  const emailResult = await sendEmail({
    to: [email],
    subject: "Your login code — Apartmani Novoselec",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; text-align: center;">
        <h2 style="color: #0C2D48; font-weight: 300;">Your login code</h2>
        <p style="font-size: 36px; font-weight: 600; letter-spacing: 8px; color: #1B6B93; margin: 24px 0;">${code}</p>
        <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    apiKey: resendKey,
    from: "Apartmani Novoselec <noreply@graymatter.ch>",
  });

  if (!emailResult.success) {
    // Delete the stored code since email failed — don't count against brute force limit
    await db
      .prepare("DELETE FROM auth_codes WHERE email = ? AND code_hash = ?")
      .bind(email, codeHash)
      .run();
    // Return success to prevent admin email enumeration via Resend failure timing
  }

  return jsonResponse({ success: true });
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
