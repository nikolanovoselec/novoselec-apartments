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
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), payment=(), usb=()` |
| `Content-Security-Policy` | See below |

HSTS enforces HTTPS for 1 year including subdomains. The `preload` directive is intentionally omitted — preloading requires explicit submission to browser preload lists and is an irreversible commitment; the current policy enforces HTTPS without that constraint. COOP (`same-origin-allow-popups`) prevents cross-origin windows from sharing a browsing context group except for popups the page itself opened, mitigating Spectre-class attacks while allowing OAuth and payment flows that open popups. CORP (`same-origin`) blocks cross-origin reads of responses from this origin.

## Content Security Policy

Two CSP tiers are applied based on route prefix:

**Visitor pages** (all routes except `/_emdash/` and `/admin/`):

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
connect-src 'self' https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
font-src 'self';
object-src 'none';
base-uri 'self'
```

Note: `'unsafe-inline'` is present on `script-src` for visitor pages. This is required for Astro's `is:inline` scripts used in the navigation, hero carousel, and scroll-reveal components. See `src/middleware/headers.ts` for the authoritative CSP string.

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

Login attempts are rate-limited per email address: maximum 5 code sends per rolling hour, enforced in D1. `POST /admin/api/login` always returns `{ success: true }` regardless of outcome to prevent enumeration across three branches: non-admin email, rate-limit lockout, and Resend delivery failure. When Resend fails the stored code is deleted (so it does not consume the brute-force quota) and success is returned — the caller cannot distinguish a delivery failure from a successful send.

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
| `sanitizeMessage()` | Full pipeline for message bodies: strip HTML → strip URLs → trim |
| `sanitizeName()` | Strip HTML, limit to 200 characters |
| `sanitizeEmail()` | Normalize + regex validate email format |
| `sanitizePhone()` | Strip non-phone characters, enforce 6–20 char length |
| `validateWhatsAppNumber()` | Must start with `+` and country code, 10–15 digits; returns `null` if invalid |

## Media Path Validation

`GET /api/img/[key]` rejects any key containing `..` or starting with `/` with a `400 Invalid key` response before the R2 lookup runs. This prevents path traversal attempts against the R2 bucket. The previous `/media/[...key]` route has been removed; the validation logic moved with it to `src/pages/api/img/[key].ts`.

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

The redirects middleware enforces canonical URLs: trailing slashes are removed with a 301 redirect. This prevents duplicate content and reduces attack surface from path normalization issues. `/_emdash/` paths are excluded from this rule — the CMS mounts under that prefix and requires the trailing slash to function correctly.

## Static Asset Cache Headers

Cache-Control rules for static assets are configured in `public/_headers`, which Cloudflare reads as origin-level headers. Rules applied:

| Path pattern | Cache-Control |
|---|---|
| `/_astro/*` | `public, max-age=31536000, immutable` (content-hashed by Astro) |
| `/*.woff2`, `/*.woff` | `public, max-age=2592000` (30 days) |
| `/api/img/*` | `public, max-age=86400, stale-while-revalidate=604800` |
| `/logo.png` | `public, max-age=2592000` (30 days) |
| `/favicon*`, `/apple-touch-icon*`, `/android-chrome*`, `/site.webmanifest` | `public, max-age=2592000` (30 days) |
| `/*` (HTML pages) | `public, max-age=3600, stale-while-revalidate=86400` |

These rules are applied by Cloudflare's edge before the request reaches the Worker. The `/api/img/*` rule is separate from the immutable rule because image keys are UUIDs but the response bodies can be updated by replacing the R2 object.

## Vulnerability Disclosure

`/.well-known/security.txt` is served by Cloudflare (not a static file in the repo). It follows the [securitytxt.org](https://securitytxt.org/) standard (RFC 9116) and declares the contact address, preferred languages, canonical URL, and an expiry date. Researchers who discover a vulnerability can reference this file to find the responsible disclosure contact. The content is managed in the Cloudflare dashboard and must be updated before the `Expires` date.

---

## Related Documentation

- [Authentication](authentication.md#cloudflare-access) — Auth flow and token details
- [Configuration](configuration.md#secrets) — Secret env vars
- [Architecture](architecture.md#request-lifecycle) — Where middleware runs in the pipeline
