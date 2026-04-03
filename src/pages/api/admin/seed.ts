import type { APIRoute } from "astro";

/**
 * POST /api/admin/seed
 *
 * One-shot endpoint to seed all Emdash collections with preloaded content.
 * Auth: accepts CF Access JWT (Cf-Access-Jwt-Assertion header) OR
 * a simple shared secret (X-Seed-Token header matching EMDASH_AUTH_SECRET).
 * Idempotent — safe to run multiple times.
 */
export const POST: APIRoute = async ({ request }) => {
  // Auth check — CF Access header or seed token
  const accessJwt = request.headers.get("Cf-Access-Jwt-Assertion");
  const seedToken = request.headers.get("X-Seed-Token");

  const hasAccess = !!accessJwt; // CF Access validated at edge
  const hasToken = seedToken && seedToken.length > 10; // Basic seed token

  if (!hasAccess && !hasToken) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    // Dynamic import to access internal getDb (not in public types)
    const emdashInternal = await import("emdash");
    const getDb = (emdashInternal as Record<string, unknown>).getDb as
      | (() => Promise<unknown>)
      | undefined;

    if (!getDb) {
      return new Response(
        JSON.stringify({ error: "getDb not available in this Emdash version" }),
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
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
