import type { APIRoute } from "astro";
import { env as _env } from "cloudflare:workers";

export const GET: APIRoute = async ({ locals }) => {
  const env = _env as unknown as Record<string, unknown>;
  const bucket = env.MEDIA as R2Bucket | undefined;

  let r2Info = "no bucket";
  if (bucket) {
    try {
      const list = await bucket.list({ limit: 3 });
      r2Info = `${list.objects.length} objects (of ${list.truncated ? "more" : "total"}): ${list.objects.map(o => o.key).join(", ")}`;
    } catch (e) {
      r2Info = `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return new Response(JSON.stringify({ ok: true, hasBucket: !!bucket, r2Info }), {
    headers: { "Content-Type": "application/json" },
  });
};
