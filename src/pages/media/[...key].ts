import type { APIRoute } from "astro";

/**
 * Image serving route: fetches from private R2 bucket.
 * URL format: /media/:key?w=800&f=webp&q=80&fit=cover
 * Keys are UUIDs without extensions (e.g., /media/2d537213-c38b-4076-8e2e-a5ee25783c0e)
 */
export const GET: APIRoute = async ({ params, locals, request }) => {
  let key = params.key ?? "";

  // Rest params may be string or array
  if (Array.isArray(key)) key = key.join("/");

  // Decode and sanitize
  key = decodeURIComponent(key);
  if (key.endsWith("/")) key = key.slice(0, -1);

  if (!key || key.includes("..") || key.startsWith("/")) {
    return new Response("Invalid key", { status: 400 });
  }

  // Access R2 via Astro's Cloudflare runtime locals (official pattern)
  const runtime = (locals as unknown as Record<string, unknown>).runtime as
    | { env?: { MEDIA?: R2Bucket } }
    | undefined;
  const bucket = runtime?.env?.MEDIA;

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
