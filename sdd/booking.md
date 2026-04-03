# Booking

Request-to-book inquiry flow, business rules, server pipeline, WhatsApp integration, and trust signals.

## Key Concepts

- **Request-to-book**: Structured inquiry with dates, guests, apartment — not a generic contact form
- **Inquiry pipeline**: Form submission -> Turnstile validation -> persist to D1 -> send via Resend -> auto-reply to guest
- **Inquiry lifecycle**: new -> read -> responded -> confirmed (blocks dates) / declined
- **WhatsApp**: Floating button with pre-filled message as alternative contact channel
- **Quick question**: Low-friction contact path for visitors who don't have dates yet

## Requirements

### REQ-BK-1: Request-to-Book Widget

- **Intent:** Capture high-intent booking inquiries with structured data
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Two tabs: "Book" (structured inquiry) and "Quick Question" (freeform, no dates required)
  - **Book tab fields:** check-in date, check-out date, adults, children under 12, children 12-17, apartment (pre-selected on detail page), name, email, phone/WhatsApp (optional), message (optional), pets checkbox with note field
  - **Quick question tab fields:** name, email, message (required). For visitors who want to ask "Is the property suitable for my elderly parents?" before picking dates.
  - Date picker localized per locale, weeks start Monday
  - Booked dates disabled in picker (synced with availability)
  - Minimum stay enforced: checkout dates that violate minimum stay for selected season are disabled
  - Check-out must be after check-in; same-day check-in/out rejected
  - Guest count (adults + children) cannot exceed apartment capacity
  - On date selection: computed price estimate with itemized breakdown:
    - Nightly rate per season (split if stay spans seasons)
    - Number of nights
    - Subtotal
    - Tourist tax (€X/person/night, children under 12 exempt — per Croatian law)
    - Cleaning fee if applicable
    - Total estimate
    - "This is an estimate. Final price confirmed by owner."
  - Auto-generated summary: "Interested in Apartment Lavanda, 2 adults + 1 child, 5-12 August"
  - GDPR consent checkbox (unchecked by default): "I agree to the processing of my data per the [Privacy Policy](/privacy)"
  - Turnstile widget in invisible mode validates before submission
  - Submit button with fill-sweep hover animation
  - On success: confirmation + "This is a request, not a confirmed booking. Dates are not secured until we confirm. We typically respond within 2 hours."
  - On failure: clear error message, form state preserved
  - On stale availability (server rejects): "Sorry, these dates are no longer available. Please select different dates."
  - **Turnstile token expiry:** Tokens expire after ~5 minutes. If server returns `403 Token Expired`, client preserves all form data, resets Turnstile widget silently, shows: "Security check expired. Please click submit again." No data lost.
  - Fully usable on mobile — large touch targets, native date inputs
  - Form labels per locale (not placeholder-only)
- **Constraints:** CON-SEC, CON-PERF, CON-A11Y, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-AP-1, REQ-AP-4, REQ-AP-5, REQ-BK-6
- **Verification:** Submit test inquiry, verify email delivery, test Turnstile, test min stay enforcement, test cross-season pricing, test capacity rejection
- **Status:** Deprecated - email-based workflow sufficient

> **Note:** The interim contact page (REQ-BK-8) currently serves as the primary inquiry entry point. REQ-BK-1's full two-tab widget with date picker, pricing, and availability will replace it.

### REQ-BK-2: Inquiry Server Pipeline

- **Intent:** Reliably process and deliver inquiries
- **Applies To:** System
- **Acceptance Criteria:**
  - All date logic uses property timezone: `Europe/Zagreb`
  - Nights computed by local calendar dates, not UTC
  - Server validates all fields (Zod schema): dates, capacity, minimum stay, availability
  - **Availability revalidated server-side at submit time** — rejects if dates booked since page load
  - Turnstile token verified server-side via Cloudflare API
  - Inquiry persisted to D1 `inquiries` table before email attempt with status `new`
  - Input sanitized: all user-supplied fields stripped of HTML before rendering in email output, email header injection prevented, URLs stripped from message body
  - Honeypot hidden field for bot detection (in addition to Turnstile)
  - Email to owner via Resend: formatted HTML with all inquiry details, computed price, guest contact, one-tap "Confirm & Block Dates" link (deep link to admin action). Sent from `noreply@graymatter.ch`.
  - Auto-reply to guest via Resend: confirmation with apartment name, dates, **explicit disclaimer: "This is a request, not a confirmed booking. Dates are not held automatically."**, response time promise. Sent from `noreply@graymatter.ch`.
  - **Email delivery via outbox pattern:**
    - Inquiry persisted to D1 with `email_status: pending`
    - Immediate send attempt (one try in request lifecycle)
    - On failure: `email_status: retry`, `retry_at` set to now + 2 minutes
    - Cron Trigger (every 5 minutes) processes retries, max 3 attempts total
    - After 3 failures: `email_status: failed`, inquiry still safe in D1, visible in admin with "Email delivery failed" badge
  - Rate limit: enforced via **Cloudflare WAF Rate Limiting Rules** (not application code). Max 5 POST requests to `/api/inquiry` per IP per 10 minutes. Turnstile is the primary bot defense; WAF rate limit is the secondary layer.
  - **API response contract:**
    - `200` success — inquiry saved, email sent (or queued)
    - `202` success with caveat — inquiry saved, email delivery failed (shown to user: "Inquiry received. If you don't hear from us within 4 hours, please try WhatsApp.")
    - `400` validation error — missing/invalid fields, consent not checked, capacity exceeded, min stay violated
    - `403` Turnstile failure or token expired (client refreshes widget, preserves form data)
    - `409` stale availability — dates no longer available (client refreshes calendar)
    - `429` rate limited (WAF-level, generic Cloudflare error page)
    - `500` server error (branded 500 page)
    - All error messages localized per active locale
  - Log: timestamp, locale, apartment, source (form/quick-question), referrer
- **Constraints:** CON-SEC, CON-PERF
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
  - **Email delivery verified:** Owner email and guest auto-reply must actually send via Resend using `RESEND_API_KEY` from Worker env. The `env as unknown as Env` cast pattern must successfully access the key at runtime. Email delivery must be verified with a real test submission, not just by reading code.
- **Verification:** End-to-end test with real Resend + Turnstile: submit inquiry from live site → verify owner receives email → verify guest receives auto-reply. Test availability race condition.
- **Status:** Partial — API endpoint exists, persists inquiries to D1, Turnstile verification works, honeypot filtering works, input sanitization works, owner email sends via Resend (unverified live). CRITICAL GAP: `buildGuestEmail()` function exists in inquiry.ts but is NEVER CALLED -- guest auto-reply is dead code. Outbox retry pattern partially implemented (email_status/retry_at columns exist, immediate retry on failure) but Cron Trigger for retries not implemented. Email delivery via RESEND_API_KEY from Worker env not verified end-to-end.

### REQ-BK-3: WhatsApp Floating Button

- **Intent:** Instant conversational contact channel
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Floating button bottom-right (above sticky CTA on mobile, not overlapping)
  - Opens WhatsApp with pre-filled localized message including apartment name and dates if selected
  - Generic message if no apartment context
  - Appears after 3s delay, subtle slide-in
  - Owner configures WhatsApp number in CMS site-settings
  - Not shown if no number configured
  - **Failure mode:** Malformed WhatsApp number (non-numeric, missing country code): CMS validates format on save with preview of generated link. Invalid numbers rejected with "Enter number with country code, e.g., +385..."
- **Constraints:** CON-PERF
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Test on mobile (actual WhatsApp open), test per locale
- **Status:** Deprecated - only inquiry via contact form

### REQ-BK-4: Click-to-Call

- **Intent:** Direct phone contact for visitors who prefer calling
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Phone number displayed in footer and on apartment detail page as `tel:` link
  - On mobile: tapping opens dialer
  - Owner configures phone number in CMS site-settings
  - Not shown if no number configured
  - Tracked as conversion event
- **Constraints:** CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-CMS-1
- **Verification:** Test on mobile
- **Status:** Deprecated - email-based workflow sufficient

### REQ-BK-5: Direct Booking Benefits Strip

- **Intent:** Convince visitors to book direct instead of via OTAs
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Displayed near inquiry widget on apartment detail page
  - 3-4 benefits with icons: "No platform fees", "Direct contact with owner", "Local tips included", "Flexible communication"
  - Subtle trust signal styling, not aggressive marketing
  - CMS-managed per locale
  - Toggleable via section settings (REQ-CMS-5)
- **Constraints:** CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5
- **Verification:** Visual review
- **Status:** Deprecated - email-based workflow sufficient

### REQ-BK-6: Booking Business Rules

- **Intent:** Define validation and pricing rules for all booking interactions
- **Applies To:** System
- **Acceptance Criteria:**
  - **Timezone:** All date/time logic uses `Europe/Zagreb` (CET/CEST)
  - **Check-in/out times:** Configurable in CMS site-settings (default: check-in 14:00, check-out 10:00). Displayed on apartment pages and in confirmation emails.
  - **Minimum stay:** Per season per apartment. Enforced in date picker UI and server-side.
  - **Capacity:** Max adults + children per apartment. Enforced in form and server-side. Infants (0-2) do not count toward capacity.
  - **Season validation rules:**
    - Seasons for an apartment may not overlap (CMS validates on save)
    - Season date ranges are inclusive: `[start_date, end_date]` where each date represents a bookable night
    - Every bookable date should be covered by exactly one season. If selected dates include days without a defined season, inquiry form shows: "Pricing not yet available for these dates. Please use Quick Question tab."
    - CMS warns owner if next 12 months have pricing gaps
  - **Cross-season minimum stay:** When a stay spans multiple seasons, the minimum stay rule of the **check-in date's season** applies.
  - **Pricing computation:**
    - Stays spanning multiple seasons: split at season boundary, each segment priced at its season rate
    - Tourist tax: per person per night, children under 12 exempt (Croatian law). Form collects children in two age buckets (under 12, 12-17) to compute tax correctly. Rate configurable in CMS.
    - Cleaning fee: optional per-stay flat fee, configurable per apartment
    - All prices in EUR, displayed with locale formatting
    - Total shown as estimate with "Final price confirmed by owner" disclaimer
  - **Availability data model:**
    - Availability blocks stored in separate `availability_blocks` table (not inside apartment records)
    - Date ranges are **night-based:** `[check_in, check_out)` — checkout date is NOT blocked (available for new check-in that day)
    - Overlap query: `WHERE apartment_id = ? AND check_in < ? AND check_out > ?` (half-open interval)
    - Manually managed by owner. Server-side revalidation at inquiry submit. No automatic date holds.
  - **Inquiry is not a booking:** Explicitly communicated in UI and emails. Multiple inquiries for same dates are allowed.
- **Constraints:** CON-SEC, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-AP-4, REQ-AP-5
- **Verification:** Test cross-season pricing, min stay, capacity, timezone handling
- **Status:** Partial — Server-side pricing computation (`pricing.ts`) and availability data model (D1 `availability_blocks` table with half-open intervals) are implemented. Cross-season pricing, tourist tax computation, and cleaning fee logic work in the inquiry API. However, CMS-facing features are missing: owner cannot configure check-in/out times, minimum stay, or season pricing via admin. Season validation rules (no overlap, gap warnings) not enforced in CMS. All pricing currently comes from seed data, not owner-managed.

### REQ-BK-7: Inquiry Lifecycle

- **Intent:** Track inquiry status from submission to resolution
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - Inquiry statuses in D1: `new`, `read`, `responded`, `confirmed`, `declined`, `spam`
  - Owner receives rich HTML email with all details. Primary workflow is email reply — no need to open admin.
  - D1 serves as backup log and status tracker, not primary inbox.
  - Admin shows inquiry list: guest name, apartment, dates, status, timestamp. Sorted newest first.
  - One-tap actions on phone: "Confirm + Block Dates", "Decline", "Mark Spam"
  - **"Confirm + Block Dates" security:** Email contains link to authenticated admin confirmation page (not a direct state-changing GET). Requires valid admin session + CSRF token. Optional signed single-use token in URL preselects the inquiry (expires 48h). If session expired, prompts login, then returns to confirmation page.
  - "Confirm + Block Dates" runs in two sequential steps: (1) atomic INSERT...WHERE NOT EXISTS in a D1 batch — overlap check and availability block insertion in a single statement prevents race conditions (TOCTOU); (2) only if the INSERT affected rows, a separate UPDATE sets inquiry status to `confirmed`. If the INSERT is a no-op (date conflict), return 409 without changing inquiry status — this prevents false confirmations where the status would update despite no block being created. If overlap detected: conflict resolution screen showing both bookings.
  - Conflict warning if confirming dates that overlap an existing booking
  - Unread count badge in admin nav
- **Constraints:** CON-CMS
- **Priority:** P1
- **Dependencies:** REQ-BK-2, REQ-CMS-1, REQ-AP-5
- **Verification:** Full lifecycle test: submit inquiry -> owner confirms -> dates blocked -> calendar updated
- **Status:** Deprecated - email-based workflow sufficient

### REQ-BK-8: Contact Inquiry Page

- **Intent:** Provide an immediate, low-friction inquiry path while the full request-to-book widget (REQ-BK-1) is not yet built
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/kontakt` with photo-backed hero (REQ-VD-12) and two-column layout (info + form)
  - Form fields: name (required), email (required), phone (optional), check-in date (native date input, optional), check-out date (native date input, optional), number of guests (number input, optional), message (required)
  - Check-in and check-out are separate `type="date"` inputs; the browser renders its native date picker per locale. Dates and guest count are appended to the message body in the API payload so the owner sees all details in a single field.
  - All field labels localized in 4 locales (hr, de, sl, en) — labels are visible, not placeholder-only
  - Honeypot hidden field (`website`) for bot filtering, off-screen with `aria-hidden`
  - GDPR consent checkbox (unchecked by default, required to submit)
  - Turnstile widget in managed mode with site key, loaded async
  - Submits to `/api/inquiry` as JSON with `type: "question"`
  - On success: green confirmation message with 2-hour response promise, form resets, Turnstile resets
  - On error: terracotta error message, form state preserved (button re-enabled)
  - Submit button disabled during request with localized "Sending..." text
  - Status messages use `aria-live="polite"` for screen reader announcement
  - All site CTAs (navigation desktop + mobile, homepage CTA section, apartment detail price card) link to `/{locale}/kontakt` instead of anchor-based inquiry targets
  - Contact info section displays email and location
- **Constraints:** CON-SEC, CON-A11Y, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-BK-2, REQ-TC-5
- **Verification:** Submit test inquiry from each locale on the **live site**, verify Turnstile renders and validates, verify honeypot hidden, verify GDPR required, verify CTA links resolve, verify form actually submits and owner receives notification email. Not just code review — real end-to-end submission.
- **Status:** Partial — form renders with Turnstile, but never tested with real submission on live site; email delivery unverified

## Out of Scope

- Online payment / credit card processing
- Instant booking confirmation
- Guest messaging system within the site
- Channel manager integration
- Automatic date holds on inquiry

## Domain Dependencies

- Apartments (apartment data, pricing, availability, capacity)
- CMS (inquiry storage, admin actions, section toggles)
- i18n (form labels, auto-reply, pre-filled messages, date formatting)
- Trust & Compliance (Turnstile, rate limiting, GDPR consent, privacy policy)
