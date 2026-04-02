# Changelog

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
