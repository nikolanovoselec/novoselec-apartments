# Performance

Image serving, edge caching, bundle budget.

## Key Concepts

- **Image Resizing**: Cloudflare service transforming images on-the-fly at the edge — no Worker-side processing
- **Edge caching**: Static pages cached at Cloudflare's global edge network for sub-second delivery
- **Bundle budget**: Maximum JS size shipped to visitors (< 80KB gzipped)
- **Blurhash**: Compact placeholder encoding shown before full image loads

## Requirements

### REQ-PERF-1: Image Serving Pipeline

- **Intent:** Fast, beautiful images from phone photos without Worker-side processing
- **Applies To:** System
- **Acceptance Criteria:**
  - Originals stored in private R2 (no processing in Worker — memory/CPU limits)
  - **Image delivery via Worker route** `GET /api/img/{key}?w=800&f=webp&q=80` — Worker fetches from private R2 (via Emdash storage abstraction with direct R2 fallback), applies Cloudflare Image Resizing via `cf: { image: { ... } }` on the response. Works with private buckets. Object keys are opaque UUIDs (no file extensions). Keys containing path traversal sequences (`..`) or leading slashes are rejected with 400.
  - Responsive `<picture>` with `srcset` at 400, 800, 1200, 1920px widths
  - Format negotiation: AVIF > WebP > JPEG based on Accept header
  - **Blurhash:** Computed client-side in CMS admin UI for new uploads (lightweight JS library). Computed at seed time for preloaded content. Stored as metadata string in D1. (No background task or Worker-side computation.)
  - Lazy loading (`loading="lazy"`) below fold
  - Hero first image: `loading="eager"` + `<link rel="preload">` + `fetchpriority="high"`
  - Subsequent Ken Burns images: lazy-loaded in background after first paint
  - **Failure modes:**
    - Image Resizing unavailable: fall back to original image from R2 (larger but functional)
    - Original not found in R2: show blurhash placeholder with alt text. No broken image icon.
    - Blurhash missing: show solid color placeholder (dominant palette color from CSS custom properties)
  - Target: LCP < 2.5s, CLS < 0.1
- **Constraints:** CON-PERF, CON-MEDIA
- **Priority:** P0
- **Dependencies:** REQ-CMS-2
- **Verification:** Lighthouse audit on 4G throttle
- **Status:** Partial — R2 serving route implemented at `/api/img/[key]` with long-lived immutable cache headers and error handling. Fetches via Emdash storage abstraction with direct R2 bucket fallback. All site images (hero, subpage heroes, gallery, content) migrated from local `/photos/` directory to R2, served via `/api/img/{uuid}`. Image Resizing (`cf: { image }`) not yet applied (currently serves originals). Blurhash, responsive `<picture>`, and format negotiation not yet implemented.

### REQ-PERF-2: Edge Caching

- **Intent:** Sub-second responses worldwide
- **Applies To:** System
- **Acceptance Criteria:**
  - Static pages (homepage, apartments, editorial) cached at edge with `stale-while-revalidate`
  - **Root `/` is NOT shared-cacheable** — performs personalized locale redirect (`302`) based on: 1) locale cookie, 2) `Accept-Language`, 3) Croatian default
  - Dynamic routes (admin, API, form submission, `/api/track`, `/api/apartments/*/availability`) bypass cache
  - **Availability calendar data fetched client-side** via uncached API endpoint. Calendar shell renders statically; dates/pricing loaded on mount via JS. Prevents stale availability in cached pages.
  - Cache purged on content update from CMS (via Cache API)
  - Media from R2 via Image Resizing: cached at edge with long TTL
  - Locale is embedded in URL path (`/hr/`, `/de/`, etc.) so standard URL-based edge caching naturally separates locales. No custom cache key logic needed.
- **Constraints:** CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-CMS-1
- **Verification:** Check cache headers, multi-region response times
- **Status:** Planned

### REQ-PERF-3: Bundle Budget

- **Intent:** Minimal JS shipped to visitors
- **Applies To:** System
- **Acceptance Criteria:**
  - Astro islands: JS only for lightbox, inquiry form, availability calendar, optional GSAP
  - Total JS < 80KB gzipped (visitor pages)
  - GSAP (if used): loaded only on pages that need it, code-split
  - Interactive map (if introduced in P2): lazy-loaded on scroll into viewport
  - No JS framework for static content sections
  - Admin bundle separate from visitor bundle
- **Constraints:** CON-PERF
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Bundle analysis
- **Status:** Planned

## Out of Scope

- PWA / Service Worker (unnecessary for this scale)
- Full offline-first architecture
- Background sync
- Push notifications

## Domain Dependencies

- CMS (media storage, cache invalidation)
- All visitor-facing domains (bundle contribution)
