/// <reference types="astro/client" />

import type { Locale } from "./i18n/config";

declare namespace App {
  interface Locals {
    locale: Locale;
  }
}

/**
 * Cloudflare Workers env bindings type.
 * Use: `const typedEnv = env as unknown as Env;`
 *
 * cloudflare:workers exports env as Record<string, unknown>
 * (declared by @emdash-cms/cloudflare). We cast to this interface.
 */
export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_SITE_KEY: string;
  ADMIN_EMAILS: string;
  JWT_SECRET: string;
  EMDASH_AUTH_SECRET: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  SESSION: KVNamespace;
}
