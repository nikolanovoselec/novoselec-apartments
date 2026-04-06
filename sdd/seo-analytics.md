# SEO & Analytics

Schema.org structured data, Open Graph, multilingual sitemap, keyword strategy, local SEO, and privacy-friendly analytics.

## Key Concepts

- **Structured data**: Schema.org JSON-LD markup enabling rich search result features
- **hreflang**: HTML attribute telling search engines which language version to serve
- **OG (Open Graph)**: Meta tags controlling how links appear when shared on social platforms
- **NAP**: Name, Address, Phone consistency across all web presences for local SEO
- **Conversion event**: Tracked user action indicating booking intent (inquiry, WhatsApp click, etc.)

## Requirements

### REQ-SEO-1: Schema.org Structured Data

- **Intent:** Rich search results for vacation rental queries
- **Applies To:** System
- **Acceptance Criteria:**
  - `LodgingBusiness` on homepage: property name, locale-aware description, canonical URL, hero image, postal address, geo coordinates, numberOfRooms, amenityFeature (Wi-Fi, Parking, Air conditioning, BBQ)
  - `VacationRental` on apartment detail pages: name, description, image, address, geo coordinates, price range, amenities, check-in/out times
  - `FAQPage` on FAQ sections (REQ-ED-7) — answer text HTML-stripped before JSON-LD emission to ensure clean structured data
  - `BreadcrumbList` on all pages
  - **No Review/AggregateRating schema at launch.** Self-published reviews on own domain are a Google policy-sensitive area. Testimonials are displayed visually but not marked up with Review schema. Can be revisited if owner obtains verifiable third-party review sources (Google Reviews, Booking.com).
  - Validated via Google Rich Results Test
  - Schema per locale (localized names, descriptions)
- **Constraints:** CON-SEO
- **Priority:** P1
- **Dependencies:** REQ-AP-1, REQ-ED-7, REQ-SP-1
- **Verification:** Google Rich Results Test for all page types. Verify `LodgingBusiness` JSON-LD on homepage. Verify `VacationRental` JSON-LD on apartment detail pages. Verify `BreadcrumbList` on all pages.
- **Status:** Partial — `LodgingBusiness` JSON-LD on homepage (name, description, canonical URL, hero image, postal address, geo, numberOfRooms, amenityFeature). `VacationRental` JSON-LD on apartment detail pages. `FAQPage` on FAQ page (answer text HTML-stripped for clean structured data since 45de3f3). `BreadcrumbList` on apartment detail pages only. Still missing: BreadcrumbList on non-apartment pages; Google Rich Results Test validation pending

### REQ-SEO-2: Open Graph & Social

- **Intent:** Beautiful social sharing previews across all platforms
- **Applies To:** System
- **Acceptance Criteria:**
  - OG image per apartment (hero photo at 1200x630)
  - OG title, description per page per locale
  - Default OG image for non-apartment pages
  - `og:site_name` set to property name on all pages
  - `og:locale` set per language (hr_HR, de_CH, sl_SI, en_US)
  - **Twitter Card meta tags:** `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image` on all pages. Image falls back to the same default OG image when no page-specific image is set.
- **Constraints:** CON-SEO
- **Priority:** P1
- **Dependencies:** REQ-AP-1, REQ-CMS-2
- **Verification:** Test sharing on WhatsApp, Facebook, Twitter/X. Validate cards via Twitter Card Validator.
- **Status:** Partial — per-page OG images set on 10 subpages via `ogImage` prop on Page layout. Default fallback image applied to homepage, apartment listing, apartment detail, galerija, privatnost, and 404. OG title and description rendered per page per locale. `og:site_name` and `og:locale` emitted on all pages. Twitter Card tags (summary_large_image) emitted on all pages with title, description, and image. Still missing: per-apartment OG image (hero photo at 1200x630)

### REQ-SEO-3: Analytics + Conversion Events

- **Intent:** Privacy-friendly analytics with meaningful funnel tracking
- **Applies To:** System
- **Acceptance Criteria:**
  - **Pageview analytics:** Cloudflare Web Analytics beacon on all pages (no cookies, no GDPR consent needed). Tracks pageviews and web vitals automatically.
  - **Custom conversion events:** Cloudflare Web Analytics does NOT support custom events. Custom events tracked via a lightweight server-side Worker endpoint (`POST /api/track`) that writes to D1 `events` table. Cookieless, no PII stored — only: event type, apartment slug, locale, timestamp, page path.
  - Events tracked:
    - Inquiry form submit (apartment, locale)
    - Quick question submit
    - WhatsApp button click (apartment context)
    - Click-to-call
    - Apartment detail page view
    - Gallery lightbox open
    - Language switch (from → to)
    - Availability calendar date selection
  - Events queryable by owner in admin dashboard (simple counts/charts) or via D1 SQL
  - No third-party analytics, no cookies, no PII
- **Constraints:** CON-LEGAL
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Verify beacon and events in dashboard
- **Status:** Partial — `/api/track` endpoint and D1 events table exist for custom conversion events. However, the Cloudflare Web Analytics beacon is NOT present in Base.astro layout -- pageview analytics are not being collected. Beacon must be added before promotion to Implemented.

### REQ-SEO-4: Multilingual Sitemap

- **Intent:** Search engines discover all locale pages
- **Applies To:** System
- **Acceptance Criteria:**
  - XML sitemap at `/sitemap.xml` generated as a dynamic API route
  - All static public pages included: homepage, apartmani, galerija, hrana, aktivnosti, plaze, kontakt, dolazak, vodic, o-nama, faq, privatnost, impresum (13 pages)
  - Apartment detail pages dynamically loaded from CMS (published apartment slugs queried at request time)
  - Each page (static and dynamic) emitted once per active locale (hr, de, sl, en) with `xhtml:link` alternates for all active locales plus `x-default` pointing to Croatian variant
  - `Cache-Control: public, max-age=3600` response header
  - **Planned enhancements:** Filter by active locales from site-settings (currently all locales included). `noindex` on disabled locale pages and draft preview URLs.
- **Constraints:** CON-SEO
- **Priority:** P1
- **Dependencies:** REQ-I18N-1, REQ-I18N-2
- **Verification:** Validate XML, check Google Search Console
- **Status:** Implemented

### REQ-SEO-5: Keyword Strategy

- **Intent:** Target high-intent vacation rental search queries per locale
- **Applies To:** System
- **Acceptance Criteria:**
  - **Primary keyword targets by locale:**
    - HR: "apartmani Pašman", "apartmani Ždrelac", "smještaj Pašman"
    - DE: "Ferienwohnung Pašman", "Ferienwohnung Ždrelac", "Unterkunft Pašman Kroatien", "Apartment Pašman Strand"
    - SL: "apartma Pašman", "nastanitev Pašman Hrvaška"
    - EN: "apartments Pašman island", "holiday apartment Pašman Croatia", "accommodation near Zadar"
  - SEO title and meta description templates per page type incorporating target keywords
  - Title length: 50-60 chars. Description: 120-155 chars.
  - **Internal linking:** Editorial pages (local guide, Getting Here, food and drink, activities, beaches) link contextually to apartment detail pages. Apartment pages link to relevant guide entries.
  - Long-tail targeting via editorial content: "best beaches Pašman", "Biograd Tkon ferry schedule", "things to do Pašman island"
- **Constraints:** CON-SEO, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-I18N-4, REQ-ED-4
- **Verification:** SEO title/meta review per page per locale
- **Status:** Planned

### REQ-SEO-6: Local SEO

- **Intent:** Appear in map and local search results
- **Applies To:** System
- **Acceptance Criteria:**
  - Google Business Profile: created and linked (owner action, documented in CMS guide)
  - NAP (Name, Address, Phone) consistent across site footer, schema, and GBP
  - Geo coordinates in schema markup (approximate area, not exact address for privacy)
  - "Open in Google Maps" / "Open in Apple Maps" links on Getting Here page and apartment pages
  - Encourage owner to respond to Google reviews (documented in CMS guide)
- **Constraints:** CON-SEO
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Search for property name, verify map listing
- **Status:** Planned

### REQ-SEO-7: URL Policy & Indexation Controls

- **Intent:** Clean URLs, no duplicate indexation
- **Applies To:** System
- **Acceptance Criteria:**
  - **No `www`:** `www.domain.com` → 301 to `domain.com`
  - **No trailing slashes:** `/hr/apartmani/` → 301 to `/hr/apartmani`
  - Self-referencing canonical per locale page
  - `noindex, nofollow` on: disabled locale pages, draft preview URLs, admin panel
  - Slug changes: automatic 301 redirect from old to new (REQ-CMS-7)
  - Media/image URLs: not indexed (X-Robots-Tag or robots.txt)
- **Constraints:** CON-SEO
- **Priority:** P1
- **Dependencies:** REQ-I18N-1
- **Verification:** Test redirects, verify robots.txt, check Google Search Console
- **Status:** Planned

### REQ-SEO-8: Content Freshness

- **Intent:** Keep content accurate and SEO-competitive
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Admin dashboard reminder: "Update seasonal prices" triggered annually (configurable date)
  - Admin dashboard reminder: "Review ferry schedules" triggered annually before summer
  - Admin dashboard reminder: "Add new testimonials" triggered if none added in 6 months
  - `<meta name="last-modified">` on pages, updated when content changes
  - Reminders shown on admin dashboard, not email (not intrusive)
- **Constraints:** CON-CMS
- **Priority:** P2
- **Dependencies:** REQ-CMS-9
- **Verification:** Verify reminders appear on admin dashboard
- **Status:** Planned

### REQ-SEO-9: LLM Discoverability

- **Intent:** Help AI assistants accurately understand and reference the property when answering travel queries
- **Applies To:** System
- **Acceptance Criteria:**
  - `/llms.txt` served as a static file at the site root
  - Contains structured summary: site identity, location, apartment specs (capacity, size, amenities), booking method, key page URLs, contact info
  - Includes guidance for AI systems: no invented prices or availability, direct inquiries to contact form, note on .ch domain (Swiss family, Croatian property), recommend jadrolinija.hr for ferry schedules
  - Includes last-updated date; must be refreshed when property details change
  - `robots.txt` includes `LLMs-Txt` directive pointing to `/llms.txt` for automated LLM discovery
- **Constraints:** CON-SEO
- **Priority:** P2
- **Dependencies:** None
- **Verification:** Verify file accessible at `/llms.txt`, verify content accuracy against live site
- **Status:** Implemented

### REQ-SEO-10: Browser Integration & Home Screen

- **Intent:** Professional browser chrome appearance and mobile home-screen icon for returning visitors
- **Applies To:** System
- **Acceptance Criteria:**
  - `theme-color` meta tag: cream (`#F8F5EF`) for light mode, deep navy (`#0A1F33`) for dark mode, selected via `prefers-color-scheme` media attribute
  - `apple-touch-icon` (180x180) referenced in `<head>` for iOS home-screen bookmarks
  - `apple-mobile-web-app-title` set to short property name
  - Web app manifest (`site.webmanifest`) linked in `<head>`, containing: app name, short name, Android Chrome icons (192x192, 512x512), theme color, background color, display mode (standalone), start URL (`/hr/`)
  - SVG favicon (`favicon.svg`) as primary icon
  - **Note:** This is a lightweight home-screen/bookmark enhancement, not a full PWA. No service worker, no offline support, no push notifications.
- **Constraints:** CON-SEO
- **Priority:** P2
- **Dependencies:** None
- **Verification:** Verify theme-color changes browser chrome on Android. Verify iOS "Add to Home Screen" uses apple-touch-icon and short title. Verify manifest loads without errors in DevTools Application panel.
- **Status:** Implemented — all acceptance criteria met. theme-color (light/dark), apple-touch-icon reference, manifest link, apple-mobile-web-app-title in head. Icon/favicon PNGs (apple-touch-icon 180px, android-chrome 192px + 512px, favicon-32x32.png) regenerated from sailboat brand logo and committed. SVG favicon as primary icon. Cache headers for icon paths and manifest.

## Out of Scope

- Google Analytics / third-party analytics
- A/B testing
- Search Console API integration
- Google Ads / paid search

## Domain Dependencies

- i18n (hreflang, locale activation, keyword targets)
- Apartments (structured data source, internal links)
- Editorial (FAQ structured data, keyword content, internal links)
- Social Proof (review structured data)
- Trust & Compliance (privacy policy, NAP consistency)
