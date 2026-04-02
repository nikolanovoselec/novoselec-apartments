# Changelog

## 2026-04-02 — Revision 8: Spec Sync for e5dfff9 Bugfix Commit

### AC updated
- **REQ-CMS-2:** Supported formats updated from "JPEG, PNG, HEIC, WebP" to "JPEG, PNG, HEIC, HEIF, WebP, AVIF" — matches server-side extension allowlist added in upload endpoint.
- **REQ-CMS-3:** Resend failure mode AC updated. Previous wording implied client-visible error ("Code not received? Try again"). Implementation returns success on Resend failure to prevent admin email enumeration via timing differences. AC now specifies identical success response regardless of send outcome, with server-side logging.

## 2026-04-02 — Revision 7: Security & Atomicity Fixes (4ea1d35)

### AC updated
- **REQ-BK-7:** "Confirm + Block Dates" AC updated from "D1 transaction: 1) verify no date overlap, 2) insert availability block, 3) update inquiry status" to "D1 batch (atomic): overlap check and availability block insertion happen in a single statement to prevent race conditions (TOCTOU)." Previous wording implied 3 sequential steps; implementation correctly uses INSERT...WHERE NOT EXISTS for atomic overlap prevention.
- **REQ-BK-2:** Input sanitization AC broadened from "no HTML in message" to "all user-supplied fields stripped of HTML before rendering in email output." Commit adds `stripHtml()` to apartmentId and petNote in owner notification email, not just the message field.

### Implementation progress noted (REQ-BK-7, status remains Planned)
- JWT authentication now wired into confirm endpoint (was comment-only in Phase 5). Verifies `auth_token` cookie via `verifyJWT`. Returns 401 for missing or invalid tokens.
- Remaining gaps from Revision 6 still apply: no CSRF token validation, no signed single-use URL token, no decline/spam actions, no admin inquiry list UI, no unread count badge.

### Previous gap partially resolved
- Revision 6 noted "authentication middleware not wired (comment-only)" for REQ-BK-7. JWT auth is now implemented. CSRF token remains unimplemented.

## 2026-04-02 — Revision 6: Phase 5 Implementation Sync

Spec synced with Phase 5 commit (inquiry server pipeline, confirm+block dates, email delivery, GDPR consent, analytics events).

### Status changes: Planned -> Implemented
- **REQ-BK-2:** Inquiry server pipeline — POST /api/inquiry with full pipeline: Zod validation (discriminated union for booking vs quick-question), Turnstile server-side verification, honeypot bot detection, input sanitization (HTML stripped, email header injection prevented, URL stripping), server-side availability revalidation (half-open interval overlap query), D1 persist before email attempt (data never lost), outbox pattern with retry (email_status pending->sent/retry, retry_at set on failure), owner notification + guest auto-reply via Resend (4-locale guest emails with explicit "not a confirmed booking" disclaimer), correct API response contract (200/202/400/403/409), server-side analytics event tracking (inquiry_submit/question_submit to D1 events table).
- **REQ-BK-6:** Booking business rules — server-side integration now complete. Cross-season pricing computed via `computeStayPrice` with season data from D1. Tourist tax with child exemption (under-12 exempt). Availability revalidated at submit time. Capacity validated by Zod schema. Previously only pure functions existed; now wired into the inquiry pipeline.
- **REQ-TC-5:** GDPR consent on forms — `gdprConsent: z.literal(true)` in Zod schema rejects submissions without consent. Consent timestamp stored as `gdpr_consent_at` in D1. Per-locale label text in all 4 translation files with Privacy Policy link placeholder.

### Implementation progress noted (status remains Planned)
- **REQ-BK-1:** Server-side pipeline (REQ-BK-2) fully consumes the Zod schema matching REQ-BK-1 field structure. Client-side form widget (date picker, capacity selector, tabs, UI validation feedback) not yet built. Status remains Planned.
- **REQ-BK-7:** Confirm + block dates endpoint implemented at POST /admin/api/inquiries/:id/confirm using D1 batch (overlap check, insert availability_block, update inquiry status). Missing from AC: authentication middleware not wired (comment-only), no CSRF token validation, no signed single-use URL token, no decline/spam actions, no admin inquiry list UI, no unread count badge. Status remains Planned.

### AC deviations noted (implementation gaps within Implemented requirements)
- **REQ-BK-2 AC gap — error message localization:** All error responses are in English only. Spec AC states "All error messages localized per active locale." Implementation returns English strings regardless of locale parameter.
- **REQ-BK-2 AC gap — logging:** Spec AC requires logging "timestamp, locale, apartment, source, referrer." Implementation tracks events to D1 events table but does not log referrer.
- **REQ-BK-6 AC gap — tourist tax rate:** Hardcoded to 1.35 EUR with a TODO comment. Spec requires "Rate configurable in CMS." Cleaning fee hardcoded to 0 with a TODO comment. Spec requires "configurable per apartment."
- **REQ-BK-6 AC gap — check-in/out times:** Not included in confirmation emails yet. Spec AC requires "Displayed on apartment pages and in confirmation emails."

### Previous gap resolved
- Revision 4 noted "Inquiry Zod schema exists but no server endpoint consumes it yet." This is now resolved — POST /api/inquiry fully consumes the schema.

## 2026-04-02 — Revision 5: Phase 4 Implementation Sync

Spec synced with Phase 4 commit (apartment pages, availability API, D1 schema, analytics, SEO components).

### Status changes: Planned -> Implemented
- **REQ-AP-2:** Apartment listing page — card grid with hero photo, name, capacity, beach distance, price, sea view badge, "Best for" label. Zero-apartment "Coming soon" state. Single-apartment redirect to detail. 2-column desktop / 1-column mobile. Image hover zoom. Staggered fade-up entry.
- **REQ-AP-4:** Seasonal pricing table — season name, date range, price/night, min stay columns sorted chronologically. Cleaning fee + tourist tax as separate items. "Price on request" fallback for empty seasons. Locale-aware formatting via `Intl.NumberFormat`. Disclaimer text. PAngV `showTotalPrice` prop accepted (rendering deferred to detail page integration).
- **REQ-SEO-1:** Schema.org structured data — generic SchemaOrg component supporting VacationRental, FAQPage, BreadcrumbList types. Breadcrumbs component emitting BreadcrumbList JSON-LD with correct ListItem schema.
- **REQ-SEO-3:** Analytics and conversion events — POST /api/track endpoint writing to D1 events table. All 8 event types defined (inquiry_submit, question_submit, whatsapp_click, call_click, apartment_view, gallery_open, language_switch, calendar_select). Cookieless, no PII.

### Implementation progress noted (status remains Planned)
- **REQ-AP-5:** Availability API backend implemented (GET /api/apartments/:id/availability with half-open interval query, uncached). Visual calendar component not yet built.
- **REQ-AP-6:** Photo gallery grid layout implemented (asymmetric 2fr/1fr desktop, horizontal scroll-snap mobile, "View all X photos" button, lightbox data injection). Missing: blurhash placeholder rendering, responsive srcset, clip-path animation, lightbox keyboard nav, focus trapping, image load error handling.
- **REQ-AP-3:** Amenity grid component implemented (grouped by category with icon + label). Breadcrumbs component implemented. Remaining detail page sections (hero, description, inquiry widget, trust strip, bed config, house rules, floor plan, FAQs) not yet built.

### D1 schema implemented (supporting future requirements)
- `availability_blocks` table: half-open interval `[check_in, check_out)`, source tracking (manual/ics/inquiry), apartment_id + date indexes. Supports REQ-BK-6 availability data model.
- `inquiries` table: full booking pipeline with type (booking/question), guest fields (adults, children age buckets, pets), status lifecycle (new/read/responded/confirmed/declined/spam), email outbox pattern (pending/sent/retry/failed with retry_at and attempt count), GDPR consent timestamp, Turnstile verification flag, price estimate. Supports REQ-BK-1, REQ-BK-2, REQ-BK-7.
- `events` table: analytics events with type, apartment_slug, locale, page_path. Supports REQ-SEO-3.
- `redirects` table: slug history with locale, entity type, old/current slug. Supports REQ-CMS-7, REQ-SEO-7.

### Minor AC gaps noted (no status impact)
- REQ-AP-2: `valueProp` field exists in data type but is not rendered on listing cards. AC specifies "one-line value proposition" on cards.
- REQ-AP-4: PAngV total price display (AC for German locale) has the `showTotalPrice` prop wired but no conditional total price row rendered yet.
- REQ-SEO-3: Cloudflare Web Analytics beacon (pageview analytics portion) not yet integrated into page layout. Server-side custom event tracking is complete.

## 2026-04-02 — Revision 4: Post-Implementation Sync (Phases 1-3)

Spec synced with implementation from last 3 commits (Phase 1: data foundation, Phase 2: visitor shell, Phase 3: auth + uploads + schema).

### Status changes: Planned -> Implemented
- **REQ-I18N-3:** UI string translations — all 4 locale JSON files, `t()` with Croatian fallback and interpolation
- **REQ-I18N-5:** Locale-aware formatting — `Intl.DateTimeFormat` and `Intl.NumberFormat` per locale
- **REQ-VD-1:** Color system — all CSS custom properties on `:root` matching spec palette
- **REQ-VD-2:** Typography system — Cormorant Garamond serif + Inter sans, German hyphenation, `font-display: swap`, 65ch body max-width
- **REQ-VD-3:** Scroll animation system — CSS-first with IntersectionObserver (fade-up, clip-path, staggered entry), reduced motion fully respected, no GSAP
- **REQ-VD-4:** Micro-interactions — button fill-sweep, image hover zoom, form focus animation, nav transition, hamburger morph to X
- **REQ-A11Y-1:** Reduced motion — `prefers-reduced-motion: reduce` disables all animations, content immediately visible
- **REQ-TC-6:** Security headers — CSP (with Turnstile, font-src, object-src none, base-uri self), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy. Relaxed CSP for admin routes.

### Implementation progress noted (status remains Planned)
These requirements have significant code in place but do not yet satisfy all acceptance criteria:
- **REQ-I18N-1:** Root redirect via Accept-Language implemented. Missing: locale cookie check at root, hreflang tags, sitemap integration, disabled locale 404 behavior, legal page DE exception.
- **REQ-SF-1:** Hero renders with gradient overlay + tagline fade-up. Missing: Ken Burns slideshow crossfade, multiple images, blurhash placeholder on load failure.
- **REQ-SF-3:** Transparent-to-solid nav with IntersectionObserver, hamburger menu, staggered mobile links, Escape to close. Missing: focus trapping in fullscreen menu.
- **REQ-SF-4:** Language switcher dropdown with ARIA. Missing: filter by active locales only, cookie persistence on switch, legal page DE exception.
- **REQ-SF-7:** Sticky mobile CTA with IntersectionObserver visibility logic. Missing: integration with real pricing data.
- **REQ-BK-3:** WhatsApp button with localized pre-filled messages and 3s delay. Missing: CMS-driven number, apartment context with dates.
- **REQ-BK-6:** Cross-season pricing, tourist tax child exemption, min stay by check-in season all implemented as pure functions. Missing: server-side integration, CMS-driven season data.
- **REQ-CMS-3:** Magic Link auth fully implemented — 6-digit code via Resend, SHA-256 hashed storage, JWT (1h) + refresh token (30d) in HttpOnly/Secure/SameSite=Lax cookies, brute force protection (5/hour), D1 schema. Missing: session list in admin settings, session expiry mid-edit recovery.
- **REQ-CMS-2:** Presigned R2 upload URL generation implemented. Media serving route `/media/:key` exists. Missing: actual Cloudflare Image Resizing transform application (params parsed but not passed to `cf: { image }` yet), blurhash computation, focal point, gallery reordering.
- **REQ-PERF-1:** `/media/:key` route serves from private R2 with immutable cache headers. `buildSrcset` utility generates responsive widths [400, 800, 1200, 1920]. Missing: Image Resizing `cf: { image }` transform on response, blurhash-to-sharp transition, format negotiation.
- **REQ-CMS-8:** 404 page exists with branded design and locale links. Missing: 500 page as hardcoded minimal fallback shell.
- **REQ-SEO-7:** Trailing slash 301 redirect middleware. Canonical URL on all pages. Missing: noindex on disabled locales/draft previews, robots.txt, media URL noindex.
- **REQ-A11Y-2:** Skip-to-content link, focus-visible outlines, Escape closes overlays. Missing: focus trapping in mobile menu/lightbox, accordion keyboard nav.

### Spec accuracy corrections
- **REQ-TC-6 AC detail:** Implementation adds `font-src 'self'`, `object-src 'none'`, and `base-uri 'self'` beyond what the spec listed. These are stricter than spec and correct for the self-hosted font setup. Updated spec AC to match.

### Quality fixes
- REQ-VD-7: Fixed "Galesnjak" typo to "Galešnjak" (matching glossary entry)

### Gaps identified (no spec change needed yet)
- Root redirect (`src/pages/index.astro`) does not check locale cookie before Accept-Language — violates the cookie-first priority in REQ-I18N-1 and REQ-SF-4. Implementation should add cookie check.
- Language switcher shows all 4 locales unconditionally — should filter by active locales per REQ-SF-4.
- Inquiry Zod schema (`schemas/inquiry.ts`) exists with discriminated union (booking vs quick-question) matching REQ-BK-1 structure, but no server endpoint consumes it yet.

## 2026-04-02 — Revision 3: Spec Quality Validation

Full 14-point spec quality audit.

### Failure modes added to P0 requirements
- REQ-AP-5: Added failure modes for availability data fetch failure and stale data (JS disabled)
- REQ-AP-6: Added failure mode for image load errors in gallery/lightbox
- REQ-SF-1: Added failure modes for hero image load error and no hero photos configured
- REQ-SF-7: Added failure mode for when no pricing is available

### Contradictions fixed
- CON-SEC: Rate limit corrected from "5 per IP per hour" to "5 per IP per 10 minutes via WAF" (aligning with REQ-BK-2)
- CON-SEC + CON-MEDIA: EXIF GPS wording corrected from "stripped from uploads" to "not exposed to visitors" (originals in R2 retain EXIF; Image Resizing strips from served derivatives) — aligning with REQ-CMS-2

### Clarifications
- REQ-AP-1: "capacity (max adults)" clarified to "max occupancy (total adults + children)" to align with REQ-BK-6 capacity rule

### Glossary additions
- Added: Astro, GSAP, WCAG (each used across 4-5 domain files)

## 2026-04-02 — Revision 2: LLM Review Feedback

Applied recommendations from Gemini and GPT review of the full spec:

### Architecture changes
- **AD1:** Image processing moved from Worker-side to Cloudflare Image Resizing (Worker memory/CPU limits)
- **AD2:** Switched from Google OAuth to Magic Link auth via Resend (simpler for single user)
- **AD3:** CSS-first animation system, GSAP optional for max 1 signature moment (was: 3 GSAP ScrollTrigger per page)
- **AD4:** Removed PWA (unnecessary complexity for this scale)
- **AD5:** Structured fields preferred over rich text for most content types
- **AD6:** Inquiry lifecycle via email-first, D1 as backup log (was: full admin inbox UI)

### New requirements added
- REQ-BK-4: Click-to-call
- REQ-BK-6: Booking business rules (timezone, min stay, capacity, cross-season pricing, availability revalidation)
- REQ-BK-7: Inquiry lifecycle (statuses, confirm+block dates, conflict warnings)
- REQ-CMS-7: Content safeguards (field validation, locale completion, duplicate-from-Croatian, slug redirects, autosave, placeholder warnings)
- REQ-CMS-8: Branded error pages (404/500)
- REQ-TC-4: House rules & booking terms
- REQ-TC-5: GDPR consent checkbox on forms
- REQ-TC-7: Accessibility statement
- REQ-SEO-5: Keyword strategy per locale
- REQ-SEO-6: Local SEO (GBP, NAP, geocoordinates)
- REQ-SEO-7: URL policy & indexation controls (no www, no trailing slashes, noindex rules)
- REQ-SEO-8: Content freshness reminders

### Significantly updated requirements
- REQ-BK-1: Added "Quick Question" tab, children/pets fields, min stay enforcement, cross-season pricing breakdown, GDPR checkbox, stale availability handling, non-binding disclaimer
- REQ-BK-2: Added timezone, server-side availability revalidation, honeypot, input sanitization, retry logic, CGNAT-aware rate limiting, inquiry-not-booking disclaimer
- REQ-AP-1: Expanded with German-precision fields (beach type, AC scope, parking type, stairs, kitchen/bathroom equipment, mattress sizes, WiFi, distances, house rules, "Best for" labels, value proposition)
- REQ-AP-3: Restructured with explicit visual hierarchy, trust info near CTA, contextual objection handling
- REQ-AP-4: Added cleaning fee, tourist tax details, PAngV compliance, German total-price display
- REQ-CMS-2: Switched to Cloudflare Image Resizing, added EXIF GPS stripping, crop preview, resolution warnings, aspect ratio warnings
- REQ-CMS-3: Changed from Google OAuth to Magic Link auth (renamed)
- REQ-CMS-4: Reorganized as task-based dashboard, structured editing emphasis, locale completion indicators, destructive action confirmations
- REQ-CMS-5: Split into toggleable (optional) vs always-visible (core) sections, added dependency warnings
- REQ-CMS-6: Added placeholder marking system, content checklist dashboard
- REQ-TC-1: Simplified cookie consent (no optional cookies at launch = no banner needed)
- REQ-TC-2: Expanded privacy policy with legal basis, retention periods, processor list, WhatsApp note
- REQ-TC-3: Impressum always available in German even if DE locale disabled
- REQ-VD-3: CSS-first, no parallax, GSAP optional (<20KB gate), art direction rules
- REQ-VD-6: Restricted masks to editorial photos, standard aspect ratios for apartment galleries
- REQ-SP-1: Added contextual placement near inquiry, manual "most loved for" tags, source attribution, structured fields

### Resolved contradictions
- i18n fallback policy: 404 for disabled locales / unpublished pages, Croatian fallback for partial missing content within published active-locale pages

### Documentation structure defined
- `documentation/` folder with architecture, config, deployment, CMS guide, content guide, security, SEO, troubleshooting, ADRs
- 6 initial Architecture Decision Records

## 2026-04-02 — Initial Specification

- Created full product specification with 12 domains
- Defined 7 design principles
- Established 9 constraints
- Documented 45+ requirements across all domains
- Key decisions: Astro 6 + Emdash CMS on Cloudflare Workers, photo-first design, 4 locales (owner-activated), mobile-first CMS, section toggles, preloaded content, request-to-book, Turnstile + Resend
