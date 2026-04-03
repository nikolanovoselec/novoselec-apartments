# Authentication

Authentication for the owner admin panel (custom) and Emdash CMS (Cloudflare Access).

**Audience:** Developers

---

## Overview

The project has two separate admin auth systems:

| Surface | Mechanism | Notes |
|---|---|---|
| Custom admin panel (`/admin/*`) | Magic Link — 6-digit code via Resend | JWT + refresh token in HttpOnly cookies |
| Emdash CMS (`/_emdash/admin`) | Cloudflare Access — `access()` adapter | Verified via `CF_ACCESS_AUDIENCE`; users auto-provisioned |

## Emdash CMS — Cloudflare Access

Emdash CMS login is handled entirely by Cloudflare Access. The `access()` adapter from `@emdash-cms/cloudflare` is configured in `astro.config.mjs`:

```js
auth: access({
  teamDomain: "clusterfuck.cloudflareaccess.com",
  audienceEnvVar: "CF_ACCESS_AUDIENCE",
  autoProvision: true,
  defaultRole: 50, // Admin
})
```

When a request reaches `/_emdash/admin`, Access validates the `CF_Authorization` JWT against the audience tag stored in `CF_ACCESS_AUDIENCE`. If valid, the user is automatically provisioned in Emdash with role 50 (Admin). No separate login page or code-entry step exists for Emdash.

The `CF_ACCESS_AUDIENCE` secret is set via Wrangler — see [Configuration](configuration.md#secrets).

Decision rationale: [AD14](decisions/README.md#ad14-emdash-cms-auth-switched-to-cloudflare-access).

## Custom Admin Panel — Magic Link

The custom admin panel (`/admin`) uses email-based Magic Link authentication. A 6-digit one-time code is sent via Resend. On verification, the server issues a short-lived JWT and a long-lived refresh token stored in HttpOnly cookies. There is no password and no OAuth provider dependency.

## Magic Link Flow

```
1. POST /admin/api/login   { email }
   → validate email is in ADMIN_EMAILS whitelist
   → check rate limit (5 attempts per email per hour via D1)
   → generate 6-digit code (crypto.getRandomValues)
   → hash code with SHA-256, store in D1 auth_codes (10-min expiry)
   → send code via Resend
   → always return { success: true } (prevents email enumeration)

2. POST /admin/api/verify  { email, code }
   → hash submitted code, look up in D1 auth_codes
   → reject if expired or not found
   → delete used code + expired codes for that email
   → generate refresh token (32 random bytes, hex-encoded)
   → hash refresh token, store in D1 sessions (30-day expiry)
   → sign JWT (HS256, 1 hour expiry) with { email, role: "admin" }
   → set two cookies:
       auth_token    — JWT, HttpOnly, Secure, SameSite=Lax, Path=/, Max-Age=3600
       refresh_token — raw token, HttpOnly, Secure, SameSite=Lax, Path=/admin, Max-Age=2592000
   → return { success: true }
```

## Token Details

| Token | Algorithm | Expiry | Storage |
|---|---|---|---|
| JWT (`auth_token`) | HMAC-SHA-256 | 1 hour | HttpOnly cookie, Path=/ |
| Refresh token (`refresh_token`) | 32-byte random, hex | 30 days | HttpOnly cookie, Path=/admin |
| Auth code | 6-digit numeric | 10 minutes | D1 `auth_codes`, stored as SHA-256 hash |

## Rate Limiting

A maximum of 5 login attempts (code sends) per email address per rolling hour are enforced via D1 query. Lockout is silent — the endpoint returns `{ success: true }` regardless, preventing enumeration of both email validity and lockout state.

## D1 Schema

```sql
CREATE TABLE auth_codes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at  TEXT NOT NULL
);

CREATE TABLE sessions (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  email               TEXT NOT NULL,
  refresh_token_hash  TEXT NOT NULL UNIQUE,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at          TEXT NOT NULL
);
```

Migration file: `migrations/0001_auth.sql`

## Admin Email Management

Authorized emails are stored in the `ADMIN_EMAILS` plain var as a comma-separated list. It is defined in the `vars` block of `wrangler.jsonc` (not a Wrangler secret) and takes effect on the next deploy. Current value: `hello@graymatter.ch`.

To add or remove an admin email, edit `wrangler.jsonc`:

```jsonc
"vars": {
  "ADMIN_EMAILS": "hello@graymatter.ch,other@example.com"
}
```

Then redeploy. The check is case-insensitive. There is no UI for managing this list.

## Security Properties

- Codes are never stored in plaintext — SHA-256 hashed before D1 insert.
- Refresh tokens are never stored in plaintext — SHA-256 hashed before D1 insert.
- JWT verification uses `crypto.subtle` (Web Crypto API) — no third-party JWT library.
- All auth cookies are `HttpOnly; Secure; SameSite=Lax`.
- Refresh token cookie is scoped to `Path=/admin` to limit exposure.

---

## Related Documentation

- [Security](security.md#rate-limiting) — Rate limiting policy
- [Configuration](configuration.md#secrets) — JWT_SECRET, ADMIN_EMAILS, RESEND_API_KEY
- [Architecture](architecture.md#authentication-model) — Where auth fits in the system
- [Decisions](decisions/README.md#ad2-magic-link-auth-via-resend-instead-of-google-oauth) — Why Magic Link over OAuth
