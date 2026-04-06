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
| `src/lib/content.ts` | Emdash CMS helpers — `getLocalizedCollection`, `getLocalizedEntry`, `getSettings` with locale fallback to Croatian. `getLocalizedCollection` paginates through all Emdash pages (cursor-based, 100 entries per request) to guarantee the full dataset is returned regardless of collection size. |
| `src/lib/hreflang.ts` | `buildHreflangLinks(pathname, siteOrigin)` — builds `<link rel="alternate" hreflang>` objects for all four locales plus `x-default`; used in the `<head>` of every page |
| `src/lib/schema.ts` | Schema.org JSON-LD builders — `buildVacationRentalSchema(apartment, locale)` and `buildBreadcrumbSchema(items)`; consumed by apartment detail pages |
| `src/lib/sanitize.ts` | Input sanitization — HTML stripping, email header injection prevention |
| `src/schemas/inquiry.ts` | Zod schemas for booking and quick-question form submissions |
| `src/middleware/` | Request pipeline: redirects → locale → security headers |
| `src/pages/api/img/[key].ts` | Image serving route — fetches from R2 via Emdash storage or direct bucket access; applies `Cache-Control: public, max-age=31536000, immutable`; key is an extension-free UUID |
| `src/pages/admin/api/` | Auth API endpoints (login, verify, upload-url) |
| `src/pages/admin/api/inquiries/[id]/confirm.ts` | Confirm booking inquiry and block dates atomically |
| `src/pages/api/apartments/[id]/availability.ts` | Availability API — returns booked dates for calendar display |
| `src/pages/api/inquiry.ts` | Inquiry submission — full booking pipeline (validate, persist, email) |
| `src/pages/api/track.ts` | Analytics API — cookieless event logging to D1 |
| `src/layouts/` | Base and Page layout shells |
| `src/components/shell/` | Navigation (desktop nav + mobile hamburger menu with `is:inline` script to avoid Astro bundler stripping), Footer, LanguageSwitcher, WhatsAppButton, StickyMobileCTA |
| `src/components/shell/StickyMobileCTA.astro` | Fixed bottom bar visible on mobile/tablet (max-width 1023px) after the hero scrolls out of view. Slides up via `translateY` when `.is-visible` is toggled. Renders two text labels: primary span uses `cta.checkAvailability`, secondary span uses `homepage.cta.title`. No price display — `cta.fromPrice` was removed. CSS classes are `__primary` and `__secondary` (formerly `__price`/`__action`). Tapping navigates to `/{locale}/kontakt`. Visibility driven by a single `IntersectionObserver` on `.hero-sentinel`; bar shows when the sentinel is not intersecting, hides when it returns to view. |
| `src/components/home/Hero.astro` | Hero carousel — 7 island photos served from R2 via `/api/img/:uuid`, crossfade (1.8s CSS transition), continuous zoom animation (`heroZoom` keyframe: 12s ease-in-out infinite alternate, scale 1→1.1 with -1%/-1% translate, paused until slide is active), auto-advance every 6 s, dot navigation, hover-pause; implemented as `is:inline` script; all image keys are extension-free UUIDs |
| `src/components/home/ScrollCollage.astro` | Infinite-scroll exterior photo strip — accepts `images: Array<{ src: string; alt: string }>` and optional `speed` (default 35 s). Renders two copies of the image set side-by-side so CSS `translateX(-50%)` creates a seamless loop. Hover pauses animation. Respects `prefers-reduced-motion` by disabling the keyframe and falling back to an overflow-scrollable row. Photos are sourced from a CMS `editorial` entry with `section_key=collage` (body field = JSON array of `{src, alt}` objects). Emdash auto-parses any body value that begins with `[` or `{`, so `data.body` may arrive as an already-parsed array or as a string — `parseCollageBody` in `index.astro` handles both. Collage is hidden if the CMS entry is absent. |
| `src/components/ui/HeroSimple.astro` | Interior page hero — used on all non-homepage pages including apartment detail. Props: `title` (required), `subtitle` (optional, displayed as small-caps label), `image` (optional URL). When `image` is provided, the photo fills the hero with a slow 20 s zoom (`heroSimpleZoom` keyframe: scale 1→1.06, ease-in-out infinite alternate) and a dark navy gradient overlay. Without `image`, falls back to a static dark navy radial-gradient background. An inline SVG wave (cream `#F8F5EF`) is always rendered at the bottom of the section to merge visually with the page background. |
| `src/components/ui/WaveDivider.astro` | Full-width SVG wave divider between sections. Props: `fill` (wave color, default `#F8F5EF`), `flip` (boolean, flips vertically via `scaleY(-1)` for wave-out effect), `class`. Height is fluid: `clamp(40px, 6vw, 80px)`. Used on the homepage to bracket the dark navy section (wave-in / wave-out pair). Sections that receive a wave at their top edge (e.g., the sunset CTA section, the apartments dark section) use the `.section--wave-in` CSS utility class for positioning and extra top padding rather than inline style overrides. |
| `src/components/ui/MiniCollage.astro` | Compact infinite-scroll photo strip. Props: `images: Array<{ src: string; alt: string }>` (required), `speed` (animation duration in seconds, default 20), `reverse` (boolean, default `false` — when `true`, applies `.mini-collage--reverse` which sets `animation-direction: reverse` so the strip scrolls right instead of left), `showCaptions` (boolean, default `false` — when `true`, renders each photo's alt text as an absolute-positioned overlay at the bottom of the photo: sans-serif normal-weight text (`--font-sans`, `font-weight: 400`, `letter-spacing: 0.02em`) at 90% opacity over a bottom-to-top gradient `rgba(0,0,0,0.45)` to transparent; `pointer-events: none`). Renders a WCAG carousel region. Hover pauses animation. Strips with fewer than 2 images fall back to a static single image. Used on apartment detail pages (interior photos), the Food & Drink page (dual opposing strips), and the gallery page (with `showCaptions` enabled). |
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
| `/:locale/` | `src/pages/[locale]/index.astro` | Homepage — emits a `LodgingBusiness` Schema.org JSON-LD block inline (address: Fratarsko 5, Ždrelac; geo: 44.010669, 15.285480; amenities: Wi-Fi, Parking, Air conditioning, BBQ) |
| `/:locale/apartmani` | `src/pages/[locale]/apartmani/index.astro` | Apartment listing — card grid (2 columns desktop, 1 mobile); CMS-only; each card links to detail page. Below the grid, a `ScrollCollage` strip renders exterior photos sourced from the same `editorial` CMS entry (`page_key=homepage`, `section_key=collage`) used on the homepage; hidden when the CMS entry is absent. |
| `/:locale/apartmani/:slug` | `src/pages/[locale]/apartmani/[slug].astro` | Apartment detail — `HeroSimple` (title + tagline + hero image), breadcrumbs, interior photo strip (`MiniCollage` at speed 25, sourced from `gallery` CMS field, wrapped in `.editorial-strip`), description, meta grid (sleeps/bedrooms/size/beach distance), price card, amenity list; fetches entry directly by slug via `getEmDashEntry("apartments", slug)` with no locale filtering (locale is applied in rendering, not in lookup); redirects to listing on missing slug |
| `/:locale/galerija` | `src/pages/[locale]/galerija.astro` | Gallery — 137 island photos served as alternating infinite-scroll `MiniCollage` strips (14 strips: 13 of 10 + 1 of 7); strips alternate direction (`reverse` prop); `showCaptions` enabled on all strips so poetic Croatian captions render as visible overlay text over each photo (and also serve as alt text); photos shuffled deterministically by locale seed; `HeroSimple` with intro text; linked from main nav |
| `/:locale/dolazak` | `src/pages/[locale]/dolazak.astro` | Getting Here — CMS-only: queries dedicated `dolazak` collection, sorted by `sort_order`; each entry maps to one alternating content-row section via `title`, `body`, and `image` fields; a hardcoded "Naša adresa" dark section (`section--dark`) with the address (`Fratarsko 3, 23271 Ždrelac, Croatia`) and Google Maps / Apple Maps deep-link buttons is always rendered below the CMS sections; the dark section has an inline SVG wave at the top (`position: absolute; top: 0`, `fill: var(--color-bg)`, `scaleY(-1)`) to transition from the page background, and uses the `.section--wave-in` CSS utility class for positioning and extra top padding; renders no content rows if CMS entries absent |
| `/:locale/faq` | `src/pages/[locale]/faq.astro` | FAQ — accordion with Schema.org FAQPage markup (not in main nav) |
| `/:locale/o-nama` | `src/pages/[locale]/o-nama.astro` | About Us — CMS-only: queries dedicated `about` collection; renders `body` of first entry as host story; renders empty if CMS entry absent |
| `/:locale/vodic` | `src/pages/[locale]/vodic.astro` | Local Guide — queries dedicated `vodic` collection (sorted by `sort_order`); rendered as a responsive card grid (1 col mobile, 2 col ≥640px, 3 col ≥1024px) where each card is a 4:3 image with a text overlay and hover zoom; localized in all 4 locales; first 4 sections are the former Ždrelac village content (merged in Revision 70); includes a Zadar section |
| `/:locale/hrana` | `src/pages/[locale]/hrana.astro` | Food & Drink — CMS-only: queries the first entry of the `hrana` collection for the current locale; page-hero + single description section with two `MiniCollage` strips stacked below it; gallery photos are split at the midpoint — the first half scrolls left (default), the second half scrolls right (`reverse` prop); strips are hidden when fewer than 2 photos are available; localized in all 4 locales; linked from homepage triptych |
| `/:locale/aktivnosti` | `src/pages/[locale]/aktivnosti.astro` | Nature & Activities — CMS-only: queries dedicated `aktivnosti` collection, sorted by `sort_order`; renders no content rows if CMS entries absent; image column is conditional (only rendered when `image` field is non-empty); page-hero + alternating content-row layout; localized in all 4 locales; linked from homepage triptych |
| `/:locale/plaze` | `src/pages/[locale]/plaze.astro` | Beaches — CMS-only: queries dedicated `plaze` collection, sorted by `sort_order`; renders no content rows if CMS entries absent; image column is conditional (only rendered when `image` field is non-empty); page-hero + alternating content-row layout; localized in all 4 locales; linked from homepage triptych |
| `/:locale/kontakt` | `src/pages/[locale]/kontakt.astro` | Contact — standalone inquiry form with Turnstile CAPTCHA, honeypot, and GDPR consent checkbox; submits as `type: "question"` to `POST /api/inquiry`; all CTA links across the site point here |
| `/:locale/privatnost` | `src/pages/[locale]/privatnost.astro` | Privacy Policy (GDPR) — CMS-controlled body (page_key `"privacy"`); fallback includes processor list (Cloudflare D1/R2/Turnstile, Resend); linked from the GDPR consent checkbox on the contact form |
| `/404` | `src/pages/404.astro` | Custom 404 — locale-aware (detects locale from URL prefix, falls back to `hr`); full-bleed sunset photo background served from R2 via `/api/img/:uuid`, localized title + flavour text, three nav links (homepage, apartments, contact) |

`/:locale` is one of `hr`, `de`, `sl`, `en`.

## Media Pipeline

All photos — editorial, hero, apartment interior, and gallery — are stored in the `apartmani-media` R2 bucket and served via `/api/img/:key`. There is no `public/photos/` directory; no photos are committed to the repository.

### Image serving route

`src/pages/api/img/[key].ts` handles `GET /api/img/:uuid` requests. The key is an extension-free UUID. The route first attempts retrieval via `locals.emdash.storage.download(key)` (the Emdash storage abstraction over the same R2 bucket). On failure it falls back to direct `env.MEDIA` bucket access. Both paths return `Cache-Control: public, max-age=31536000, immutable`.

Key validation rejects empty keys, path traversal sequences (`..`), and leading slashes.

All image keys across the codebase — hero carousel, editorial D1 entries, gallery JSON fields, and CMS references — use the UUID format exclusively. No descriptive slug keys exist in source code or production data. See [AD15](decisions/README.md#ad15-all-r2-image-keys-standardized-to-uuid-format) for the standardization decision.

### Owner uploads

Direct browser-to-R2 uploads use presigned PUT URLs generated by `POST /admin/api/upload-url` via `aws4fetch` signed with R2 S3-compatible credentials. The returned `key` is a `UUID.ext` string; callers strip the extension when constructing `/api/img/:uuid` URLs. See [AD12](decisions/README.md#ad12-all-photos-migrated-to-r2-served-via-apiimguuid) for the migration decision.

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

The live D1 database is the source of truth for all CMS content. The `seed/seed.json` file and its `/api/admin/seed` endpoint have been removed; content is managed directly via the Emdash admin panel and via SQL migration scripts in `sql/`. The collections below reflect the current live data structure.

### Collections

| Collection slug | Entries | Description |
|---|---|---|
| `apartments` | 2 | Apartment detail pages per locale — slugs `lavanda-{locale}` and `tramuntana-{locale}`. **Lavanda** = ground floor apartment (owner: Nikola). **Tramuntana** = upper floor apartment (owner: Marko). Structured fields: capacity, bedrooms, amenities, bed config, distances, per-locale name/description/SEO. Gallery managed via `gallery_json` field (JSON array of `/api/img/uuid` paths). |
| `testimonials` | 6 | Guest testimonials linked to apartments — `guest_name`, `country`, `rating`, `quote`, `apartment_id`, `is_featured`. |
| `faq` | ~32 (8 × 4 locales) | FAQ entries in all 4 locales — `locale`, `question`, `answer`, `category`, `sort_order`. Topics: getting there, car needed, check-in (PIN/lockbox, no reception), pets, AC/Wi-Fi/parking, groceries and fish, beaches (sand vs pebble), house rules. Hardcoded fallback in `faq.astro` mirrors these 8 questions per locale. |
| `site-settings` | — | Property name, WhatsApp number, phone, email, active locales, hero photos, social links, section visibility toggles, check-in/out times, tourist tax rate. |
| `editorial` | — | Homepage section overrides per locale. Known section keys: `why-pasman` (title + body text), `zdrelac` (village feature card on homepage), `apartments` (dark section heading), `cta` (call-to-action heading), `collage` (exterior photo strip — `body` is a JSON array of `{"src": "/api/img/uuid", "alt": "..."}` objects consumed by `ScrollCollage`). The `collage` entry is locale-independent; absent entry hides the strip. Editorial pages each use their own dedicated collection (see below) — `editorial` no longer has per-page content rows. |
| `vodic` | ~32 (8 × 4 locales) | Local Guide page content. First 4 sections are former Ždrelac village content (merged in Revision 70); later sections include food, activities, beaches, and a Zadar section. Each entry: `sort_order`, `locale`, `title`, `body`, `image` (UUID path), `gallery` (JSON array of `{src, alt}`). |
| `hrana` | ~4 (1 × 4 locales) | Food & Drink page — single entry per locale. Fields: `locale`, `title`, `body` (description text), `gallery` (JSON array of `{src, alt}` photo objects split into two MiniCollage strips). No `sort_order` — only the first entry per locale is used. |
| `aktivnosti` | ~8 (2 × 4 locales) | Nature & Activities page content rows — 2 sections (Land + Sea). Each entry: `sort_order`, `locale`, `title`, `body`, `image`, `gallery`. |
| `plaze` | ~16 (4 × 4 locales) | Beaches page content rows. Each entry: `sort_order`, `locale`, `title`, `body`, `image`, `gallery`. |
| `dolazak` | ~12 (3 × 4 locales) | Getting Here page content rows. Each entry: `sort_order`, `locale`, `title`, `body`, `image`, `gallery`. |
| `about` | ~4 (1 × 4 locales) | About Us page — single entry per locale; `body` field is the host story. |

Dead collections removed in Revision 70: `guide`, `posts`, `pages`, `homepage`. All content pages are CMS-only with no hardcoded fallback — pages render empty content until matching entries are seeded in their dedicated collection.

All content is loaded at runtime via `src/lib/content.ts` helpers (`getLocalizedCollection`, `getLocalizedEntry`), which filter entries by locale and fall back to Croatian (`hr`) if the requested locale has no entries. `getLocalizedCollection` exhausts cursor-based pagination before filtering, so all entries in a collection are always considered regardless of how many pages Emdash returns.

## Design System

The entire visual language lives in `src/styles/global.css` as CSS custom properties on `:root`. No CSS-in-JS, no utility framework — component classes are defined once and composed in markup.

### Token Categories

| Category | Key Tokens |
|---|---|
| Colors (palette) | `--color-azure`, `--color-navy`, `--color-stone`, `--color-cream`, `--color-sand`, `--color-terracotta`, `--color-olive` |
| Colors (semantic) | `--color-text`, `--color-text-heading`, `--color-text-light`, `--color-text-muted`, `--color-bg`, `--color-bg-alt`, `--color-bg-dark`, `--color-accent`, `--color-border` |
| Typography (scale) | `--font-size-xs` (11px) through `--font-size-5xl` (60px) plus `--font-size-display` (`clamp(3rem, 7vw, 6rem)`) |
| Typography (faces) | `--font-serif` (DM Serif Display → Playfair Display → Georgia), `--font-sans` (Inter → system stack) |
| Spacing | `--space-xs` through `--space-4xl`; `--space-section` (`clamp(2.5rem, 6vw, 5rem)`) for section vertical rhythm |
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
| `.section--wave-in` | Applied to sections that have an incoming wave SVG at the top; adds extra top padding (`--space-section + clamp(50px, 8vw, 100px)`) and `margin-top: -2px` to prevent seam gaps; replaces per-section inline padding overrides |
| `.section--footer-clear` | Applied to the last section on pages where content sits close to the footer wave (`/`, `/apartmani`, `/dolazak`, `/kontakt`, `/o-nama`); adds extra bottom padding (`--space-section + clamp(50px, 8vw, 100px)`) to prevent the footer wave overlay from obscuring content |
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
| `.gradient-warm` | Section background — 135° diagonal from terracotta-tinted to azure-tinted at 5% opacity each. Used for editorial sections. |
| `.gradient-azure` | Section background — top-to-transparent azure wash at 3% opacity |
| `.gradient-sunset` | Section background — cream → sand → cream horizontal sweep |
| `.image-hover-zoom` | Wrapper that scales the child `<img>` to 1.05× on hover with a slow ease — used on apartment cards and gallery items |
| `.hero-simple` | Interior page hero section — `min-height: 50vh`, flexbox-centered, `overflow: hidden`; padding accounts for nav height |
| `.hero-simple__img` | Absolutely-positioned full-bleed photo inside `.hero-simple`; `object-fit: cover`; drives the `heroSimpleZoom` animation (20 s, scale 1→1.06, ease-in-out infinite alternate) |
| `.hero-simple__bg` | Fallback background when no image prop is passed — navy radial-gradient from azure at top to dark navy |
| `.hero-simple__overlay` | Dark navy gradient overlay (`z-index: 1`) that dims the photo for legible white text; always rendered when an image is present |
| `.hero-simple__wave` | Inline SVG wave pinned to `bottom: -1px` at `z-index: 3`; height `clamp(40px, 6vw, 80px)`; cream fill (`#F8F5EF`) blends the hero into the page background |
| `.hero-simple__subtitle` | Small-caps uppercase subtitle rendered beneath the `<h1>` — `--font-size-sm`, wide tracking, 50% white opacity |

### ScrollCollage CSS Classes

Scoped styles inside `src/components/home/ScrollCollage.astro`.

| Class | Purpose |
|---|---|
| `.scroll-collage` | Overflow-hidden outer container; `padding: var(--space-xl) 0`; full-width |
| `.scroll-collage__track` | Flex row of all items (original set + duplicate); `width: max-content`; drives `scroll-collage` keyframe (`translateX(0)` → `translateX(-50%)`, linear infinite); animation duration set via inline `style` prop |
| `.scroll-collage__item` | Individual photo tile; `flex-shrink: 0`; `border-radius: 16px`; `overflow: hidden` |
| `.scroll-collage__item img` | Fixed height (250 px mobile / 350 px ≥768 px), `width: auto`, `object-fit: cover` |

Hover on `.scroll-collage` pauses the animation via `animation-play-state: paused`. Under `prefers-reduced-motion`, the keyframe is removed and the container becomes a horizontally scrollable row with `scrollbar-width: none`.

### Homepage Photo Patterns

These layout components are defined as scoped styles in `src/pages/[locale]/index.astro`. They use organic rounded corners (not flat edge-to-edge) and uniform aspect ratios per pattern.

| Class | Pattern | Key rules |
|---|---|---|
| `.photo-strip` | Horizontal strip of three images at uniform 3:2 aspect ratio with rounded corners | `display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md)`; each `.photo-strip__item` has `border-radius: 16px` (desktop 20px) and `overflow: hidden` |
| `.full-bleed-image` | Single image at 21:9 aspect with a gradient overlay and centered text | `aspect-ratio: 21/9`; child `.full-bleed-image__text` is absolute-positioned |
| `.triptych` | Three-card grid at uniform 4:5 aspect with label overlays and rounded corners | `display: grid; grid-template-columns: repeat(2, 1fr)` on mobile, `repeat(3, 1fr)` from 768 px; `gap: var(--space-md)`; `.triptych__label` is absolute-positioned; items have `border-radius: 16px`; items are `<a>` elements linking to `/hrana`, `/aktivnosti`, and `/plaze` |
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
| `.editorial-strip` | `apartmani/[slug].astro`, `hrana.astro` | Wrapper around `MiniCollage` for photo strips; used on apartment detail pages and the Food & Drink page |
| `.apt-detail` | `apartmani/[slug].astro` | Two-column grid: main content (`1.5fr`) + sidebar (`1fr`); stacks on mobile |
| `.apt-meta` | `apartmani/[slug].astro` | 2×2 stone-background grid of key stats (sleeps, bedrooms, size, beach distance) |
| `.apt-price-card` | `apartmani/[slug].astro` | White card with shadow: price label + serif amount + inquiry CTA button |
| `.apt-amenities` | `apartmani/[slug].astro` | Stone-background card; amenity list in 2-column grid with checkmark pseudo-elements |
| `.guide-cards` | `vodic.astro` | CSS grid of card tiles — 1 column mobile, 2 columns ≥640px, 3 columns ≥1024px; gap `--space-md` |
| `.guide-card` | `vodic.astro` | Individual card — `position: relative`, 4:3 aspect ratio, `border-radius: 16px`, overflow hidden; child `<img>` scales to 1.06× on hover over 0.6 s |
| `.card-overlay` | `vodic.astro` | Absolute overlay pinned to card bottom; holds `.card-overlay__label` (entry title) and `.card-overlay__title` (entry description text) |

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
