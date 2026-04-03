import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";
import type { Env } from "~/env";
const env = _env as unknown as Env;

/**
 * POST /api/admin/seed
 *
 * One-shot endpoint to seed all Emdash collections with preloaded content.
 * Auth: X-Seed-Token header must match EMDASH_AUTH_SECRET Worker secret.
 * CF Access only protects /_emdash/* — this endpoint is on /api/* which
 * is accessible on workers.dev without CF Access, so we MUST validate
 * a shared secret.
 * Idempotent — safe to run multiple times.
 */
export const POST: APIRoute = async ({ request }) => {
  // Auth: validate shared secret (NOT just presence check)
  const seedToken = request.headers.get("X-Seed-Token");
  const expectedSecret = env.EMDASH_AUTH_SECRET;

  if (!expectedSecret || !seedToken || seedToken !== expectedSecret) {
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
