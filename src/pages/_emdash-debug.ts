import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const loc = locals as unknown as Record<string, unknown>;
  const emdash = loc.emdash as Record<string, unknown> | undefined;
  const cfCtx = loc.cfContext as Record<string, unknown> | undefined;
  const runtime = loc.runtime as Record<string, unknown> | undefined;

  const cfDeep: Record<string, unknown> = {};
  if (cfCtx) {
    for (const [k, v] of Object.entries(cfCtx)) {
      cfDeep[k] = v && typeof v === "object" ? Object.keys(v as object) : typeof v;
    }
  }

  const info = {
    hasEmdash: !!emdash,
    emdashKeys: emdash ? Object.keys(emdash) : null,
    hasDb: !!emdash?.db,
    localsKeys: Object.keys(loc),
    cfDeep,
    hasRuntime: !!runtime,
    runtimeKeys: runtime ? Object.keys(runtime as object) : null,
  };

  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
