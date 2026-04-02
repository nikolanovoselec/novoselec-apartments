import type { APIRoute } from "astro";

/**
 * POST /admin/api/inquiries/:id/confirm
 * Confirm inquiry and block dates in a D1 transaction.
 * Requires authenticated admin session.
 */
export const POST: APIRoute = async ({ params, locals }) => {
  const inquiryId = params.id;
  if (!inquiryId) {
    return jsonResponse({ error: "Missing inquiry ID" }, 400);
  }

  const env = (locals as { runtime: { env: Record<string, unknown> } }).runtime.env;
  const db = env.DB as D1Database;

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

  // Check for date overlap (D1 transaction)
  const overlapping = await db
    .prepare("SELECT id FROM availability_blocks WHERE apartment_id = ? AND check_in < ? AND check_out > ?")
    .bind(inquiry.apartment_id, inquiry.check_out, inquiry.check_in)
    .first<{ id: number }>();

  if (overlapping) {
    return jsonResponse({
      error: "date_conflict",
      message: "These dates overlap with an existing booking",
      conflictingBlockId: overlapping.id,
    }, 409);
  }

  // D1 batch: insert availability block + update inquiry status
  await db.batch([
    db.prepare(
      "INSERT INTO availability_blocks (apartment_id, check_in, check_out, source, inquiry_id) VALUES (?, ?, ?, 'inquiry', ?)",
    ).bind(inquiry.apartment_id, inquiry.check_in, inquiry.check_out, inquiry.id),
    db.prepare(
      "UPDATE inquiries SET status = 'confirmed', updated_at = datetime('now') WHERE id = ?",
    ).bind(inquiry.id),
  ]);

  return jsonResponse({ success: true, message: "Inquiry confirmed, dates blocked" });
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
