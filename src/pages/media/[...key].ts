import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";
import type { Env } from "~/env";
const env = _env as unknown as Env;

/**
 * Image serving route: fetches from private R2, applies Cloudflare Image Resizing.
 * URL format: /media/:key?w=800&f=webp&q=80&fit=cover
 */
export const GET: APIRoute = async ({ params, url, locals }) => {
  const rawKey = params.key;
  // Rest params may return string or undefined
  const key = typeof rawKey === "string" ? rawKey : Array.isArray(rawKey) ? rawKey.join("/") : "";
  if (!key || key.includes("..") || key.startsWith("/")) {
    return new Response("Invalid key", { status: 400 });
  }

  // Access R2 bucket from runtime env (Cloudflare Workers binding)
  let bucket: R2Bucket | undefined;
  try {
    bucket = env.MEDIA;
  } catch {
    // env may not be available in dev
  }

  if (!bucket) {
    // Try getting from locals (Astro Cloudflare adapter passes env via locals)
    const runtimeEnv = (locals as Record<string, unknown>).runtime as { env?: { MEDIA?: R2Bucket } } | undefined;
    bucket = runtimeEnv?.env?.MEDIA;
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

    // TODO: Apply Cloudflare Image Resizing via cf: { image: {} }
    // when zone has Image Resizing enabled. For now serve originals.
    // Query params (w, f, q, fit) are parsed by clients but not yet applied.

    return new Response(object.body, { headers });
  } catch {
    return new Response("Internal error", { status: 500 });
  }
};
