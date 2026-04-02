import type { APIRoute } from "astro";

/**
 * POST /api/admin/seed
 *
 * One-shot endpoint to seed all Emdash collections with preloaded content.
 * Delegates to Emdash's internal applySeed via dynamic import of the
 * internal module (getDb is not publicly exported).
 * Idempotent — safe to run multiple times.
 */
export const POST: APIRoute = async () => {
  try {
    // Dynamic import to access internal getDb (not in public types)
    const emdashInternal = await import("emdash");
    const getDb = (emdashInternal as Record<string, unknown>).getDb as
      | (() => Promise<unknown>)
      | undefined;

    if (!getDb) {
      return new Response(
        JSON.stringify({ success: false, error: "getDb not available in this Emdash version" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const { applySeed } = await import("emdash/seed");
    const seedData = await import("../../../../seed/seed.json");

    const db = await getDb();
    const result = await applySeed(
      db as Parameters<typeof applySeed>[0],
      seedData.default as Parameters<typeof applySeed>[1],
    );

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
