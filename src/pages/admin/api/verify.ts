import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { hashCode, createJWT, generateRefreshToken, isAdminEmail } from "~/lib/auth";

/**
 * POST /admin/api/verify
 * Verify the 6-digit code and issue JWT + refresh token.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const jwtSecret = env.JWT_SECRET ?? "";
  const adminEmails = env.ADMIN_EMAILS ?? "";
  const db = env.DB;

  const body = await request.json().catch(() => null) as { email?: string; code?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const code = body?.code?.trim();

  if (!email || !code) {
    return jsonResponse({ error: "Email and code required" }, 400);
  }

  // Use same error message for all failures to prevent enumeration
  const genericError = { error: "Invalid or expired code" };

  if (!isAdminEmail(email, adminEmails)) {
    return jsonResponse(genericError, 403);
  }

  const codeHash = await hashCode(code);

  // Find valid code
  const stored = await db
    .prepare("SELECT id FROM auth_codes WHERE email = ? AND code_hash = ? AND expires_at > datetime('now') LIMIT 1")
    .bind(email, codeHash)
    .first<{ id: number }>();

  if (!stored) {
    return jsonResponse(genericError, 403);
  }

  // Delete used code and all expired codes
  await db
    .prepare("DELETE FROM auth_codes WHERE email = ? AND (id = ? OR expires_at <= datetime('now'))")
    .bind(email, stored.id)
    .run();

  // Create session
  const refreshToken = generateRefreshToken();
  const refreshHash = await hashCode(refreshToken);

  await db
    .prepare("INSERT INTO sessions (email, refresh_token_hash, created_at, expires_at) VALUES (?, ?, datetime('now'), datetime('now', '+30 days'))")
    .bind(email, refreshHash)
    .run();

  // Issue JWT (1 hour)
  const jwt = await createJWT({ email, role: "admin" }, jwtSecret, 3600);

  // Set cookies
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", `auth_token=${jwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`);
  headers.append("Set-Cookie", `refresh_token=${refreshToken}; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 3600}`);

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
