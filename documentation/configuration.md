# Configuration

Environment variables, secrets, and Cloudflare resource bindings.

**Audience:** Developers, Operators

---

## Environment Variables

All variables are accessed via `locals.runtime.env` in Astro server-side code. Types are declared in `src/env.d.ts`.

### Secrets

Set via `npx wrangler secret put <NAME>`. Never commit these values.

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key — used for magic link codes and inquiry emails |
| `JWT_SECRET` | Yes | HMAC-SHA-256 signing secret for auth JWTs — minimum 32 random bytes |
| `ADMIN_EMAILS` | Yes | Comma-separated list of authorized admin email addresses (case-insensitive) |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret key — server-side form verification |
| `R2_ACCESS_KEY_ID` | Yes | R2 S3-compatible access key ID — used for presigned upload URLs |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 S3-compatible secret access key — used for presigned upload URLs |
| `EMDASH_AUTH_SECRET` | Yes | Emdash CMS auth secret — set by Emdash integration |

### Public (non-secret)

These can be embedded in client-side code.

| Variable | Required | Description |
|---|---|---|
| `TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile site key — embedded in forms |

### Setting Secrets

```bash
printf '%s' "re_..." | npx wrangler secret put RESEND_API_KEY
printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put JWT_SECRET
printf '%s' "owner@example.com" | npx wrangler secret put ADMIN_EMAILS
```

## Cloudflare Bindings

Defined in `wrangler.jsonc`.

### D1 Database

```jsonc
{
  "binding": "DB",
  "database_name": "apartmani-db",
  "database_id": "1b519a56-0c60-475b-a30d-34f845bcff41"
}
```

Accessed as `locals.runtime.env.DB` (type `D1Database`). Holds auth codes, sessions, inquiries, availability blocks, analytics events, and slug redirects.

### R2 Bucket (Media)

```jsonc
// r2_buckets block in wrangler.jsonc — uncomment after enabling R2 in dashboard
{
  "binding": "MEDIA",
  "bucket_name": "apartmani-media"
}
```

The R2 bucket binding is defined but commented out in `wrangler.jsonc` pending R2 enablement in the Cloudflare dashboard. Accessed as `locals.runtime.env.MEDIA` (type `R2Bucket`). Also uncomment the corresponding line in `astro.config.mjs`.

## Astro Configuration

Key settings in `astro.config.mjs`:

| Setting | Value | Notes |
|---|---|---|
| `output` | `"server"` | Full SSR — no static generation |
| `adapter` | `cloudflare()` | Deploys as Cloudflare Worker |
| `i18n.defaultLocale` | `"hr"` | Croatian is the default locale |
| `i18n.locales` | `["hr", "de", "sl", "en"]` | Supported languages |
| `i18n.routing.prefixDefaultLocale` | `true` | All locales including default are prefixed (e.g. `/hr/`) |

## D1 Migrations

Migration files live in `migrations/`. Apply with:

```bash
npx wrangler d1 migrations apply apartmani-db --remote
```

| File | Contents |
|---|---|
| `migrations/0001_auth.sql` | `auth_codes` and `sessions` tables with indexes |
| `migrations/0002_availability.sql` | `availability_blocks`, `inquiries`, `events`, and `redirects` tables with indexes |

---

## Related Documentation

- [Authentication](authentication.md#admin-email-management) — Managing ADMIN_EMAILS
- [Architecture](architecture.md#components) — What each binding is used for
- [Deployment](deployment.md) — Full setup steps including resource creation
