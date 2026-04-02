/**
 * Helper to safely access Cloudflare runtime bindings from Astro locals.
 * Avoids type casting issues across different Astro versions.
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
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}

/**
 * Extract Cloudflare env bindings from Astro locals.
 */
export function getEnv(locals: unknown): CloudflareEnv {
  const obj = locals as { runtime?: { env?: CloudflareEnv } };
  return obj?.runtime?.env ?? ({} as CloudflareEnv);
}
