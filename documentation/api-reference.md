# API Reference

All public and internal API endpoints for Apartmani Pašman.

**Audience:** Developers

---

## Public API

### GET /sitemap.xml

Dynamic multilingual sitemap. Generates one `<url>` entry per locale per page, with `xhtml:link` alternate entries for all four active locales and an `x-default` pointing to the Croatian (`hr`) variant.

**Authentication:** None required.

**Response:** `application/xml` — a Sitemap Protocol 0.9 document with `xmlns:xhtml` alternates.

**Included pages:** `/`, `/apartmani`, `/zdrelac`, `/galerija`, `/hrana`, `/aktivnosti`, `/plaze`, `/kontakt`, `/zasto-pasman`, `/dolazak`, `/vodic`, `/o-nama`, `/faq`, `/privatnost`, `/impressum` — each emitted once per locale, producing 60 `<url>` entries (15 pages × 4 locales).

**Cache:** `Cache-Control: public, max-age=3600`.

**Implementation:** `src/pages/sitemap.xml.ts`.

---

### GET /robots.txt

Dynamic robots.txt. Allows all crawlers on public pages and disallows crawling of admin, CMS, media, and API paths. References the sitemap URL dynamically using the request origin.

**Authentication:** None required.

**Response:** `text/plain`.

**Disallowed paths:** `/admin/`, `/_emdash/`, `/media/` (stale — route removed), `/api/`.

**Cache:** `Cache-Control: public, max-age=86400`.

**Implementation:** `src/pages/robots.txt.ts`.

---

### GET /api/img/:key

Serves a photo from the `apartmani-media` R2 bucket. This is the sole image-serving route for all photos — hero carousel, page heroes, apartment galleries, gallery page, and editorial content rows.

Two key formats are accepted:

- **Descriptive slugs** — for photos bulk-uploaded with human-readable names (e.g., `nikola-kitchen`, `zadar-colorful-rooftops`). No file extension.
- **UUID keys** — for photos uploaded via the admin media library (e.g., `aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg`). Extension included.

**Authentication:** None required.

**Path Parameters:**

| Parameter | Format | Description |
|---|---|---|
| `key` | Descriptive slug or `<uuid>.<ext>` | R2 object key — either a descriptive slug or a UUID with extension |

**Response:** Binary image data (`image/jpeg`, `image/png`, `image/webp`, etc.) with `Cache-Control: public, max-age=31536000, immutable`.

**Error responses:**

| Status | Condition |
|---|---|
| `400` | Empty key, path traversal (`..`), or leading slash |
| `404` | Object not found in R2 |
| `503` | R2 bucket not configured |

**Implementation:** `src/pages/api/img/[key].ts`. Tries `locals.emdash.storage.download(key)` first; falls back to `env.MEDIA` bucket access.

**Note:** The previous `/media/[...key]` route has been removed. All image references use `/api/img/:key`.

---

### GET /api/apartments/:id/availability

Returns booked dates for a single apartment within a date range. Used by the availability calendar on apartment pages.

**Authentication:** None required.

**Query Parameters:**

| Parameter | Format | Required | Description |
|---|---|---|---|
| `start` | `YYYY-MM-DD` | Yes | Range start (inclusive) |
| `end` | `YYYY-MM-DD` | Yes | Range end (exclusive) |

**Response:**

```json
{
  "bookedDates": ["2026-07-01", "2026-07-02", "2026-07-03"],
  "blocks": 1
}
```

- `bookedDates` — array of individual booked night dates within the requested range, sorted ascending
- `blocks` — number of overlapping availability blocks found

**Cache:** `Cache-Control: private, no-store` — always returns fresh data.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Missing `id`, `start`, or `end` |

**Implementation:** `src/pages/api/apartments/[id]/availability.ts`, uses `getBookedDatesInRange()` from `src/lib/availability.ts`.

---

### POST /api/track

Cookieless analytics event logging. Writes to the D1 `events` table. No PII is stored — only event type, apartment slug, locale, page path, and timestamp.

**Authentication:** None required.

**Request body (JSON):**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | Yes | One of the valid event types (see below) |
| `apartmentSlug` | `string` | No | Slug of the apartment being viewed |
| `locale` | `string` | No | Active locale (`hr`, `de`, `sl`, `en`) |
| `pagePath` | `string` | No | URL path of the page |

**Valid event types:**

| Type | Triggered by |
|---|---|
| `inquiry_submit` | Booking inquiry form submitted |
| `question_submit` | Quick question form submitted |
| `whatsapp_click` | WhatsApp CTA clicked |
| `call_click` | Phone number CTA clicked |
| `apartment_view` | Apartment detail page viewed |
| `gallery_open` | Photo gallery opened |
| `language_switch` | Language switcher used |
| `calendar_select` | Date selected in availability calendar |

**Response:**

```json
{ "ok": true }
```

**Cache:** `Cache-Control: private, no-store`.

**Errors:**

| Status | Condition |
|---|---|
| `400` | Missing or unrecognized `type` field |

**Implementation:** `src/pages/api/track.ts`.

---

### POST /api/inquiry

Submits a booking inquiry or quick question. Used by apartment detail page booking forms (`type: "booking"`), apartment quick-question modals (`type: "question"`), and the standalone contact page at `/:locale/kontakt` (`type: "question"`). Full server pipeline: Turnstile verification, honeypot check, Zod validation, server-side availability revalidation (booking type only), D1 persistence, and dual-email dispatch (owner notification + guest auto-reply).

**Authentication:** None required.

**Request body (JSON) — booking inquiry:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `"booking"` | Yes | Discriminator |
| `apartmentId` | `string` | Yes | Apartment slug |
| `checkIn` | `YYYY-MM-DD` | Yes | Check-in date |
| `checkOut` | `YYYY-MM-DD` | Yes | Check-out date (must be after `checkIn`) |
| `adults` | `integer 1–20` | Yes | Adult guest count |
| `childrenUnder12` | `integer 0–10` | Yes | Children under 12 |
| `children12to17` | `integer 0–10` | Yes | Children aged 12–17 |
| `name` | `string 1–200` | Yes | Guest name |
| `email` | `string` | Yes | Guest email |
| `phone` | `string max 20` | No | Guest phone |
| `message` | `string max 2000` | No | Optional message |
| `hasPets` | `boolean` | No | Pets flag |
| `petNote` | `string max 500` | No | Pet details |
| `gdprConsent` | `true` | Yes | Must be exactly `true` |
| `turnstileToken` | `string` | Yes | Cloudflare Turnstile token |
| `honeypot` | `string max 0` | No | Must be empty (bot trap) |
| `locale` | `hr\|de\|sl\|en` | Yes | Submission locale |

**Request body (JSON) — quick question:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `"question"` | Yes | Discriminator |
| `name` | `string 1–200` | Yes | Guest name |
| `email` | `string` | Yes | Guest email |
| `message` | `string 1–2000` | Yes | Question text |
| `gdprConsent` | `true` | Yes | Must be exactly `true` |
| `turnstileToken` | `string` | Yes | Cloudflare Turnstile token |
| `honeypot` | `string max 0` | No | Must be empty (bot trap) |
| `locale` | `hr\|de\|sl\|en` | Yes | Submission locale |
| `apartmentId` | `string` | No | Optional apartment context |

**Response on success (`200`):**

```json
{ "success": true }
```

**Response when inquiry saved but email delivery failed (`202`):**

```json
{ "success": true, "emailFailed": true, "message": "Inquiry received. If you don't hear from us within 4 hours, please try WhatsApp." }
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | Invalid JSON body |
| `400` | Zod validation failure — returns `{ "error": "validation_error", "message": "...", "field": "..." }` |
| `403` | Turnstile verification failed — returns `{ "error": "turnstile_failed" \| "turnstile_expired" }` |
| `409` | Dates no longer available — returns `{ "error": "stale_availability" }` (booking type only) |

**Notes:**

- Honeypot triggers a fake `{ "success": true }` with no processing (silent bot rejection).
- The inquiry is written to D1 before email dispatch — data is never lost on email failure.
- `email_status` is set to `sent` or `retry`; on failure `retry_at` is set to `+2 minutes`.
- Price estimate is computed from the `seasons` table and stored on the inquiry row.

**Implementation:** `src/pages/api/inquiry.ts`.

---

## Admin API

All admin endpoints are under `/admin/api/` and require a valid `auth_token` JWT cookie. See [Authentication](authentication.md#magic-link-flow) for the auth flow.

### POST /api/admin/seed

One-shot endpoint to seed all Emdash CMS collections with the preloaded content from `seed/seed.json`. Safe to run multiple times — idempotent via `applySeed`.

**Authentication:** Requires `X-Seed-Token` header matching the `EMDASH_AUTH_SECRET` Worker secret. Returns `401` if the header is missing, empty, or does not match. Cloudflare Access only protects `/_emdash/*` — this endpoint lives under `/api/` which is reachable on the workers.dev subdomain without Access, so the shared-secret check is the only auth guard.

**Request headers:**

| Header | Required | Description |
|---|---|---|
| `X-Seed-Token` | Yes | Must match the `EMDASH_AUTH_SECRET` Worker secret |

**Request body:** None.

**Response on success (`200`):**

```json
{ "success": true, "result": { ... } }
```

`result` contains the Emdash `applySeed` return value (counts of inserted/skipped records per collection).

**Response on auth failure (`401`):**

```json
{ "error": "Authentication required" }
```

**Response on failure (`500`):**

```json
{ "error": "Seed failed" }
```

**Notes:**

- Reads `seed/seed.json` at build time (static import). The file defines 6 Emdash collections: `pages`, `apartments`, `faq`, `guide`, `testimonials`, `amenities`.
- Call this endpoint once after first deploy to populate CMS content. After seeding, content is editable through the Emdash admin panel at `/_emdash/`.

**Implementation:** `src/pages/api/admin/seed.ts`, uses `applySeed` and `getDb` from `emdash`.

---

### POST /admin/api/login

Initiates Magic Link auth — sends a 6-digit code to the provided email address.

**Request body:**

```json
{ "email": "owner@example.com" }
```

**Response:** Always `{ "success": true }` (prevents email enumeration).

**Rate limit:** 5 code sends per email per rolling hour.

---

### POST /admin/api/verify

Verifies a 6-digit login code and issues auth cookies.

**Request body:**

```json
{ "email": "owner@example.com", "code": "123456" }
```

**Response on success:** `{ "success": true }` + sets `auth_token` and `refresh_token` cookies.

---

### POST /admin/api/upload-url

Generates a presigned R2 PUT URL for direct browser-to-R2 uploads.

**Authentication:** JWT required.

**Request body (JSON):**

| Field | Type | Required | Description |
|---|---|---|---|
| `filename` | `string max 200` | Yes | Original filename — extension used for the R2 object key |
| `contentType` | `string` | No | MIME type. Defaults to `application/octet-stream` if omitted |

**Allowed content types:** `image/jpeg`, `image/png`, `image/heic`, `image/heif`, `image/webp`, `image/avif`.

**Allowed file extensions:** `jpg`, `jpeg`, `png`, `heic`, `heif`, `webp`, `avif`. The extension is extracted from `filename` and validated against this allowlist independently of `contentType` to prevent arbitrary key suffixes on the R2 object.

**Response on success (`200`):**

```json
{ "presignedUrl": "https://...", "key": "uuid.ext" }
```

- `presignedUrl` — signed PUT URL valid for use directly from the browser
- `key` — opaque `UUID.ext` object key; use this as the media reference after upload completes

**Errors:**

| Status | Condition |
|---|---|
| `400` | Missing `filename`, or `filename` exceeds 200 characters |
| `400` | `contentType` not in the allowed MIME type list |
| `400` | Extension extracted from `filename` not in the allowed extension list |
| `401` | Missing or invalid `auth_token` cookie |
| `503` | R2 credentials not configured |

See [Architecture](architecture.md#media-pipeline) for the full upload flow.

---

### POST /admin/api/inquiries/:id/confirm

Confirms a booking inquiry and atomically blocks the dates in `availability_blocks`. Only applicable to inquiries of `type = "booking"` that have not already been confirmed.

**Authentication:** JWT required.

**URL parameter:** `:id` — numeric inquiry ID.

**Request body:** None required.

**Response on success (`200`):**

```json
{ "success": true, "message": "Inquiry confirmed, dates blocked" }
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | Missing `:id` parameter |
| `400` | Inquiry is not a booking type, or is missing apartment/date fields |
| `404` | Inquiry not found |
| `409` | Inquiry is already confirmed |
| `409` | Date conflict — returns `{ "error": "date_conflict", "message": "These dates overlap with an existing booking" }` |

**Notes:**

- Confirmation is a two-step sequence. Step 1: `INSERT INTO availability_blocks ... WHERE NOT EXISTS (overlap)` runs alone in a D1 `batch()`. If `meta.changes === 0`, a conflict existed — `409 date_conflict` is returned and inquiry status is not touched. Step 2: only if the INSERT succeeded, `UPDATE inquiries SET status='confirmed'` is executed as a separate statement.
- Keeping the INSERT alone in its batch prevents the status update from running when no block was written, which was the failure mode of the previous single-batch approach.
- The inserted block carries `source = 'inquiry'` and `inquiry_id` referencing the confirmed inquiry.

**Implementation:** `src/pages/admin/api/inquiries/[id]/confirm.ts`.

---

## Related Documentation

- [Authentication](authentication.md#magic-link-flow) — Auth flow, token details, rate limiting
- [Architecture](architecture.md#inquiry-pipeline) — Inquiry submission and confirmation flows
- [Architecture](architecture.md#request-lifecycle) — Request pipeline and middleware order
- [Architecture](architecture.md#public-page-routes) — Full list of public page routes
- [Security](security.md#honeypot) — Honeypot and availability double-check
- [Security](security.md#rate-limiting) — Rate limiting and bot protection
- [Configuration](configuration.md#d1-migrations) — D1 schema for all tables used by these endpoints
- [SEO](seo.md#structured-data) — Schema.org markup strategy for FAQPage and other types
