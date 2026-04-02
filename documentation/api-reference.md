# API Reference

All public and internal API endpoints for Apartmani Pašman.

**Audience:** Developers

---

## Public API

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

Submits a booking inquiry or quick question. Full server pipeline: Turnstile verification, honeypot check, Zod validation, server-side availability revalidation (booking type only), D1 persistence, and dual-email dispatch (owner notification + guest auto-reply).

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

**Response:**

```json
{ "url": "https://...", "key": "uuid-here" }
```

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

- Overlap detection and the availability block insert are combined into a single atomic `INSERT...WHERE NOT EXISTS` statement, executed inside a D1 `batch()` together with the status update. There is no separate pre-check — the INSERT itself is the guard.
- If `meta.changes === 0` after the INSERT, a conflict existed and `409 date_conflict` is returned with no partial state written.
- The inserted block carries `source = 'inquiry'` and `inquiry_id` referencing the confirmed inquiry.

**Implementation:** `src/pages/admin/api/inquiries/[id]/confirm.ts`.

---

## Related Documentation

- [Authentication](authentication.md#magic-link-flow) — Auth flow, token details, rate limiting
- [Architecture](architecture.md#inquiry-pipeline) — Inquiry submission and confirmation flows
- [Architecture](architecture.md#request-lifecycle) — Request pipeline and middleware order
- [Security](security.md#honeypot) — Honeypot and availability double-check
- [Security](security.md#rate-limiting) — Rate limiting and bot protection
- [Configuration](configuration.md#d1-migrations) — D1 schema for all tables used by these endpoints
