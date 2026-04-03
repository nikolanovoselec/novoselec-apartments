/// <reference types="astro/client" />

import type { Locale } from "./i18n/config";

declare namespace App {
  interface Locals {
    locale: Locale;
  }
}

// Cloudflare Workers env bindings (Astro v6 pattern)
declare module "cloudflare:workers" {
  interface CloudflareEnv {
    DB: D1Database;
    MEDIA: R2Bucket;
    RESEND_API_KEY: string;
    TURNSTILE_SECRET_KEY: string;
    TURNSTILE_SITE_KEY: string;
    ADMIN_EMAILS: string;
    JWT_SECRET: string;
    EMDASH_AUTH_SECRET: string;
    SESSION: KVNamespace;
    IMAGES: unknown;
    ASSETS: Fetcher;
  }
}
