# Security

Security model, headers, bot protection, and input sanitization.

**Audience:** Developers, Security

---

## Security Headers

All responses pass through `src/middleware/headers.ts`. Headers are set unconditionally on every response.

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | See below |

## Content Security Policy

Two CSP tiers are applied based on route prefix:

**Visitor pages** (all routes except `/_emdash/` and `/admin/`):

```
default-src 'self';
script-src 'self' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
connect-src 'self';
frame-src https://challenges.cloudflare.com;
font-src 'self';
object-src 'none';
base-uri 'self'
```

**Admin pages** (`/_emdash/` and `/admin/`):

```
default-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
img-src 'self' data: blob: https:;
connect-src 'self' https:;
frame-src 'self' https://challenges.cloudflare.com
```

The relaxed admin CSP accommodates the Emdash CMS which requires `unsafe-inline` and `unsafe-eval` for its editor interface.

## Rate Limiting

### Auth Code Requests

Login attempts are rate-limited per email address: maximum 5 code sends per rolling hour, enforced in D1. The lockout is silent — the endpoint always returns `{ success: true }` to prevent enumeration of both email validity and lockout state.

See [Authentication](authentication.md#rate-limiting) for implementation detail.

### Form Submissions

All public inquiry forms require a valid Cloudflare Turnstile token. The token is verified server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` before any processing occurs. On `POST /api/inquiry`, Turnstile verification runs before any D1 write or email dispatch.

## Bot Protection (Turnstile)

Cloudflare Turnstile is used on all public-facing forms. Server-side verification in `src/lib/turnstile.ts` uses `fetch()` with a 10-second timeout. A 10-second `AbortSignal.timeout` is applied to prevent hanging on network errors.

Turnstile widget requires `TURNSTILE_SITE_KEY` (public, safe to embed). Server verification requires `TURNSTILE_SECRET_KEY` (secret, never exposed to browser).

## Input Sanitization

All form inputs are sanitized before processing or storage. Sanitization functions live in `src/lib/sanitize.ts`:

| Function | Purpose |
|---|---|
| `stripHtml()` | Remove HTML tags |
| `sanitizeEmailField()` | Strip newlines/CR (prevents email header injection) |
| `stripUrls()` | Replace `http(s)://` URLs with `[link removed]` (anti-spam) |
| `sanitizeMessage()` | Full pipeline for message bodies: strip URLs → strip HTML → trim |
| `sanitizeName()` | Strip HTML, limit to 200 characters |
| `sanitizeEmail()` | Normalize + regex validate email format |
| `sanitizePhone()` | Strip non-phone characters, enforce 6–20 char length |

## Schema Validation

All API inputs are validated with Zod before any business logic runs. The inquiry schemas (`src/schemas/inquiry.ts`) enforce:

- Required fields and types
- String length limits
- Date format (`YYYY-MM-DD` regex)
- Integer ranges for guest counts
- `gdprConsent: true` literal (must be explicitly checked)
- Honeypot field must be empty (`z.string().max(0)`)
- Turnstile token required
- `checkOut > checkIn` cross-field refinement (booking type only)

## Honeypot

`POST /api/inquiry` includes a `honeypot` field (`z.string().max(0)`). Any non-empty value triggers a silent fake-success response — the request is discarded with no D1 write or email, and the bot receives `{ "success": true }`. This prevents discovery of the bot-rejection mechanism.

## Availability Double-Check

On booking inquiries, `POST /api/inquiry` re-queries `availability_blocks` for overlap immediately before the D1 insert. This guards against the race condition where dates appeared available on the client but were taken between page load and form submission. A `409 stale_availability` is returned to the guest if overlap is detected.

On `POST /admin/api/inquiries/:id/confirm`, overlap detection is built into the D1 batch itself using `INSERT...WHERE NOT EXISTS`. The INSERT and the status update execute atomically — if the INSERT finds a conflicting block it writes zero rows, and the endpoint returns `409 date_conflict` with no partial state written. There is no separate pre-check step.

## Authentication Security

See [Authentication](authentication.md) for the full model. Key properties:

- Auth codes are SHA-256 hashed before storage — plaintext never persists.
- Refresh tokens are SHA-256 hashed before storage.
- JWT uses HMAC-SHA-256 via Web Crypto API.
- All auth cookies are `HttpOnly; Secure; SameSite=Lax`.

## URL Normalization

The redirects middleware enforces canonical URLs: trailing slashes are removed with a 301 redirect. This prevents duplicate content and reduces attack surface from path normalization issues.

---

## Related Documentation

- [Authentication](authentication.md#magic-link-flow) — Auth flow and token details
- [Configuration](configuration.md#secrets) — Secret env vars
- [Architecture](architecture.md#request-lifecycle) — Where middleware runs in the pipeline
