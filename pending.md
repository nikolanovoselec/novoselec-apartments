# Pending Items — Apartmani Novoselec

Last updated: 2026-04-05 (session 5)

## Completed This Session

- Content overlap resolved (zdrelac merged into vodic, zasto-pasman deleted)
- CMS restructured: dedicated collections per editorial page (vodic, hrana, aktivnosti, plaze, dolazak, about)
- 15 real food photos uploaded and wired to hrana page
- 31 beach/island photos uploaded (new + recovered from git)
- All images deduplicated (zero cross-page duplicates)
- Apartment galleries cleaned (interiors+terraces only, exteriors in collage)
- Dead CMS collections deleted (guide, posts, pages)
- 1 broken image fixed (homepage collage)

## Spec: Partial Requirements (4)

- **REQ-PERF-1** (Image Pipeline): R2 serving works. Missing: Cloudflare Image Resizing, responsive srcset, blurhash placeholders
- **REQ-SEO-1** (Schema.org): LodgingBusiness + VacationRental + FAQPage done. Missing: BreadcrumbList on subpages
- **REQ-SEO-2** (Open Graph): og:image on pages. Missing: per-apartment OG image via Image Resizing
- **REQ-AP-3** (Apartment Detail): MiniCollage works. Missing: breadcrumb polish

## Spec: Planned Requirements (not launch-blocking)

- REQ-A11Y-2/3/4: Keyboard nav, screen reader, contrast
- REQ-ED-3: "A Day on Pašman" timeline section
- REQ-I18N-2/4/6: Language activation, DE/SL content completion, cultural adaptation
- REQ-PERF-2/3: Edge caching, bundle budget
- REQ-SEO-5/6/7/8: Keywords, local SEO, URL policy, freshness
- REQ-SF-2: Optional ambient video hero
- REQ-SP-2: Trust strip badges
- REQ-TC-4: House rules & booking terms
- REQ-VD-13: Icon system

## Content Gaps

- DE/SL editorial content thin in some pages (HR and EN complete)
- 3 HEIC photos not processed (no HEIC support in container)
- Apartment comparison table (not requested)
