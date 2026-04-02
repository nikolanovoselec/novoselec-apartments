import type { APIRoute } from "astro";

/**
 * Image serving route: fetches from private R2, applies Cloudflare Image Resizing.
 * URL format: /media/:key?w=800&f=webp&q=80&fit=cover
 */
export const GET: APIRoute = async ({ params, url, locals }) => {
  const key = params.key;
  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const env = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env as
    | { MEDIA?: { get: (key: string) => Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null> } }
    | undefined;

  const bucket = env?.MEDIA;
  if (!bucket) {
    return new Response("Storage not configured", { status: 503 });
  }

  const object = await bucket.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  // Parse transform options from query params
  const width = url.searchParams.get("w");
  const format = url.searchParams.get("f");
  const quality = url.searchParams.get("q");
  const fit = url.searchParams.get("fit");

  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  if (object.httpMetadata?.contentType) {
    headers.set("Content-Type", object.httpMetadata.contentType);
  }

  // If Cloudflare Image Resizing is available, apply transforms
  // In production, this is handled via cf: { image: {} } on the fetch
  // For now, serve the original with appropriate cache headers
  const response = new Response(object.body, { headers });

  return response;
};
