import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";

/**
 * Image serving route: fetches from R2 via Emdash storage abstraction.
 * URL: /api/img/:key — key is an R2 object identifier, either a bare
 * UUID (e.g. "d57cdaef-2625-448e-bd51-5bdc90de4883", used by Hero.astro)
 * or UUID.ext (e.g. "aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg", the
 * format produced by /admin/api/upload-url and the Emdash media library).
 * Content type is read from R2 object metadata, not the key suffix.
 *
 * Uses locals.emdash.storage.download() — same R2 instance as CMS.
 * Falls back to direct env.MEDIA bucket access.
 */
export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key ?? "";

  if (!key || key.includes("..") || key.startsWith("/")) {
    return new Response("Invalid key", { status: 400 });
  }

  // Try Emdash storage first (same R2 instance as CMS media library)
  const emdash = (locals as unknown as { emdash?: { storage?: { download: (key: string) => Promise<{ body: ReadableStream; contentType: string; size?: number }> } } }).emdash;

  if (emdash?.storage) {
    try {
      const result = await emdash.storage.download(key);
      return new Response(result.body, {
        headers: {
          "Content-Type": result.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // File not found in Emdash storage, try direct R2
    }
  }

  // Fallback: direct R2 bucket access via cloudflare:workers
  try {
    const env = _env as unknown as Record<string, unknown>;
    const bucket = env.MEDIA as R2Bucket | undefined;
    if (!bucket) {
      return new Response("Storage not configured", { status: 503 });
    }

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
