import type { APIRoute } from "astro";
import { getEnv } from "~/lib/env";
import { getBookedDatesInRange } from "~/lib/availability";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/apartments/:id/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Returns booked dates for an apartment within a date range.
 * This endpoint is NOT cached — always fresh availability data.
 */
export const GET: APIRoute = async ({ params, url, locals }) => {
  const apartmentId = params.id;
  if (!apartmentId || apartmentId.length > 100) {
    return jsonResponse({ error: "Invalid apartment ID" }, 400);
  }

  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (!start || !end || !DATE_RE.test(start) || !DATE_RE.test(end)) {
    return jsonResponse({ error: "Valid start and end dates required (YYYY-MM-DD)" }, 400);
  }

  const env = getEnv(locals);
  const db = env.DB;

  try {
    const result = await db
      .prepare(
        "SELECT id, apartment_id, check_in, check_out FROM availability_blocks WHERE apartment_id = ? AND check_in < ? AND check_out > ?",
      )
      .bind(apartmentId, end, start)
      .all<{ id: string; apartment_id: string; check_in: string; check_out: string }>();

    const blocks = (result.results ?? []).map((row: { id: string; apartment_id: string; check_in: string; check_out: string }) => ({
      id: row.id,
      apartmentId: row.apartment_id,
      checkIn: row.check_in,
      checkOut: row.check_out,
    }));

    const bookedDates = getBookedDatesInRange(blocks, start, end);

    return new Response(
      JSON.stringify({ bookedDates, blocks: blocks.length }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch {
    return jsonResponse({ error: "Failed to fetch availability" }, 500);
  }
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
