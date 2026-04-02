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

## Related Documentation

- [Authentication](authentication.md#magic-link-flow) — Auth flow, token details, rate limiting
- [Architecture](architecture.md#request-lifecycle) — Request pipeline and middleware order
- [Security](security.md#rate-limiting) — Rate limiting and bot protection
- [Configuration](configuration.md#d1-migrations) — D1 schema for all tables used by these endpoints
