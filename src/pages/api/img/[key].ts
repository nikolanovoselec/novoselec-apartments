import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";
import type { Env } from "~/env";

/**
 * Image serving route: fetches from private R2 bucket.
 * URL: /api/img/:key (key is a UUID without extension)
 *
 * Uses cloudflare:workers import so Astro includes the route in the build.
 * Accesses R2 via locals.runtime.env at request time (Astro CF adapter pattern).
 * Falls back to cloudflare:workers env if locals not available.
 */
export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key ?? "";

  if (!key || key.includes("..") || key.startsWith("/")) {
    return new Response("Invalid key", { status: 400 });
  }

  // Try locals.runtime.env first (official Astro Cloudflare adapter)
  // Fall back to cloudflare:workers module env
  let bucket: R2Bucket | undefined;
  try {
    const runtime = (locals as unknown as { runtime?: { env?: { MEDIA?: R2Bucket } } }).runtime;
    bucket = runtime?.env?.MEDIA;
  } catch { /* locals access failed */ }

  if (!bucket) {
    const env = _env as unknown as Env;
    bucket = env.MEDIA;
  }

  if (!bucket) {
    return new Response("Storage not configured", { status: 503 });
  }

  try {
    const object = await bucket.get(key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers({
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    if (object.httpMetadata?.contentType) {
      headers.set("Content-Type", object.httpMetadata.contentType);
    }

    return new Response(object.body, { headers });
  } catch {
    return new Response("Internal error", { status: 500 });
  }
};
