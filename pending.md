# Pending Items — Apartmani Novoselec

Last updated: 2026-04-04

## Spec: Partial Requirements (5)

- **REQ-AP-3** (Apartment Detail): ScrollCollage replaces gallery. Missing: breadcrumb polish on all pages
- **REQ-CMS-6** (Preloaded Content): 171 CMS entries seeded. Missing: seed.json not synced with D1 content (drift), 48 Pexels URLs remain in old guide/vodic CMS entries
- **REQ-PERF-1** (Image Pipeline): R2 serving works via /api/img/uuid. Missing: Cloudflare Image Resizing not enabled, no responsive srcset, no blurhash placeholders
- **REQ-SEO-1** (Schema.org): LodgingBusiness on homepage, VacationRental on apartments, FAQPage on FAQ. Missing: BreadcrumbList on all subpages, Article schema on editorial pages
- **REQ-SEO-2** (Open Graph): og:image on 10 pages. Missing: Twitter Card meta tags, per-apartment OG image via Image Resizing at 1200x630

## Spec: Planned Requirements (18) — P3 polish, not launch-blocking

- REQ-A11Y-2: Keyboard Navigation
- REQ-A11Y-3: Screen Reader Support
- REQ-A11Y-4: Color & Contrast
- REQ-ED-3: "A Day on Pašman" Section
- REQ-I18N-2: Language Activation Settings
- REQ-I18N-4: CMS Content Localization (DE/SL content thin in some pages)
- REQ-I18N-6: Cultural Content Adaptation
- REQ-PERF-2: Edge Caching
- REQ-PERF-3: Bundle Budget
- REQ-SEO-5: Keyword Strategy
- REQ-SEO-6: Local SEO (Google Business Profile)
- REQ-SEO-7: URL Policy & Indexation Controls
- REQ-SEO-8: Content Freshness
- REQ-SF-2: Optional Ambient Video Hero
- REQ-SP-2: Trust Strip (badges/icons)
- REQ-TC-4: House Rules & Booking Terms
- REQ-VD-13: Icon System
- REQ-VD-5: Section Color Progression

## CMS Data Issues

- 32 editorial entries still have Pexels image URLs (vodic/guide old seed content)
- 16 guide entries still have Pexels image URLs
- seed.json completely out of sync with D1 data (apartments still named Lavanda/Tramuntana with Pexels hero images)
- Emdash media upload widget: field types changed to "image" but R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY not set as Worker secrets (presigned upload won't work)

## User Requests from Transcript (not yet executed)

### Content
- [ ] Food page content: user said "do not mention ratings prices" — rewritten, but DE/SL translations may still have old content with ratings
- [ ] "find additional high quality photos of Ždrelac, Pašman and Ugljan on blogs, google photos etc." — not done, only owner photos used
- [ ] Gallery page: user said alt text was wrong — rewritten with correct descriptions
- [ ] Ždrelac page: user requested only village content (bridge, olives, church, life, fishing, paths) — done for HR, DE/SL/EN translations are from LLM

### Visual / CSS (user's upcoming feedback)
- [ ] User mentioned "many small visual feedback" — awaiting specific items
- [ ] Collage on homepage: user confirmed it works but may have visual tweaks
- [ ] Footer: user may have feedback on the redesigned footer

### Technical
- [ ] CF Web Analytics: enable in Cloudflare dashboard (no code change, just toggle)
- [ ] Emdash admin: verify image upload widget works with R2 (needs R2 access keys as secrets)
- [ ] Verify Turnstile works on contact form (user confirmed widget created)
- [ ] Verify Resend email delivery (user confirmed 1 email to admin works)

## Architecture Debt

- [ ] Emdash `getEmDashCollection` returns all entries without limit by default — works now but could be slow with hundreds of entries
- [ ] Gallery page has hardcoded photo list (not from CMS) — should be CMS-managed like collage
- [ ] Homepage duo-image section still has hardcoded image UUIDs (not from CMS)
- [ ] Some homepage sections (why-pasman title, apartments title) have hardcoded locale fallbacks
- [ ] `content-validation.test.ts` photo tests removed after R2 migration — need R2-aware tests
- [ ] `seed.json` drift: seed data doesn't match production D1 content
