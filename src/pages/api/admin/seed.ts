import type { APIRoute } from "astro";
import { getEnv } from "~/lib/env";
import { verifyJWT } from "~/lib/auth";

/**
 * POST /api/admin/seed
 *
 * One-shot endpoint to seed all Emdash collections with preloaded content.
 * Requires authenticated admin session (JWT in cookie).
 * Idempotent — safe to run multiple times.
 */
export const POST: APIRoute = async ({ cookies, locals }) => {
  // Auth check — same pattern as other admin endpoints
  const env = getEnv(locals);
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const authToken = cookies.get("auth_token")?.value;
  if (!authToken) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const payload = await verifyJWT(authToken, jwtSecret);
  if (!payload) {
    return new Response(
      JSON.stringify({ error: "Invalid or expired session" }),
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
