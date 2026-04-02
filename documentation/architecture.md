# Architecture

System overview, component map, and data flow for Apartmani Pašman.

**Audience:** Developers

---

## Overview

Apartmani Pašman is a server-side rendered Astro site deployed as a Cloudflare Worker. It serves a multilingual vacation rental website with an owner-facing admin panel. There is no separate backend service — all logic runs at the edge inside the Worker.

## Components

### Runtime

| Component | Role |
|---|---|
| Cloudflare Worker | Hosts the entire application (Astro SSR via `@astrojs/cloudflare`) |
| Cloudflare D1 | SQLite-compatible edge database — auth codes, sessions, inquiries, availability blocks, analytics events, slug redirects |
| Cloudflare R2 | Private object storage for uploaded media (`apartmani-media` bucket) |
| Cloudflare Image Resizing | Edge image transforms — AVIF/WebP conversion, resizing, HEIC support |
| Resend | Transactional email — magic link codes, inquiry notifications |
| Cloudflare Turnstile | Bot protection on public forms |
| Emdash CMS | Embedded CMS integration mounted at `/_emdash/` |

### Source Modules

| Path | Responsibility |
|---|---|
| `src/i18n/` | Locale config, translation loader (`t()`), format helpers |
| `src/lib/auth.ts` | JWT signing/verification, code generation, refresh tokens |
| `src/lib/availability.ts` | Half-open interval overlap logic for booking calendar |
| `src/lib/pricing.ts` | Season-based price computation, tourist tax, cleaning fee |
| `src/lib/media.ts` | R2 URL builder (`buildMediaUrl`) and srcset helper |
| `src/lib/resend.ts` | Fetch-based Resend email client |
| `src/lib/turnstile.ts` | Server-side Turnstile token verification |
| `src/lib/sanitize.ts` | Input sanitization — HTML stripping, email header injection prevention |
| `src/schemas/inquiry.ts` | Zod schemas for booking and quick-question form submissions |
| `src/middleware/` | Request pipeline: redirects → locale → security headers |
| `src/pages/media/[key].ts` | Image serving route — fetches from R2, applies cache headers |
| `src/pages/admin/api/` | Auth API endpoints (login, verify, upload-url) |
| `src/pages/admin/api/inquiries/[id]/confirm.ts` | Confirm booking inquiry and block dates atomically |
| `src/pages/api/apartments/[id]/availability.ts` | Availability API — returns booked dates for calendar display |
| `src/pages/api/inquiry.ts` | Inquiry submission — full booking pipeline (validate, persist, email) |
| `src/pages/api/track.ts` | Analytics API — cookieless event logging to D1 |
| `src/layouts/` | Base and Page layout shells |
| `src/components/shell/` | Navigation, Footer, LanguageSwitcher, WhatsAppButton, StickyMobileCTA |
| `src/styles/global.css` | Design system — CSS custom properties, typography scale, layout utilities, component classes, animation utilities |

## Request Lifecycle

```
Browser → Cloudflare edge
  → Worker (Astro SSR)
    → redirectsMiddleware   (trailing slash normalization)
    → localeMiddleware      (extract/validate locale from URL prefix)
    → headersMiddleware     (CSP, X-Frame-Options, security headers)
    → Page handler / API route
      → D1 / R2 / external service calls
    → Response
```

## Locale Routing

All public pages are prefixed with the locale: `/hr/`, `/de/`, `/sl/`, `/en/`. Croatian (`hr`) is the default. The root path `/` redirects to the detected locale via `Accept-Language` header. The locale middleware sets `locals.locale` for downstream use. API, media, and admin routes bypass locale middleware entirely.

Route parameters beginning with `_` are passed through — every `[locale]` page handler returns 404 immediately for a `locale` value starting with `_`. This allows Emdash admin routes (mounted at `/_emdash/`) to pass through the Astro file-based router without being caught and redirected to `/hr/`.

### Public Page Routes

| Route | File | Description |
|---|---|---|
| `/:locale/` | `src/pages/[locale]/index.astro` | Homepage |
| `/:locale/apartmani` | `src/pages/[locale]/apartmani/index.astro` | Apartment listing — pre-launch split layout: duo photos + editorial text + inquiry CTA |
| `/:locale/apartmani/:slug` | `src/pages/[locale]/apartmani/[slug].astro` | Apartment detail (not yet created) |
| `/:locale/zasto-pasman` | `src/pages/[locale]/zasto-pasman.astro` | Why Pašman — 4 selling-point sections |
| `/:locale/dolazak` | `src/pages/[locale]/dolazak.astro` | Getting Here — ferry, airport, map links |
| `/:locale/faq` | `src/pages/[locale]/faq.astro` | FAQ — accordion with Schema.org FAQPage markup |
| `/:locale/o-nama` | `src/pages/[locale]/o-nama.astro` | About Us — host story |
| `/:locale/vodic` | `src/pages/[locale]/vodic.astro` | Local Guide — alternating image+text rows for 4 categories (beaches, food, activities, day trips), localized in all 4 locales |
| `/:locale/privatnost` | `src/pages/[locale]/privatnost.astro` | Privacy Policy (GDPR) |
| `/:locale/impressum` | `src/pages/[locale]/impressum.astro` | Legal notice |
| `/:locale/pristupacnost` | `src/pages/[locale]/pristupacnost.astro` | Accessibility statement — WCAG 2.1 AA compliance target, localized in all 4 locales |

`/:locale` is one of `hr`, `de`, `sl`, `en`.

## Media Pipeline

There are two categories of images with different serving paths:

### Owner-uploaded apartment photos

Stored in the `apartmani-media` R2 bucket as UUID-named objects. Served via `/media/:key`, which fetches from the private R2 bucket and adds long-lived cache headers (`Cache-Control: public, max-age=31536000, immutable`). Transform parameters (`w`, `f`, `q`, `fit`) are accepted as query strings for forwarding to Cloudflare Image Resizing once the zone has that feature enabled; currently the route serves originals. The `buildMediaUrl()` helper in `src/lib/media.ts` constructs these URLs.

Direct R2 browser uploads use presigned PUT URLs generated by `POST /admin/api/upload-url` via `aws4fetch` signed with R2 S3-compatible credentials.

### Stock and editorial photography

Homepage stock photos (hero backgrounds, photo strips, image sections) are served as **direct Pexels CDN URLs** hardcoded in markup. This is a temporary workaround: the `/media/:key` route returns 404 for keys containing file extensions (e.g., `hero-turquoise-sea.jpg`) because Astro's file-based routing intercepts `.jpg`-suffixed paths before the API handler. The fix requires either a catch-all route or extension-free key names. Until then, stock photos bypass R2 entirely and are fetched from `images.pexels.com`.

The intended end state is for all images — both owner-uploaded and stock — to be served from R2 via `/media/:key`. See [AD12](decisions/README.md#ad12-stock-photos-will-be-served-from-r2-pending-routing-fix-currently-direct-pexels-urls) for the rationale and the outstanding routing issue.

## Authentication Model

The admin panel uses Magic Link auth. See [Authentication](authentication.md) for the full flow.

## Pricing Model

Season-based pricing supports cross-season stays. Tourist tax is applied per taxable person per night (adults + children 12–17; children under 12 exempt). Cleaning fee is flat. See `src/lib/pricing.ts` for `computeStayPrice()`.

## Availability Model

Bookings are stored as half-open intervals `[checkIn, checkOut)`. The checkout day is available for new check-ins. Overlap detection uses the condition: `proposed.checkIn < block.checkOut AND proposed.checkOut > block.checkIn`. The `availability_blocks` table stores blocks by apartment ID with `source` tracking (`manual | ics | inquiry`). The calendar API at `GET /api/apartments/:id/availability` expands blocks into individual booked dates for display.

## Analytics Model

Cookieless analytics events are logged to the D1 `events` table via `POST /api/track`. No PII is stored — only event type, apartment slug, locale, page path, and timestamp. Valid event types: `inquiry_submit`, `question_submit`, `whatsapp_click`, `call_click`, `apartment_view`, `gallery_open`, `language_switch`, `calendar_select`.

## Inquiry Pipeline

Inquiries are stored in D1 `inquiries` table covering the full lifecycle: `new → read → responded → confirmed | declined | spam`. Email delivery status is tracked separately (`pending → sent | retry | failed`) with retry metadata. The D1 record is the source of truth for status; email is the primary notification channel (see [AD6](decisions/README.md#ad6-inquiry-lifecycle-via-email-first-d1-as-backup-log)).

### Submission Flow (POST /api/inquiry)

```
Browser submits form
  → Turnstile verification (server-side, 10s timeout)
  → Honeypot check (silent fake-success on bot)
  → Zod schema validation (discriminated union: booking | question)
  → Input sanitization (stripHtml, sanitizeEmail, stripUrls, etc.)
  → [booking only] Server-side availability overlap recheck → 409 if stale
  → [booking only] Price estimate from seasons table
  → INSERT INTO inquiries (status='new', email_status='pending')
  → Resend: owner notification + guest auto-reply
  → UPDATE inquiries SET email_status='sent'|'retry'
  → INSERT INTO events (type='inquiry_submit'|'question_submit')
  → 200 (email sent) or 202 (email failed, inquiry saved)
```

### Confirmation Flow (POST /admin/api/inquiries/:id/confirm)

```
Admin triggers confirm
  → JWT auth check (auth_token cookie) → 401 if missing or invalid
  → Lookup inquiry by ID → 404 if missing
  → Guard: type must be 'booking' → 400 if question
  → Guard: status must not be 'confirmed' → 409 if already done
  → Step 1 — D1 batch (INSERT only):
      INSERT INTO availability_blocks ... WHERE NOT EXISTS (overlap)
        → 0 rows inserted = 409 date_conflict, status NOT updated
  → Step 2 — only if INSERT succeeded:
      UPDATE inquiries SET status='confirmed'
  → 200 success
```

Overlap detection is embedded in the INSERT statement itself (`INSERT...WHERE NOT EXISTS`), not as a separate pre-check. The INSERT runs alone in a D1 `batch()` so its result can be checked before the status update executes. If `meta.changes === 0` the function returns `409` and the UPDATE is never reached — preventing the previous failure mode where the UPDATE ran unconditionally in the same batch even when no block was written.

## Seed Data Structure

The `seed/` directory holds structured JSON files used to bootstrap the database before launch. Records with `"placeholder": true` indicate content that must be replaced with real data before going live.

### Apartments (`seed/content/apartments.json`)

Each apartment record contains structured fields (not rich text): `capacity`, `bedrooms`, `bathrooms`, `areaSqm`, `distanceToBeachMeters`, `seaView`, `amenities` (object), `bedConfig` (array), `bestFor` (array), `cleaningFee`, and a `localized` map keyed by locale (`hr`/`de`/`sl`/`en`). Each locale entry has `name`, `slug`, `shortDescription`, `valueProp`, `seoTitle`, `seoDescription`. Apartment IDs (`apt-lavanda`, `apt-tramuntana`) are referenced by seasons and testimonials.

### Seasons (`seed/content/seasons.json`)

Each season record has `apartmentId`, `name` (Off-peak/Peak/Shoulder), `startDate`, `endDate`, `pricePerNight`, and `minStay`. Seasons are used by the pricing model in `src/lib/pricing.ts` to compute stay costs.

### Testimonials (`seed/content/testimonials.json`)

Each testimonial has `guestName`, `country`, `travelType`, `season`, `year`, `rating`, `source`, `isFeatured`, `mostLovedFor` (tag array), `apartmentId`, and a `quote` map localized across all 4 locales.

### Site Settings (`seed/content/site-settings.json`)

A single object with `propertyName`, `email`, `checkInTime`, `checkOutTime`, `touristTaxRate`, `activeLocales`, `heroPhotoKeys`, and `sectionToggles` (feature flags for homepage sections).

## Design System

The entire visual language lives in `src/styles/global.css` as CSS custom properties on `:root`. No CSS-in-JS, no utility framework — component classes are defined once and composed in markup.

### Token Categories

| Category | Key Tokens |
|---|---|
| Colors (palette) | `--color-azure`, `--color-navy`, `--color-stone`, `--color-cream`, `--color-sand`, `--color-terracotta`, `--color-olive` |
| Colors (semantic) | `--color-text`, `--color-text-heading`, `--color-text-light`, `--color-text-muted`, `--color-bg`, `--color-bg-alt`, `--color-bg-dark`, `--color-accent`, `--color-border` |
| Typography (scale) | `--font-size-xs` (11px) through `--font-size-5xl` (60px) plus `--font-size-display` (`clamp(3rem, 7vw, 6rem)`) |
| Typography (faces) | `--font-serif` (Cormorant Garamond → Playfair Display → Georgia), `--font-sans` (Inter → system stack) |
| Spacing | `--space-xs` through `--space-4xl`; `--space-section` (`clamp(5rem, 12vw, 10rem)`) for section vertical rhythm |
| Layout | `--max-width` (1280px), `--max-width-narrow` (720px), `--max-width-text` (60ch), `--nav-height` (80px) |
| Motion | `--ease-out`, `--ease-in-out`, `--duration-fast` (0.15s), `--duration-normal` (0.4s), `--duration-slow` (0.8s) |
| Radius | `--radius-sm` (2px), `--radius-md` (6px), `--radius-lg` (12px) |
| Shadows | `--shadow-sm` through `--shadow-xl` — warm, low-opacity (0.04–0.10 alpha) |

### Component Classes

| Class | Purpose |
|---|---|
| `.btn` | Base button — outlined, uppercase tracking, fill-on-hover via `::before` pseudo-element |
| `.btn--primary` | Solid navy fill, azure on hover |
| `.btn--ghost` | White border/text for use on dark backgrounds |
| `.text-lead` | Refined body copy — `--font-size-xl`, 1.65 line-height |
| `.text-label` | Small-caps label above headings — `--font-size-xs`, wide tracking, muted color |
| `.section` | Section padding via `--space-section` |
| `.section--alt` | Stone background (`--color-bg-alt`) |
| `.section--dark` | Navy background with white headings |
| `.container` | Centered max-width wrapper with fluid inline padding |
| `.container--narrow` | Constrained to `--max-width-narrow` (720px) |
| `.texture-stone` | SVG fractal-noise grain overlay via `::before` pseudo-element (opacity 0.02) |
| `.section-divider` | 120px × 1px sand-colored horizontal rule |
| `.image-hover-zoom` | Wrapper that scales the child `<img>` to 1.05× on hover with a slow ease — used on apartment cards and gallery items |

### Homepage Photo Patterns

These layout components are defined as scoped styles in `src/pages/[locale]/index.astro`. They enforce a unified photo aesthetic: no rounded corners, no padding on photo sections (edge-to-edge), and uniform aspect ratios per pattern.

| Class | Pattern | Key rules |
|---|---|---|
| `.photo-strip` | Horizontal strip of three images at uniform 3:2 aspect ratio, edge-to-edge | `display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px` |
| `.full-bleed-image` | Single image at 21:9 aspect with a gradient overlay and centered text | `aspect-ratio: 21/9`; child `.full-bleed-image__text` is absolute-positioned |
| `.duo-image` | Two images side by side at uniform 3:4 aspect, 4px gap | `display: grid; grid-template-columns: 1fr 1fr; gap: 4px` |
| `.triptych` | Three-column edge-to-edge grid at uniform 4:5 aspect with label overlays | `display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px`; `.triptych__label` is absolute-positioned |
| `.split-section` | Two-column layout: text (`__left`) + content (`__right`) | 50/50 columns on desktop, stacked on mobile; `.split-section--reverse` swaps column order |
| `.tag-row` | Horizontal wrapping row of inline tag chips | `display: flex; flex-wrap: wrap; gap: var(--space-sm)` |
| `.tag` | Individual chip inside a `.tag-row` | `border: 1px solid var(--color-border)`, small padding, `--font-size-xs` |

### Page-Specific Layout Classes

These classes are defined as scoped styles inside individual page components. They follow the same design conventions as Homepage Photo Patterns (no rounded corners, edge-to-edge images, 4px gaps) but are not shared across pages.

| Class | Page | Pattern |
|---|---|---|
| `.apartments-coming` | `apartmani/index.astro` | Two-column grid: duo photos (`1fr`) + editorial text (`1.2fr`); stacks on mobile. Pre-launch placeholder layout. |
| `.apartments-coming__images` | `apartmani/index.astro` | Two images side by side, 3:4 aspect ratio, 4px gap |
| `.guide-grid` | `vodic.astro` | Flex column of `.guide-item` rows, spaced by `--space-3xl` |
| `.guide-item` | `vodic.astro` | Alternating two-column row: photo (`1fr`) + text (`1fr`), 3:2 photo aspect; odd rows reverse column order via `.guide-item--reverse` |

### Progressive Enhancement

Scroll reveal animations are gated on a `.reveal-ready` class that JavaScript adds to `<body>` after the page loads. Without JS, all content is visible at full opacity — no layout shift, no hidden text. See [AD11](decisions/README.md#ad11-scroll-animations-gated-on-reveal-ready-class) for the rationale.

---

## Related Documentation

- [API Reference](api-reference.md#post-apiinquiry) — Inquiry and confirm endpoint signatures
- [API Reference](api-reference.md#get-sitemapxml) — Sitemap and robots.txt endpoints
- [Configuration](configuration.md#environment-variables) — All env vars and bindings
- [Authentication](authentication.md#magic-link-flow) — Auth flow detail
- [Security](security.md#availability-double-check) — Overlap guard on inquiry submit and confirm
- [Security](security.md#content-security-policy) — CSP and header policy
- [SEO](seo.md) — Keyword targets, structured data, sitemap strategy
- [Decisions](decisions/README.md) — Trade-off rationale for key choices
- [Deployment](deployment.md#seed-data) — Seed files, media sourcing plan, seeding process
