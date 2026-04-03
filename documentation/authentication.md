# Authentication

Authentication for the Emdash CMS admin panel via Cloudflare Access.

**Audience:** Developers

---

## Overview

Admin authentication is handled by **Cloudflare Access** — a zero-trust proxy that requires identity verification before requests reach the Worker.

| Surface | Mechanism | Notes |
|---|---|---|
| Emdash CMS (`/_emdash/admin`) | Cloudflare Access → `access()` adapter | JWT validated via `CF_ACCESS_AUDIENCE`; users auto-provisioned |

**Deprecated:** The custom Magic Link admin panel (`/admin/*`) is no longer the primary auth mechanism. Cloudflare Access handles all admin authentication. The Magic Link code (`src/lib/auth.ts`) still exists in the codebase for JWT/session utilities but is not used for CMS login.

## Cloudflare Access Authentication

Emdash CMS login is handled entirely by Cloudflare Access. The `access()` adapter from `@emdash-cms/cloudflare` is configured in `astro.config.mjs`:

```js
auth: access({
  teamDomain: "m4f1j0z0.cloudflareaccess.com",
  audienceEnvVar: "CF_ACCESS_AUDIENCE",
  autoProvision: true,
  defaultRole: 50, // Admin
})
```

### How it works

1. User navigates to `/_emdash/admin/`
2. Cloudflare Access intercepts and prompts for identity (Google login)
3. After authentication, Access sets `CF_Authorization` cookie with a signed JWT
4. The `access()` plugin validates the JWT against `CF_ACCESS_AUDIENCE` (AUD tag)
5. If valid, the user is auto-provisioned in Emdash with role 50 (Admin)

### Configuration

- **Team domain:** `m4f1j0z0.cloudflareaccess.com`
- **CF_ACCESS_AUDIENCE:** Set as a `vars` entry in `wrangler.jsonc` (NOT a secret — the emdash plugin reads it via `process.env` which on Workers only has access to vars, not secrets)
- **Authorized users:** Configured in CF Access dashboard (Google IdP)
- **Auto-provision:** First authenticated user automatically becomes Admin

### Important: CF_ACCESS_AUDIENCE must be a var, not a secret

The `@emdash-cms/cloudflare` access plugin reads the audience tag via `process.env[envVarName]` at runtime. On Cloudflare Workers with `nodejs_compat`, `process.env` is populated from `wrangler.jsonc` vars — NOT from Worker secrets. If `CF_ACCESS_AUDIENCE` is set as a secret instead of a var, the plugin throws "Environment variable not found" and authentication fails.

The AUD tag is not sensitive — it's a public identifier visible in every CF Access JWT.

Decision rationale: [AD14](decisions/README.md#ad14-emdash-cms-auth-switched-to-cloudflare-access).

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
- [Configuration](configuration.md#secrets) — Secrets and environment variables
- [Architecture](architecture.md#authentication-model) — Where auth fits in the system
- [Decisions](decisions/README.md#ad14-emdash-cms-auth-switched-to-cloudflare-access) — Why CF Access replaced Magic Link
