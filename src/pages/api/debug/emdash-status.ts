import type { APIRoute } from "astro";

/**
 * GET /api/debug/emdash-status
 * Diagnostic endpoint to check Emdash initialization state.
 * Remove before production.
 */
export const GET: APIRoute = async ({ locals }) => {
  const emdash = (locals as unknown as Record<string, unknown>).emdash;
  const emdashManifest = (locals as unknown as Record<string, unknown>).emdashManifest;

  // Check Cloudflare runtime env - try multiple access patterns
  const cfContext = (locals as unknown as Record<string, unknown>).cfContext as Record<string, unknown> | undefined;
  const runtime = (locals as unknown as Record<string, unknown>).runtime as Record<string, unknown> | undefined;
  const env = (cfContext?.env ?? runtime?.env ?? (cfContext?.props as Record<string, unknown>)?.env) as Record<string, unknown> | undefined;

  // Deep inspect cfContext
  const cfContextDeep: Record<string, unknown> = {};
  if (cfContext) {
    for (const [k, v] of Object.entries(cfContext)) {
      cfContextDeep[k] = typeof v === "object" && v !== null ? Object.keys(v) : typeof v;
    }
  }

  const info: Record<string, unknown> = {
    hasEmdash: !!emdash,
    emdashType: typeof emdash,
    emdashKeys: emdash && typeof emdash === "object" ? Object.keys(emdash) : null,
    hasDb: !!(emdash as Record<string, unknown>)?.db,
    hasManifest: !!emdashManifest,
    localsKeys: Object.keys(locals as unknown as Record<string, unknown>),
    hasCfContext: !!cfContext,
    cfContextKeys: cfContext ? Object.keys(cfContext) : null,
    cfContextDeep,
    hasRuntime: !!runtime,
    runtimeKeys: runtime ? Object.keys(runtime) : null,
    hasEnv: !!env,
    envKeys: env ? Object.keys(env) : null,
    hasD1Binding: !!(env?.DB),
    hasR2Binding: !!(env?.MEDIA),
    d1Type: typeof env?.DB,
  };

  // Try to query the database directly
  try {
    const db = (emdash as Record<string, unknown>)?.db;
    if (db && typeof db === "object" && "selectFrom" in db) {
      const result = await (db as { selectFrom: (t: string) => { selectAll: () => { limit: (n: number) => { execute: () => Promise<unknown[]> } } } })
        .selectFrom("_emdash_migrations")
        .selectAll()
        .limit(1)
        .execute();
      info.migrationsTableExists = true;
      info.migrationCount = Array.isArray(result) ? result.length : 0;
    }
  } catch (error) {
    info.migrationsTableExists = false;
    info.dbError = error instanceof Error ? error.message : String(error);
  }

  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
