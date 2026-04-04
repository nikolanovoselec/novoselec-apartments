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
| `src/lib/resend.ts` | Fetch-based Resend email client — used by inquiry and custom admin login flows |
| `src/lib/turnstile.ts` | Server-side Turnstile token verification |
| `src/lib/content.ts` | Emdash CMS helpers — `getLocalizedCollection`, `getLocalizedEntry`, `getSettings` with locale fallback to Croatian |
| `src/lib/hreflang.ts` | `buildHreflangLinks(pathname, siteOrigin)` — builds `<link rel="alternate" hreflang>` objects for all four locales plus `x-default`; used in the `<head>` of every page |
| `src/lib/schema.ts` | Schema.org JSON-LD builders — `buildVacationRentalSchema(apartment, locale)` and `buildBreadcrumbSchema(items)`; consumed by apartment detail pages |
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
| `src/components/shell/` | Navigation (desktop nav + mobile hamburger menu with `is:inline` script to avoid Astro bundler stripping), Footer, LanguageSwitcher, WhatsAppButton, StickyMobileCTA |
| `src/components/home/Hero.astro` | Hero carousel — 4 local island photos from `public/photos/`, crossfade (1.8s CSS transition), continuous zoom animation (`heroZoom` keyframe: 12s ease-in-out infinite alternate, scale 1→1.1 with -1%/-1% translate, paused until slide is active), auto-advance every 6 s, dot navigation, hover-pause; implemented as `is:inline` script |
| `src/components/ui/HeroSimple.astro` | Interior page hero — used on all non-homepage pages. Props: `title` (required), `subtitle` (optional, displayed as small-caps label), `image` (optional URL). When `image` is provided, the photo fills the hero with a slow 20 s zoom (`heroSimpleZoom` keyframe: scale 1→1.06, ease-in-out infinite alternate) and a dark navy gradient overlay. Without `image`, falls back to a static dark navy radial-gradient background. An inline SVG wave (cream `#F8F5EF`) is always rendered at the bottom of the section to merge visually with the page background. |
| `src/components/ui/WaveDivider.astro` | Full-width SVG wave divider between sections. Props: `fill` (wave color, default `#F8F5EF`), `flip` (boolean, flips vertically via `scaleY(-1)` for wave-out effect), `class`. Height is fluid: `clamp(40px, 6vw, 80px)`. Used in pairs on the homepage to bracket the dark navy section and the sunset CTA section. |
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

Astro's i18n is configured with `routing: "manual"`. File-based `[locale]` directories handle all locale resolution; Astro does not automatically prefix or rewrite any routes. Manual mode is required to prevent Astro from localizing integration-injected routes such as Emdash's `/_emdash/admin` — with automatic `prefixDefaultLocale` routing, Astro would move that page to `/hr/_emdash/admin`, causing the `[locale]` handler to receive `_emdash` as the locale and return 404. See [AD13](decisions/README.md#ad13-switch-to-manual-i18n-routing-to-prevent-astro-from-rewriting-integration-injected-routes).

### Public Page Routes

| Route | File | Description |
|---|---|---|
| `/:locale/` | `src/pages/[locale]/index.astro` | Homepage |
| `/:locale/apartmani` | `src/pages/[locale]/apartmani/index.astro` | Apartment listing — card grid (2 columns desktop, 1 mobile); CMS-only; each card links to detail page |
| `/:locale/apartmani/:slug` | `src/pages/[locale]/apartmani/[slug].astro` | Apartment detail — hero image, description, meta grid (sleeps/bedrooms/size/beach distance), price card, amenity list; fetches entry directly by slug via `getEmDashEntry("apartments", slug)` with no locale filtering (locale is applied in rendering, not in lookup); redirects to listing on missing slug |
| `/:locale/zdrelac` | `src/pages/[locale]/zdrelac.astro` | Ždrelac village — CMS-only: queries `editorial` collection for `page_key === "zdrelac"`, sorted by `sort_order`; renders no content rows if CMS entries absent; localized in all 4 locales; linked from main nav |
| `/:locale/galerija` | `src/pages/[locale]/galerija.astro` | Gallery — masonry grid of location and apartment photos with lightbox; linked from main nav |
| `/:locale/zasto-pasman` | `src/pages/[locale]/zasto-pasman.astro` | Why Pašman — CMS-only: queries `editorial` collection for `page_key === "why-pasman"`; renders sections from `sections_json` field (array of `{title, text}`); renders no content if CMS entry is absent; not in main nav |
| `/:locale/dolazak` | `src/pages/[locale]/dolazak.astro` | Getting Here — CMS-only: queries `editorial` collection for `page_key === "getting-here"`; sections parsed from `sections_json` (keys: `ferry`, `alt-route`, `airport`); map links and transfer text always rendered from i18n strings; renders empty if CMS entry absent |
| `/:locale/faq` | `src/pages/[locale]/faq.astro` | FAQ — accordion with Schema.org FAQPage markup (not in main nav) |
| `/:locale/o-nama` | `src/pages/[locale]/o-nama.astro` | About Us — CMS-only: queries `editorial` collection for `page_key === "about"`; renders `body` field as host story; renders empty if CMS entry absent |
| `/:locale/vodic` | `src/pages/[locale]/vodic.astro` | Local Guide — queries `guide` collection (sorted by `sort_order`) for 4 static category rows, supplemented by `editorial` entries with `page_key === "vodic"`; all rendered in one unified alternating content-row layout; localized in all 4 locales |
| `/:locale/hrana` | `src/pages/[locale]/hrana.astro` | Food & Drink — CMS-only: queries `editorial` collection for `page_key === "hrana"`, sorted by `sort_order`; page-hero + alternating content-row layout; renders no content rows if CMS entries absent; localized in all 4 locales; linked from homepage triptych |
| `/:locale/aktivnosti` | `src/pages/[locale]/aktivnosti.astro` | Nature & Activities — CMS-only: queries `editorial` collection for `page_key === "aktivnosti"`, sorted by `sort_order`; renders no content rows if CMS entries absent; page-hero + alternating content-row layout; localized in all 4 locales; linked from homepage triptych |
| `/:locale/plaze` | `src/pages/[locale]/plaze.astro` | Beaches — CMS-only: queries `editorial` collection for `page_key === "plaze"`, sorted by `sort_order`; renders no content rows if CMS entries absent; page-hero + alternating content-row layout; localized in all 4 locales; linked from homepage triptych |
| `/:locale/kontakt` | `src/pages/[locale]/kontakt.astro` | Contact — standalone inquiry form with Turnstile CAPTCHA, honeypot, and GDPR consent checkbox; submits as `type: "question"` to `POST /api/inquiry`; all CTA links across the site point here |
| `/:locale/privatnost` | `src/pages/[locale]/privatnost.astro` | Privacy Policy (GDPR) — linked from the GDPR consent checkbox on the contact form |

`/:locale` is one of `hr`, `de`, `sl`, `en`.

## Media Pipeline

There are two categories of images with different serving paths:

### Owner-uploaded apartment photos

Stored in the `apartmani-media` R2 bucket as UUID-named objects. Served via `/media/:key`, which fetches from the private R2 bucket and adds long-lived cache headers (`Cache-Control: public, max-age=31536000, immutable`). Transform parameters (`w`, `f`, `q`, `fit`) are accepted as query strings for forwarding to Cloudflare Image Resizing once the zone has that feature enabled; currently the route serves originals. The `buildMediaUrl()` helper in `src/lib/media.ts` constructs these URLs.

Direct R2 browser uploads use presigned PUT URLs generated by `POST /admin/api/upload-url` via `aws4fetch` signed with R2 S3-compatible credentials.

### Real island photography

Editorial and hero photography (hero carousel, page heroes, content-row images) are **real photos of Ždrelac and Pašman island** committed to the repository under `public/photos/` and referenced as root-relative paths (e.g., `/photos/zdrelac-from-sea.jpg`). These are served as static assets from the Worker's asset manifest — no R2 lookup required. Pexels stock photos have been fully replaced.

The intended end state remains R2-based serving for all images (both owner-uploaded and editorial). Migrating `public/photos/` to R2 is deferred; the previous routing issue (404 on `.jpg`-suffixed keys) still applies to the `/media/:key` route. See [AD12](decisions/README.md#ad12-editorial-photos-committed-to-publicphotos-replacing-pexels-r2-migration-deferred) for the current decision and rationale.

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

`seed/seed.json` is a single Emdash-format seed file that defines all CMS collections and their initial entries. It is loaded at build time by `src/pages/api/admin/seed.ts` and applied to the Emdash database via `applySeed`. The file also carries global site `settings` (title, URL, timezone).

### Collections

| Collection slug | Entries | Description |
|---|---|---|
| `pages` | ~32 | Static editorial pages in all 4 locales — Why Pašman, Getting Here, About, Privacy, etc. Each entry has `locale`, `page_key`, `title`, `subtitle`, `body` (richtext), and `hero_image`. Note: several pages query the `editorial` collection (not `pages`) by `page_key`. All content pages are CMS-only with no hardcoded fallback — `zasto-pasman.astro`, `dolazak.astro`, `o-nama.astro`, `hrana.astro`, `zdrelac.astro`, `aktivnosti.astro`, and `plaze.astro` all render empty content until matching `editorial` entries are seeded. |
| `apartments` | 2 | Apartment detail pages per locale — `apt-lavanda` and `apt-tramuntana`. Structured fields: capacity, bedrooms, amenities, bed config, distances, per-locale name/description/SEO. |
| `faq` | ~20 | FAQ entries in all 4 locales — `locale`, `question`, `answer` (richtext), `sort_order`. |
| `guide` | ~16 | Local guide entries (beaches, food, activities, day trips) per locale — `locale`, `category`, `title`, `description`, `image_url`. |
| `testimonials` | 6 | Guest testimonials linked to apartments — `guest_name`, `country`, `rating`, `quote`, `apartment_id`, `is_featured`. |
| `amenities` | ~10 | Amenity definitions — `slug`, `icon`, `label` per locale. |

All content is loaded at runtime via `src/lib/content.ts` helpers (`getLocalizedCollection`, `getLocalizedEntry`), which filter entries by locale and fall back to Croatian (`hr`) if the requested locale has no entries.

## Design System

The entire visual language lives in `src/styles/global.css` as CSS custom properties on `:root`. No CSS-in-JS, no utility framework — component classes are defined once and composed in markup.

### Token Categories

| Category | Key Tokens |
|---|---|
| Colors (palette) | `--color-azure`, `--color-navy`, `--color-stone`, `--color-cream`, `--color-sand`, `--color-terracotta`, `--color-olive` |
| Colors (semantic) | `--color-text`, `--color-text-heading`, `--color-text-light`, `--color-text-muted`, `--color-bg`, `--color-bg-alt`, `--color-bg-dark`, `--color-accent`, `--color-border` |
| Typography (scale) | `--font-size-xs` (11px) through `--font-size-5xl` (60px) plus `--font-size-display` (`clamp(3rem, 7vw, 6rem)`) |
| Typography (faces) | `--font-serif` (DM Serif Display → Playfair Display → Georgia), `--font-sans` (Inter → system stack) |
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
| `.section-divider` | Wavy SVG divider — 200px wide, 20px tall, rendered via CSS `mask-image` over a `currentColor` background; replaces the former 120px × 1px rule |
| `.wave-separator` | Full-width SVG wave between sections — 60px tall container with an absolutely positioned inline SVG child; used in pairs (normal + `.wave-sep--flip`) to create a wave-in / wave-out effect |
| `.wave-divider` | Styles produced by `src/components/ui/WaveDivider.astro` — full-width block, `line-height: 0`, `overflow: hidden`; child SVG fills 100% width at `clamp(40px, 6vw, 80px)` height; `.wave-divider--flip` applies `scaleY(-1)` for the wave-out direction |
| `.img-organic` | Image wrapper with alternating corner radii (`20px 4px 20px 4px`) for an organic, hand-cut feel; child `<img>` fills 100% with `object-fit: cover` |
| `.img-blob` | Image wrapper with a CSS blob radius (`30% 70% 70% 30% / 30% 30% 70% 70%`) for fluid, asymmetric masking |
| `.img-padded` | Image wrapper with `--space-md` padding; child `<img>` gets `border-radius: 16px` and `--shadow-lg` |
| `.animate-breathe` | Applies the `breathe` keyframe — subtle 1.02× scale pulse over 6 s, infinite |
| `.animate-float` | Applies the `float` keyframe — 8px vertical translation over 5 s, infinite |
| `.gradient-warm` | Section background — 135° diagonal from terracotta-tinted to azure-tinted at 5% opacity each |
| `.gradient-azure` | Section background — top-to-transparent azure wash at 3% opacity |
| `.gradient-sunset` | Section background — cream → sand → cream horizontal sweep |
| `.image-hover-zoom` | Wrapper that scales the child `<img>` to 1.05× on hover with a slow ease — used on apartment cards and gallery items |
| `.hero-simple` | Interior page hero section — `min-height: 280px`, flexbox-centered, `overflow: hidden`; padding accounts for nav height |
| `.hero-simple__img` | Absolutely-positioned full-bleed photo inside `.hero-simple`; `object-fit: cover`; drives the `heroSimpleZoom` animation (20 s, scale 1→1.06, ease-in-out infinite alternate) |
| `.hero-simple__bg` | Fallback background when no image prop is passed — navy radial-gradient from azure at top to dark navy |
| `.hero-simple__overlay` | Dark navy gradient overlay (`z-index: 1`) that dims the photo for legible white text; always rendered when an image is present |
| `.hero-simple__wave` | Inline SVG wave pinned to `bottom: -1px` at `z-index: 3`; height `clamp(40px, 6vw, 80px)`; cream fill (`#F8F5EF`) blends the hero into the page background |
| `.hero-simple__subtitle` | Small-caps uppercase subtitle rendered beneath the `<h1>` — `--font-size-sm`, wide tracking, 50% white opacity |

### Homepage Photo Patterns

These layout components are defined as scoped styles in `src/pages/[locale]/index.astro`. They use organic rounded corners (not flat edge-to-edge) and uniform aspect ratios per pattern.

| Class | Pattern | Key rules |
|---|---|---|
| `.photo-strip` | Horizontal strip of three images at uniform 3:2 aspect ratio with rounded corners | `display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md)`; each `.photo-strip__item` has `border-radius: 16px` (desktop 20px) and `overflow: hidden` |
| `.full-bleed-image` | Single image at 21:9 aspect with a gradient overlay and centered text | `aspect-ratio: 21/9`; child `.full-bleed-image__text` is absolute-positioned |
| `.duo-image` | Two images side by side at uniform 3:4 aspect, using `.img-organic` wrappers for curved corners | `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md)`; images wrapped in `.img-organic` which supplies alternating-corner radii |
| `.triptych` | Three-column grid at uniform 4:5 aspect with label overlays and rounded corners | `display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md)`; `.triptych__label` is absolute-positioned; items have `border-radius: 16px`; items are `<a>` elements linking to `/hrana`, `/aktivnosti`, and `/plaze` |
| `.split-section` | Two-column layout: text (`__left`) + content (`__right`) | 50/50 columns on desktop, stacked on mobile; `.split-section--reverse` swaps column order |
| `.tag-row` | Horizontal wrapping row of inline tag chips | `display: flex; flex-wrap: wrap; gap: var(--space-sm)` |
| `.tag` | Individual chip inside a `.tag-row` | `border: 1px solid var(--color-border)`, small padding, `--font-size-xs` |

### Shared Editorial Page Layout Classes

These classes are defined as `is:global` styles inside `hrana.astro` and reused by `aktivnosti.astro` and `plaze.astro` via the same pattern.

| Class | Purpose |
|---|---|
| `.page-hero` | Full-bleed hero at `60vh` / min `400px` — image `object-fit: cover` with a navy gradient overlay anchored to bottom; used on editorial detail pages |
| `.page-hero__overlay` | Absolute-positioned overlay container aligning content to bottom-left via flexbox |
| `.page-hero__intro` | Intro paragraph beneath the `<h1>` — `--font-size-lg`, `max-width: 600px`, 80% white opacity |
| `.content-row` | Two-column alternating layout: image (`1fr`) + text (`1fr`) on desktop, stacked on mobile; odd-indexed rows use `.content-row--reverse` to swap order |
| `.content-row__image` | Image wrapper with organic corner radii (`20px 4px 20px 4px`), overflow hidden, box shadow, 4:3 aspect ratio, hover zoom (1.03×) |
| `.content-row__text` | Text column with responsive heading (`clamp(1.5rem, 3vw, 2.5rem)`) |

### Page-Specific Layout Classes

These classes are defined as scoped styles inside individual page components. They are not shared across pages.

| Class | Page | Pattern |
|---|---|---|
| `.apartments-grid` | `apartmani/index.astro` | Two-column card grid (1 col mobile, 2 col ≥768px); gap `--space-2xl` |
| `.apartment-card-link` | `apartmani/index.astro` | Full-card anchor wrapping image + content; `text-decoration: none` |
| `.apartment-card__image` | `apartmani/index.astro` | Image at 3:2 aspect ratio with hover scale (1.03×); badge overlay top-left |
| `.apartment-card__badge` | `apartmani/index.astro` | Navy pill showing `best_for` value |
| `.apartment-card__footer` | `apartmani/index.astro` | Row: serif price left, inquiry `.btn` right; top border separator |
| `.apt-hero` | `apartmani/[slug].astro` | Full-width hero at 60vh / min 400px; image cover + navy gradient overlay anchored to bottom |
| `.apt-detail` | `apartmani/[slug].astro` | Two-column grid: main content (`1.5fr`) + sidebar (`1fr`); stacks on mobile |
| `.apt-meta` | `apartmani/[slug].astro` | 2×2 stone-background grid of key stats (sleeps, bedrooms, size, beach distance) |
| `.apt-price-card` | `apartmani/[slug].astro` | White card with shadow: price label + serif amount + inquiry CTA button |
| `.apt-amenities` | `apartmani/[slug].astro` | Stone-background card; amenity list in 2-column grid with checkmark pseudo-elements |
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
