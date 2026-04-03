/**
 * Cloudflare env type declaration.
 *
 * Usage in API routes:
 *   import { env } from "cloudflare:workers";
 *   const key = (env as CloudflareEnv).RESEND_API_KEY;
 *
 * The cloudflare:workers module is marked as external by @astrojs/cloudflare
 * and resolved at runtime by the Worker.
 */
export interface CloudflareEnv {
  DB: D1Database;
  MEDIA?: R2Bucket;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  ADMIN_EMAILS?: string;
  JWT_SECRET?: string;
  EMDASH_AUTH_SECRET?: string;
}
