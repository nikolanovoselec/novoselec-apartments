# Configuration

Environment variables, secrets, and Cloudflare resource bindings.

**Audience:** Developers, Operators

---

## Environment Variables

All variables are accessed via `import { env } from "cloudflare:workers"` in API routes. Types are declared in `src/env.d.ts` by augmenting the global `CloudflareBindings` interface. Because `env.d.ts` is a global type declaration file it is picked up automatically — no side-effect import is needed in route files. The `cloudflare:workers` module is marked as external by `@astrojs/cloudflare` and resolved at runtime by the Worker.

### Secrets

Set via `npx wrangler secret put <NAME>`. Never commit these values.

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key — used by `src/lib/resend.ts` for owner inquiry notifications and legacy Magic Link admin login (`POST /admin/api/login`) |
| `JWT_SECRET` | Yes | HMAC-SHA-256 signing secret for auth JWTs — minimum 32 random bytes |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret key — server-side form verification |
| `R2_ACCESS_KEY_ID` | Yes | R2 S3-compatible access key ID — used for presigned upload URLs |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 S3-compatible secret access key — used for presigned upload URLs |
| `EMDASH_AUTH_SECRET` | Yes | Shared secret for internal Emdash operations — previously used by the now-removed `POST /api/admin/seed` endpoint. Retained as a Worker secret for future use. |

### Plain Vars (non-secret)

Defined in the `vars` block of `wrangler.jsonc`. Safe to commit — no sensitive values.

| Variable | Required | Description |
|---|---|---|
| `ADMIN_EMAILS` | Yes | Comma-separated list of authorized admin email addresses (case-insensitive). Current value: `hello@graymatter.ch` |
| `TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile site key — embedded in forms |
| `CF_ACCESS_AUDIENCE` | Yes | Cloudflare Access audience tag for Emdash CMS auth. Read by the `access()` adapter via `process.env` at runtime — must be a `vars` entry, not a secret (see note below). |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | Cloudflare account ID — used by `POST /admin/api/upload-url` to construct the R2 S3-compatible endpoint URL. Also committed in `wrangler.jsonc` for convenience. |
| `R2_BUCKET_NAME` | Yes | R2 bucket name (`apartmani-media`) — used by `POST /admin/api/upload-url` when signing presigned PUT URLs, and by `src/lib/storage-r2-hybrid.ts` for direct bucket operations. |

### Important: CF_ACCESS_AUDIENCE must be a var, not a secret

The `@emdash-cms/cloudflare` access plugin reads the audience tag via `process.env[envVarName]` at runtime. On Cloudflare Workers, `process.env` is populated from `wrangler.jsonc` vars — not from Worker secrets. If `CF_ACCESS_AUDIENCE` is set as a secret, the plugin throws "Environment variable not found" and CMS authentication fails. The AUD tag is not sensitive — it is a public identifier present in every CF Access JWT.


### Setting Secrets

```bash
printf '%s' "re_..." | npx wrangler secret put RESEND_API_KEY
printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put JWT_SECRET
printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put EMDASH_AUTH_SECRET
```

To update `ADMIN_EMAILS` or `CF_ACCESS_AUDIENCE`, edit the `vars` block in `wrangler.jsonc` and redeploy — they are not secrets.

## Email Sender Address

All outbound emails use `Apartmani Novoselec <noreply@graymatter.ch>` as the from-address. This applies to owner notifications sent from `POST /api/inquiry` and the legacy Magic Link admin login flow. The sending domain (`graymatter.ch`) must remain verified in the Resend dashboard.

## Cloudflare Bindings

Defined in `wrangler.jsonc`.

### D1 Database

```jsonc
{
  "binding": "DB",
  "database_name": "apartmani-db",
  "database_id": "dd28856a-60e0-48d2-bb91-2b91ba8a0603"
}
```

Accessed as `env.DB` (type `D1Database`) via `import { env } from "cloudflare:workers"`. Holds auth codes, sessions, inquiries, availability blocks, analytics events, and slug redirects.

### R2 Bucket (Media)

```jsonc
{
  "binding": "MEDIA",
  "bucket_name": "apartmani-media"
}
```

Accessed as `env.MEDIA` (type `R2Bucket`) via `import { env } from "cloudflare:workers"`. Used by the `/api/img/[key]` route to serve uploaded images and by the Emdash CMS storage integration. The `storage: { entrypoint: "~/lib/storage-r2-hybrid", config: { binding: "MEDIA" } }` option in `astro.config.mjs` connects the same binding to Emdash's file storage via a custom hybrid adapter. The previous `/media/:key` route has been removed.

### Phantom Binding: SESSION KVNamespace

`src/env.d.ts` declares `SESSION: KVNamespace` in the `Env` interface, but no corresponding `kv_namespaces` binding exists in `wrangler.jsonc`. This binding is unused — no production code reads `env.SESSION`. The declaration is a leftover type stub. Do not provision a KV namespace for it unless a session-storage feature is actively being implemented.

## Custom Domain Route

Defined in `wrangler.jsonc` under `routes`:

```jsonc
{
  "pattern": "novoselec.hr",
  "custom_domain": true
}
```

The Worker is bound to `novoselec.hr` as a Cloudflare custom domain. DNS must be proxied through Cloudflare (orange cloud) for the route to take effect. No separate zone or route pattern configuration is needed beyond this entry.

## Astro Configuration

Key settings in `astro.config.mjs`:

| Setting | Value | Notes |
|---|---|---|
| `output` | `"server"` | Full SSR — no static generation |
| `adapter` | `cloudflare()` | Deploys as Cloudflare Worker |
| `i18n.defaultLocale` | `"hr"` | Croatian is the default locale |
| `i18n.locales` | `["hr", "de", "sl", "en"]` | Supported languages |
| `i18n.routing` | `"manual"` | Manual routing — locale prefixing via `[locale]` file-based routes, not Astro's automatic system. Required for Emdash integration compatibility (see [AD13](decisions/README.md#ad13-switch-to-manual-i18n-routing-to-prevent-astro-from-rewriting-integration-injected-routes)). |
| `auth.teamDomain` | `"m4f1j0z0.cloudflareaccess.com"` | Cloudflare Access team domain — used by the `access()` adapter from `@emdash-cms/cloudflare` to validate Access JWTs on `/_emdash/admin` requests. |

## D1 Migrations

Migration files live in `migrations/`. Apply with:

```bash
npx wrangler d1 migrations apply apartmani-db --remote
```

| File | Contents |
|---|---|
| `migrations/0001_auth.sql` | `auth_codes` and `sessions` tables with indexes |
| `migrations/0002_availability.sql` | `availability_blocks` (with `source` and `inquiry_id` columns), `inquiries` (full lifecycle columns including `price_estimate`, `email_status`, `retry_at`), `events`, and `redirects` tables with indexes |

**Note:** `POST /api/inquiry` queries a `seasons` table for price estimation. This table is not yet covered by a migration file — a `0003_seasons.sql` migration is required before price estimates will function. See [Architecture](architecture.md#pricing-model) for the schema shape.

---

## Related Documentation

- [Authentication](authentication.md#admin-email-management) — Managing ADMIN_EMAILS
- [Architecture](architecture.md#components) — What each binding is used for
- [Deployment](deployment.md) — Full setup steps including resource creation
