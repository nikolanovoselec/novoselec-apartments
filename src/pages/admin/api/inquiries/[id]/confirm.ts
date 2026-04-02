import type { APIRoute } from "astro";
import { getEnv } from "~/lib/env";
import { verifyJWT } from "~/lib/auth";
import { stripHtml } from "~/lib/sanitize";

/**
 * POST /admin/api/inquiries/:id/confirm
 * Confirm inquiry and block dates atomically.
 * Requires authenticated admin session (JWT in cookie).
 */
export const POST: APIRoute = async ({ params, cookies, locals }) => {
  // Auth check
  const env = getEnv(locals);
  const authToken = cookies.get("auth_token")?.value;
  if (!authToken) {
    return jsonResponse({ error: "Authentication required" }, 401);
  }
  const payload = await verifyJWT(authToken, env.JWT_SECRET ?? "");
  if (!payload) {
    return jsonResponse({ error: "Invalid or expired session" }, 401);
  }

  const inquiryId = params.id;
  if (!inquiryId) {
    return jsonResponse({ error: "Missing inquiry ID" }, 400);
  }

  const db = env.DB;

  // Get the inquiry
  const inquiry = await db
    .prepare("SELECT id, type, apartment_id, check_in, check_out, status FROM inquiries WHERE id = ?")
    .bind(inquiryId)
    .first<{
      id: number;
      type: string;
      apartment_id: string | null;
      check_in: string | null;
      check_out: string | null;
      status: string;
    }>();

  if (!inquiry) {
    return jsonResponse({ error: "Inquiry not found" }, 404);
  }

  if (inquiry.status === "confirmed") {
    return jsonResponse({ error: "Already confirmed" }, 409);
  }

  if (inquiry.type !== "booking" || !inquiry.apartment_id || !inquiry.check_in || !inquiry.check_out) {
    return jsonResponse({ error: "Cannot confirm a non-booking inquiry" }, 400);
  }

  // Atomic confirm: INSERT WHERE NOT EXISTS to prevent TOCTOU race condition
  // D1 batch runs all statements in a single transaction
  const batchResults = await db.batch([
    db.prepare(`
      INSERT INTO availability_blocks (apartment_id, check_in, check_out, source, inquiry_id)
      SELECT ?, ?, ?, 'inquiry', ?
      WHERE NOT EXISTS (
        SELECT 1 FROM availability_blocks
        WHERE apartment_id = ? AND check_in < ? AND check_out > ?
      )
    `).bind(
      inquiry.apartment_id, inquiry.check_in, inquiry.check_out, inquiry.id,
      inquiry.apartment_id, inquiry.check_out, inquiry.check_in,
    ),
    db.prepare(
      "UPDATE inquiries SET status = 'confirmed', updated_at = datetime('now') WHERE id = ? AND status != 'confirmed'",
    ).bind(inquiry.id),
  ]);

  // Check if the INSERT actually inserted (0 rows = conflict)
  const insertResult = batchResults[0];
  if (insertResult.meta && insertResult.meta.changes === 0) {
    return jsonResponse({
      error: "date_conflict",
      message: "These dates overlap with an existing booking",
    }, 409);
  }

  return jsonResponse({ success: true, message: "Inquiry confirmed, dates blocked" });
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
