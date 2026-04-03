/**
 * Cloudflare Workers env type declaration.
 *
 * Import this file in any API route to get typed env access:
 *   import { env } from "cloudflare:workers";
 *   import "~/lib/env";  // augments the env type
 */

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
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    SESSION: KVNamespace;
    IMAGES: unknown;
    ASSETS: Fetcher;
  }
  // Override the env export type
  const env: CloudflareEnv;
}

export {};
