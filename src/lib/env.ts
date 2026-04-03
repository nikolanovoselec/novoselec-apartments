/**
 * Cloudflare env type re-export for convenience.
 *
 * Usage in API routes:
 *   import { env } from "cloudflare:workers";
 *   // env.DB, env.RESEND_API_KEY, etc. are typed via src/env.d.ts
 *
 * The cloudflare:workers module is marked as external by @astrojs/cloudflare
 * and resolved at runtime by the Worker.
 */

// Re-export for backward compatibility — prefer importing env directly
export type { } from "cloudflare:workers";
