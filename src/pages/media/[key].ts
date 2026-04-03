import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

/**
 * Image serving route: fetches from private R2, applies Cloudflare Image Resizing.
 * URL format: /media/:key?w=800&f=webp&q=80&fit=cover
 */
export const GET: APIRoute = async ({ params, url, locals }) => {
  const key = params.key;
  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const bucket = env.MEDIA;
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

    // TODO: Apply Cloudflare Image Resizing via cf: { image: {} }
    // when zone has Image Resizing enabled. For now serve originals.
    // Query params (w, f, q, fit) are parsed by clients but not yet applied.

    return new Response(object.body, { headers });
  } catch {
    return new Response("Internal error", { status: 500 });
  }
};
