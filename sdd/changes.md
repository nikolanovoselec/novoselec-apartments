# Changelog

## 2026-04-02 — Revision 21: Organic Visual Polish (e437ff7)

Homepage visual system overhauled from edge-to-edge flat imagery to organic curved containers. All homepage photo treatments now use rounded corners (16-24px), gaps, shadows, and hover interactions. Wavy SVG section dividers replace straight lines. Triptych labels slide in on hover. Gradient utility classes added. Mobile navigation gains inline language picker. New favicon.

### AC updated
- **REQ-VD-3:** Added breathing/floating keyframes (breathe, float, slowZoom) and utility classes. Updated section divider animation from line-extend to wavy SVG fade-in.
- **REQ-VD-4:** Added triptych label slide-in, testimonial card lift, tag pill hover fill, image hover zoom ranges. Updated section divider micro-interaction.
- **REQ-VD-6:** Rewrote homepage photo system from edge-to-edge/no-radius to organic curved containers (16-24px radius, gaps, shadows, hover zoom). Photo strip, feature image, duo-image, and triptych all updated.
- **REQ-VD-7:** Section dividers changed from 120px straight line at 0.6 opacity to wavy SVG mask at 0.3 opacity plus full-width wave separators between sections.
- **REQ-SF-3:** Mobile hamburger menu now includes inline language picker with active locale highlighting.
- **REQ-SF-5:** Photo strip, Zdrelac feature image, duo images, triptych, and tags all updated from edge-to-edge flat to contained organic style. Wave separators added between sections. Triptych wrapped in gradient background section.

### Requirements added
- **REQ-VD-8:** Gradient Utility System — warm, azure, and sunset gradient utility classes for section backgrounds.

### Status changes
- **REQ-VD-6:** Planned -> Implemented (homepage photo treatments now fully built with organic curved style).

### No status changes
- REQ-VD-3 remains Implemented (keyframe additions).
- REQ-VD-4 remains Implemented (new hover effects added).
- REQ-VD-7 remains Implemented (divider style updated).
- REQ-SF-3 remains Planned (focus trapping still missing).
- REQ-SF-5 remains Planned (CMS toggle, full editorial content not yet wired).

## 2026-04-02 — Revision 20: Emdash CMS Wiring, Seed Data, Design Polish (f4485a5)

All pages wired to Emdash CMS with locale-aware queries and Croatian fallback. Comprehensive seed data (6 collections in 4 locales). Apartment listing page redesigned from "coming soon" to real card grid. Testimonials rendered on homepage. Ken Burns hero animation. Font swap to DM Serif Display. Admin nav link. Custom domain configured. Alt text on all images.

### AC updated
- **REQ-SF-1:** Added Ken Burns CSS animation on hero background (scale 1 to 1.08, 20s alternating). Updated future enhancement note to clarify single-photo Ken Burns is the current state, multi-image slideshow is planned.
- **REQ-SF-3:** Added admin link AC. Navigation now includes `/_emdash/admin/` link in both desktop and mobile menus. Fixed stale AC: hamburger button now uses CSS class `.nav__hamburger` (not inline styles as previously stated).
- **REQ-VD-2:** Font swap from Cormorant Garamond to DM Serif Display (transitional serif, 400 weight). Inter changed to variable font (100-900 weight range). Both self-hosted as woff2 with preload.
- **REQ-VD-3:** Added Ken Burns keyframe documentation.
- **REQ-AP-2:** Replaced "coming soon" lifestyle layout AC with card grid implementation. Cards show hero photo (3:2), name, tagline, meta row, "Best for" badge, price, and inquiry CTA. Added fallback behavior (two hardcoded example apartments when CMS is empty).
- **REQ-CMS-1:** Updated content query mechanism from "Astro Live Collections" to Emdash content loader with locale-aware abstraction layer. Updated collection list to reflect current seed state.
- **REQ-CMS-6:** Added seed API endpoint (`POST /api/admin/seed`) and comprehensive seed data documentation (6 collections, 4 locales).
- **REQ-SP-1:** Added homepage testimonials implementation: 3-column grid, blockquote cards, locale-filtered with Croatian fallback, hidden when empty.
- **CON-STACK:** Added custom domain `apartmani.novoselec.ch`.

### Status changes
- **REQ-AP-2:** Remains Implemented (AC updated from coming-soon to card grid).
- **REQ-SF-3:** Remains Planned (focus trapping still missing).

### No status changes
- REQ-CMS-1 remains Planned (full admin walkthrough, Magic Link auth, failure modes not yet verified).
- REQ-CMS-6 remains Planned (placeholder marking, dashboard checklist, stock media files not yet delivered).
- REQ-SP-1 remains Planned (carousel, contextual placement on apartment detail pages, "most loved for" tags not yet implemented).
- REQ-VD-2 remains Implemented (font swap is a design refinement, not a regression).
- REQ-VD-3 remains Implemented (Ken Burns keyframe is an addition to existing animation system).

### Glossary
- Added "DM Serif Display" term.

## 2026-04-02 — Revision 19: Switch i18n to Manual Routing (980f49c)

Astro i18n routing changed from `prefixDefaultLocale: true` to manual mode. This prevents Astro's built-in i18n middleware from intercepting non-locale paths (e.g., `/_emdash/`) as locale params, which was the root cause of the Emdash admin 404 fixed in Revisions 17-18. With manual routing, the underscore-prefix guards added in Revision 18 and the `_emdash` catch-all page added in Revision 17 are no longer needed and were removed.

### No AC changes
- **REQ-I18N-1:** No acceptance criteria change. The observable routing behavior (locale-prefixed URLs, invalid-locale redirect to `/hr/`) is unchanged. The routing mode is an implementation detail not captured in the spec.
- **REQ-CMS-1:** No change. The admin panel at `/_emdash/admin/` continues to work; the conflict between locale routing and CMS paths is resolved at the framework level rather than with route guards.

### No status changes
- REQ-I18N-1 remains Planned.
- REQ-CMS-1 remains Planned.

## 2026-04-02 — Revision 18: Fix Emdash Admin 404 (16a445e)

Trailing-slash redirect middleware was stripping slashes from `/_emdash/` paths, causing the admin panel to return 404. Middleware now excludes `/_emdash/` paths from slash normalization. Additionally, all `[locale]` dynamic routes now early-return 404 for underscore-prefixed params (e.g., `_emdash`) so Astro does not treat CMS paths as locale routes.

### AC clarified
- **REQ-CMS-1:** No change to acceptance criteria or status. The admin panel route `/_emdash/admin/` was already specified; this fix ensures middleware and locale routing do not interfere with it. REQ-CMS-1 remains Planned because the full CMS integration (D1, R2, collections, authentication) is not yet implemented.
- **REQ-I18N-1:** No AC change needed. The locale validation already implies non-locale prefixes return 404. The route guards are an implementation detail ensuring `[locale]` catch-all routes do not intercept reserved CMS paths.

### No status changes
- REQ-CMS-1 remains Planned.
- REQ-I18N-1 remains Planned.

## 2026-04-02 — Revision 17: Local Guide & Apartment Listing Redesign (52627b7)

Local guide page redesigned from emoji icon category cards to alternating image+text layout with per-locale descriptions. Apartment listing page redesigned from placeholder card grid to lifestyle "coming soon" layout with duo images and inquiry CTA.

### AC updated
- **REQ-ED-4:** Added "Pre-CMS state (current)" AC documenting the alternating image+text layout with 4 categories (Beaches, Food & Drink, Activities, Day Trips), 3:2 landscape photos, and per-locale text. "Restaurants & Konobas" deferred to CMS phase. Status changed from Planned to Implemented.
- **REQ-AP-2:** Added "Pre-CMS state (current)" AC documenting the lifestyle coming-soon layout with duo-image grid (3:4, 4px gap), localized teaser text, heading, and inquiry CTA. Old card grid AC preserved under "With CMS (planned)". Zero-apartment handling updated to reference new layout.

### Status changes
- **REQ-ED-4:** Planned -> Implemented (pre-CMS static guide page is live with content)

## 2026-04-02 — Revision 16: Uniform Photo System & Hamburger Inline Styles (f5d0069)

Homepage photo treatment redesigned with a uniform edge-to-edge system. All homepage images now use no border-radius, no gaps (except duo-image 4px), and bleed to viewport edges. Hamburger button hardened with inline styles to prevent CSS cascade issues.

### AC updated
- **REQ-SF-5:** Photo strip changed from 16:9 with 4px gap and hover zoom to 3:2 edge-to-edge with no gaps and no hover zoom. Why Pasman selling points changed from icon+text grid to uppercase bordered tag pills in a tag row. Zdrelac section changed from fixed-height (60vh) to aspect-ratio-based full-bleed image (21:9 desktop, 16:9 mobile). Apartments preview changed from asymmetric image grid (1.2fr/0.8fr with border-radius) to uniform duo-image (1fr/1fr, no border-radius). Experience teaser renamed to "triptych" — edge-to-edge, no border-radius, hover zoom retained at 1.03x.
- **REQ-SF-3:** Hamburger button AC updated. Now uses inline styles on button and span elements for bulletproof rendering independent of CSS cascade. Selected via `#hamburger-btn` ID instead of `.nav__hamburger` class.
- **REQ-VD-6:** Added "Homepage photos (uniform system)" AC item. All homepage photo treatments are edge-to-edge with no border-radius. Padding/shadow note scoped to non-homepage contexts. Mobile note updated for single-column stacking with adjusted aspect ratios.

### No status changes
- REQ-SF-5 remains Planned (CMS integration, section toggles still missing).
- REQ-SF-3 remains Planned (focus trapping still missing).
- REQ-VD-6 remains Planned (CMS-managed frame styles, arch clip-path not yet implemented).

## 2026-04-02 — Revision 15: Pexels CDN Workaround for Stock Photos (3c72571)

Stock photo `src` attributes switched from `/media/:key` Worker route (which returns 404 due to R2 routing bug) to direct Pexels CDN URLs as a temporary workaround. All 9 homepage images now hotlinked from `images.pexels.com` with `?auto=compress&w=` query params for basic size optimization. This is a stopgap — images will move back to R2 + Image Resizing once the `/media/` route bug is resolved.

### AC updated
- **REQ-SF-1:** Added temporary workaround note: stock photos served from Pexels CDN pending `/media/` route fix.

### No status changes
- REQ-PERF-1 and REQ-CMS-2 (the `/media/:key` pipeline) remain Status: Planned and unaffected — the Pexels workaround does not change the target architecture, only the current delivery path.

## 2026-04-02 — Revision 14: Stock Photography, Rich Homepage Content, Hamburger Fix (7efb9cd)

Spec synced with commit adding stock photos to hero and homepage sections, redesigned homepage layout with photo strip, Zdrelac village section, food/experience teaser grid, apartments preview with images, and hamburger menu CSS fix.

### AC updated
- **REQ-SF-1:** Hero background changed from layered gradient to stock photograph with semi-transparent gradient overlay. Future enhancement note updated: single-photo hero is now intermediate step between gradient fallback and Ken Burns slideshow.
- **REQ-SF-3:** Hamburger button AC expanded with implementation details: explicit z-index 101, position relative, three span elements with CSS transform morph to X on `.is-open` state.
- **REQ-SF-5:** AC expanded significantly. Added: photo strip section (3-image grid between hero and Why Pasman), apartments preview layout (side-by-side text + asymmetric image grid), food & experience teaser grid (3-column with overlay labels). Added dependencies on REQ-ED-4 and REQ-ED-6.

### Implementation progress noted (statuses remain unchanged)
- **REQ-SF-1:** Hero now uses stock photo background instead of gradient-only. Ken Burns slideshow still deferred to CMS integration. Status remains Implemented (AC updated to match).
- **REQ-SF-3:** Hamburger menu CSS improved with proper span sizing, z-index layering, and `.is-open` transform animations. Still missing: focus trapping in fullscreen menu. Status remains Planned.
- **REQ-SF-5:** Major homepage content additions — photo strip, Zdrelac image section, apartments preview with images, experience teaser grid. Still missing: CMS integration, section toggle, links to editorial pages. Status remains Planned.
- **REQ-ED-6:** Zdrelac village section now appears on homepage as full-width image with text overlay between Why Pasman and apartments sections. Localized to all 4 locales. Still missing: CMS integration, section toggle, appearance on Why Pasman page. Status remains Planned.
- **REQ-ED-4:** Food/experience teaser visible on homepage (grilled fish, olive oil, beaches). Preview only — full guide page with entries, filtering, and CMS not yet implemented. Status remains Planned.
- **REQ-CMS-6:** 9 stock photos now deployed on homepage (hero-turquoise-sea, hero-pine-sea, hero-stone-village, hero-sunset-islands, editorial-pebble-beach, editorial-grilled-fish, editorial-olive-grove, apt-terrace-view, apt-living-room). Progress toward "30-40 curated stock photos" AC. Status remains Planned.

## 2026-04-02 — Revision 13: WCAG AA Contrast Fix & Hero Localization (a8fa3a1)

Spec synced with contrast accessibility fix. Opacity values raised across hero and homepage dark sections to meet WCAG AA contrast ratios. Dead `heroImageUrl` prop removed. Hero location label localized to all 4 locales.

### AC updated
- **REQ-SF-1:** Hero label opacity corrected from 0.5 to 0.7. Tagline opacity corrected from 0.5 to 0.7. Location label changed from hardcoded English to locale-aware string (Croatian, German, Slovenian, English).
- **REQ-A11Y-4:** AC expanded from vague "contrast guaranteed via overlay" to specify minimum alpha thresholds: 0.65 for large text (56px+, where WCAG AA requires only 3:1), 0.7 for normal text on dark backgrounds. The 0.65 large-text threshold aligns with REQ-SF-1 hero title accent line.

## 2026-04-02 — Revision 12: Visual Design Refinement (2a49348)

Spec synced with visual design overhaul commit. Color palette refined, typography redone with dramatic scale, scroll animations upgraded with progressive enhancement gate, new button variants, stone grain texture implemented, hero completely redesigned.

### Status changes: Planned -> Implemented
- **REQ-VD-7:** Stone grain SVG noise texture implemented as `.texture-stone` utility class and hero overlay. Section dividers use sand color. Remaining planned items: olive branch silhouettes, Galesnjak brand element.
- **REQ-SF-1:** Hero section implemented. Redesigned from photo slideshow concept to layered gradient hero with two-line title, location label, ghost CTA, and scroll indicator. Ken Burns photo slideshow deferred as future enhancement when CMS hero photos are available.

### AC updated
- **REQ-VD-1:** Color hex values updated to match refined palette. Azure `#1B6B93` -> `#1A6B8F`, stone `#F5F0E8` -> `#EDE8DE`, navy `#0C2D48` -> `#0A1F33`, olive `#6B7F3B` -> `#5C6E3B`, terracotta `#C67B5C` -> `#C2714E`, cream `#FAF7F2` -> `#F8F5EF`, warm gray `#4A4A4A` -> `#3D3D3D`. Added sand accent `#D4C9B8`, black `#111111`, and semantic color tokens.
- **REQ-VD-2:** Typography AC revised. Letter-spacing changed from "generous" to negative (-0.02em headings, -0.03em display). Font size scale changed from "48-80px" to dramatic clamp scale. Body size 15px (was 16-18px), line-height 1.7 (was 1.6), max-width 60ch (was 65ch). Added `.text-lead` and `.text-label` utility class descriptions.
- **REQ-VD-3:** Added progressive enhancement gate mechanism (`.reveal-ready` class). Added `data-reveal`, `data-reveal-clip`, `data-reveal-stagger` attribute descriptions. Added section divider line-extend animation. Removed `will-change` AC (not used in implementation). Stagger increments corrected from "80-120ms" to "100ms".
- **REQ-VD-4:** Button variants expanded: default outline with scaleX fill-sweep, `--primary` solid fill, `--ghost` for dark backgrounds. Image hover timing specified (0.6s). Form focus mechanism specified (`.focus-line` element). Hamburger morph mechanism specified (three spans with transform). Focus states specified (`:focus-visible` with 2px accent outline).
- **REQ-SF-1:** Completely rewritten. Changed from "Hero Photo Slideshow" to "Hero Section" with layered gradient background, two-line title, text-label, ghost CTA. Ken Burns slideshow noted as future enhancement. Dependencies simplified (no CMS dependency for current implementation).
- **REQ-A11Y-1:** Updated to reflect progressive enhancement model. Content visibility now guaranteed in three scenarios (reduced motion, JS disabled, JS load failure) via `.reveal-ready` class gate. Ken Burns reference replaced with gradient hero. Verification expanded to include JS-disabled testing.

### AC deviations noted
- **REQ-SF-1:** Original spec envisioned a Ken Burns photo slideshow as the primary hero. Implementation delivers a gradient-based hero instead. This is an intentional design decision — the gradient hero works without CMS/photo dependencies and serves as the foundation for future photo integration.
- **REQ-VD-2:** Spec previously said "generous letter-spacing" for headings. Implementation uses tight/negative letter-spacing for a more contemporary editorial feel. This is an intentional design refinement.

## 2026-04-02 — Revision 11: Phase 7 Content Seed Data & Accessibility Statement (3b56701)

Spec synced with Phase 7 commit (seed data for apartments, seasons, testimonials, site-settings, stock media plan, accessibility statement page).

### Implementation progress noted (all statuses remain Planned)

- **REQ-CMS-6:** Significant seed data added. Delivered: 2 apartments (Lavanda 4-pax, Tramuntana 6-pax) with full structured data (amenities, bed config, distances, SEO fields) in all 4 locales, `placeholder: true`; 3 seasonal pricing entries per apartment (off-peak/peak/shoulder with realistic EUR prices and min-stay); 3 testimonials with structured metadata (country, travel type, rating, mostLovedFor tags, apartment link) in all 4 locales, `placeholder: true`; site-settings singleton (property name, email, check-in/out times, tourist tax rate 1.35 EUR, section toggles all enabled, activeLocales defaults to `["hr"]`); stock media source plan in `seed/media/README.md` listing 21-28 royalty-free photos across 4 categories (hero, interiors, editorial, local guide). Missing from AC: hero slideshow photos (heroPhotoKeys empty), editorial page content as seedable JSON (exists hardcoded from Phase 6 but not in seed format), local guide 12-15 entries, 10-15 FAQ entries in seed format (5 hardcoded from Phase 6), host story template in seed format, legal page templates in seed format, actual stock media files (plan only), dashboard placeholder checklist, optional hero video. Status remains Planned.
- **REQ-TC-7:** Accessibility statement page at `/{locale}/pristupacnost` in all 4 locales. Footer link present in all locales. Content states WCAG 2.1 AA target. Contact method references email (no explicit address -- relies on site contact info). Missing from AC: CMS integration (hardcoded with same pattern as Phase 6 pages), explicit list of known limitations. Status remains Planned.

### AC deviations noted
- **REQ-CMS-6:** Spec AC says "2-3 example apartments"; implementation delivers 2 (within range). Spec says "3-5 example testimonials"; implementation delivers 3 (within range). Both are at the lower bound.
- **REQ-CMS-6:** `site-settings.json` has `phone` and `whatsappNumber` as empty strings and `heroPhotoKeys` as empty array. These are expected placeholders for owner to fill in, but the seed script should document that these must be populated before the site is visitor-ready.
- **REQ-CMS-6:** Spec AC includes "social links" in site-settings; implementation does not include social links field in `site-settings.json`.
- **REQ-TC-7:** Spec AC says "at least in English and German"; implementation provides all 4 locales (exceeds requirement). Content says "contact us by email" without specifying an actual address -- depends on site-settings email being discoverable elsewhere on the page/footer.

## 2026-04-02 — Revision 10: Phase 6 Editorial, Legal, SEO Pages (3f30f66)

Spec synced with Phase 6 commit (editorial pages, legal pages, sitemap, robots.txt, local guide stub).

### Implementation progress noted (all statuses remain Planned)

All editorial pages use hardcoded static content with TODO comments for Emdash CMS integration. CMS-managed content and section toggles are core AC items for each requirement, so none qualify for Implemented status yet. Progress is documented per requirement below.

- **REQ-ED-1:** "Why Pasman" page at `/{locale}/zasto-pasman`. Implements: 4 sections (crystal-clear sea, island tranquility, 25 min from mainland, authentic Dalmatia) with poetic headlines and 2-3 sentence descriptions in all 4 locales, scroll reveal animations. Missing from AC: full-bleed photos, scroll-driven storytelling with pinned sections, olive groves + cycling/walking sections, links to guide entries, CMS integration, section toggle.
- **REQ-ED-2:** "Getting Here" page at `/{locale}/dolazak`. Implements: ferry info (Biograd-Tkon, 25 min, Jadrolinija link, peak season advice), alternative route via Zdrelac bridge from Ugljan, Zadar Airport (ZAD) section, Google Maps + Apple Maps deep links, airport transfer offer text. Missing from AC: visual journey timeline, "without car" section, Split Airport section, parking info, ferry cost/frequency, WhatsApp link on transfer offer, German cost breakdowns, CMS integration, section toggle.
- **REQ-ED-4:** Local guide stub at `/{locale}/vodic`. Shows 5 category cards (Beaches, Food & Drink, Restaurants, Activities, Day Trips) with "coming soon" message. Minimal implementation — no entries, no filtering, no descriptions. Status remains Planned.
- **REQ-ED-5:** "About Hosts" page at `/{locale}/o-nama`. Implements: standalone page with warm personal story in all 4 locales ("Our family has been on this island for generations"), response time badge. Missing from AC: host photos with Dalmatian arch clip-path mask, WhatsApp link, homepage condensed version, CMS integration, section toggle.
- **REQ-ED-7:** FAQ page at `/{locale}/faq`. Implements: accordion UI with `<details>/<summary>`, Schema.org FAQPage JSON-LD markup via SchemaOrg component, 5 preloaded FAQ items across 3 categories (getting-there, apartment, booking) in all 4 locales. Missing from AC: Emdash CMS collection, category filtering UI, contextual display on other pages (apartment/transport), owner phone management, section toggle.
- **REQ-TC-2:** Privacy Policy page at `/{locale}/privatnost`. Implements: standalone page in all 4 locales with template content covering all required GDPR items (data controller, legal basis Art. 6(1)(b), data collected, D1 storage in EU, Resend + Cloudflare processors, 2-year retention, data subject rights, Cloudflare Web Analytics note, WhatsApp third-country transfer note, no third-party data sales). Missing from AC: CMS integration (hardcoded with TODO), verification that German version is available when DE locale is disabled (CON-LEGAL exception).
- **REQ-TC-3:** Impressum page at `/{locale}/impressum`. Implements: standalone page in all 4 locales with template content (address, email, phone placeholders). Code comment acknowledges CON-LEGAL German availability requirement. Missing from AC: CMS integration, actual owner data (placeholder template), verification of 1-click footer access and DE-disabled availability.
- **REQ-SEO-4:** Multilingual sitemap at `/sitemap.xml`. Implements: XML sitemap with all page paths, `xhtml:link` alternates for all locales per URL, `x-default` pointing to Croatian, proper XML content type. Missing from AC: filtering by active locales only (TODO in code), dynamic apartment page inclusion from D1/Emdash, auto-regeneration on content changes, noindex enforcement on disabled locale pages.
- **REQ-SEO-7:** robots.txt at `/robots.txt`. Implements: dynamic robots.txt blocking `/admin/`, `/_emdash/`, `/media/`, `/api/` from indexing, Sitemap directive pointing to `/sitemap.xml`. Combined with existing trailing slash redirects and canonical URLs from Phase 3, this closes the robots.txt and media URL noindex AC items. Remaining gaps: www redirect (DNS-level), noindex on disabled locale pages and draft preview URLs, slug change redirects (REQ-CMS-7).

### AC deviations noted
- **REQ-ED-1:** Implementation has 4 sections; spec AC lists 6 topics (crystal-clear sea, quiet island rhythm, easy ferry access, authentic Dalmatia, olive groves, cycling/walking). Missing: olive groves and cycling/walking as standalone sections.
- **REQ-ED-2:** Transfer offer text uses `t(typedLocale, "gettingHere.transfer")` but no WhatsApp link — spec requires WhatsApp link for transfer arrangement.

## 2026-04-02 — Revision 9: Confirm Atomicity Fix (eba28ad)

### AC updated
- **REQ-BK-7:** "Confirm + Block Dates" AC revised. Previous wording: "inquiry status updated to `confirmed` in same batch." Implementation now splits into two sequential steps: (1) atomic INSERT...WHERE NOT EXISTS runs alone; (2) UPDATE inquiry status runs only if INSERT affected rows. This prevents false confirmations where the status changed to `confirmed` even when no availability block was created due to a date conflict. The overlap check + insert remains atomic; the change is that the status UPDATE is now conditional on INSERT success rather than unconditional in the same batch.

### Implementation progress noted (REQ-BK-7, status remains Planned)
- JWT_SECRET now validated for presence before use — returns 500 if missing instead of silently verifying against an empty string. Unused `stripHtml` import removed.
- Remaining gaps from Revision 7 still apply: no CSRF token validation, no signed single-use URL token, no decline/spam actions, no admin inquiry list UI, no unread count badge.

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
