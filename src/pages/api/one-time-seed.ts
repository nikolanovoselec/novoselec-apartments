import type { APIRoute } from "astro";
import { applySeed } from "emdash/seed";

/**
 * POST /api/one-time-seed
 *
 * TEMPORARY endpoint — run once to seed Emdash, then delete this file.
 * No auth required (one-time use). Check the secret query param.
 */
export const POST: APIRoute = async ({ url }) => {
  // Simple shared secret to prevent accidental/bot triggers
  if (url.searchParams.get("key") !== "seed-apartmani-2026") {
    return new Response(JSON.stringify({ error: "Invalid key" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const emdashInternal = await import("emdash");
    const getDb = (emdashInternal as Record<string, unknown>).getDb as
      | (() => Promise<unknown>)
      | undefined;

    if (!getDb) {
      return new Response(
        JSON.stringify({ error: "getDb not available" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const seedModule = await import("../../../seed/seed.json");
    const seedData = seedModule.default;

    const db = await getDb();
    const result = await applySeed(
      db as Parameters<typeof applySeed>[0],
      seedData as Parameters<typeof applySeed>[1],
    );

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
