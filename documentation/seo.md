# SEO

Keyword targets, structured data, multilingual sitemap, and crawl policy for Apartmani Pašman.

**Audience:** Developers, Operators

---

## Overview

The site targets German, Croatian, Slovenian, and English-speaking travellers searching for holiday apartments on Pašman island. All four locales use the same URL structure with a locale prefix (`/hr/`, `/de/`, `/sl/`, `/en/`). The SEO infrastructure consists of a dynamic sitemap with `hreflang` alternates, a robots.txt that controls crawl scope, and Schema.org structured data on key pages.

---

## Multilingual Sitemap

The sitemap is served at `/sitemap.xml` and generated at request time by `src/pages/sitemap.xml.ts`.

### Included pages

| Slug | Description |
|---|---|
| `/` | Homepage |
| `/apartmani` | Apartment listing |
| `/galerija` | Gallery |
| `/hrana` | Food and restaurants guide |
| `/aktivnosti` | Activities guide |
| `/plaze` | Beaches guide |
| `/kontakt` | Contact and inquiry form |
| `/dolazak` | Getting Here (ferry, airport, maps) |
| `/vodic` | Local Guide |
| `/o-nama` | About Us |
| `/faq` | FAQ |
| `/privatnost` | Privacy Policy |
| `/impresum` | Legal Notice / Impressum |

Each static page is emitted once per locale (13 static pages × 4 locales = 52 entries), plus one entry per locale for each published apartment loaded dynamically from the CMS. Total entry count varies with the number of published apartments.

### hreflang alternates

Every `<url>` entry contains `xhtml:link rel="alternate"` elements for all four locales plus an `x-default` pointing to the Croatian (`hr`) variant. This tells Google which URL to serve for each language/region combination and prevents duplicate content penalties across locales.

In addition to the sitemap, every page `<head>` carries `<link rel="alternate" hreflang="...">` tags for runtime crawling. These are built by `buildHreflangLinks(pathname, siteOrigin)` in `src/lib/hreflang.ts`. The function accepts the current page pathname (e.g. `/hr/apartmani`), strips the locale prefix, and returns an array of `{ hreflang, href }` objects for all four locales plus `x-default` (always pointing to the `hr` variant). The array is consumed by the base layout's `<head>`.

```xml
<url>
  <loc>https://example.com/de/faq</loc>
  <xhtml:link rel="alternate" hreflang="hr" href="https://example.com/hr/faq" />
  <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/faq" />
  <xhtml:link rel="alternate" hreflang="sl" href="https://example.com/sl/faq" />
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/faq" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/hr/faq" />
</url>
```

**Cache:** `public, max-age=3600` — refreshes every hour at the edge.

### Apartment detail pages

Individual apartment detail pages (`/apartmani/:slug`) are included dynamically. At sitemap generation time, `getLocalizedCollection("apartments", defaultLocale)` fetches all published apartments from the CMS and appends `/apartmani/:slug` to the page list. Each slug is then emitted once per locale with full `hreflang` alternates.

No `<lastmod>` element is emitted. Google's own guidance discourages dynamic `<lastmod>` values (date changes every request) as they are treated as unreliable, so the field was omitted to avoid misleading signals.

---

## Robots.txt

Served at `/robots.txt` by `src/pages/robots.txt.ts`. All crawlers are allowed on public pages. The following paths are disallowed:

| Disallowed path | Reason |
|---|---|
| `/admin/` | Owner admin panel — not indexable |
| `/_emdash/` | CMS interface — not indexable |
| `/media/` | Stale — route removed. Images are now served via `/api/img/:key`. Disallow retained to prevent crawling of any cached/legacy URLs. |
| `/api/` | JSON API endpoints — no indexable content |

The `Sitemap:` directive points to `/sitemap.xml` using the request origin, so it works correctly across staging and production domains.

The `LLMs-Txt:` directive points to `/llms.txt`, a machine-readable site description following the [llmstxt.org](https://llmstxt.org/) convention. It tells AI assistants where to find a structured summary of the property and what content is available on the site.

**Cache:** `public, max-age=86400` — refreshes once per day.

---

## Open Graph Tags

Every page emits Open Graph and Twitter Card meta tags via `src/layouts/Base.astro`.

### Open Graph

| Tag | Value |
|---|---|
| `og:title` | Full page title (site name + page title) |
| `og:description` | Page meta description |
| `og:type` | `website` |
| `og:url` | Canonical URL |
| `og:image` | Per-page image or fallback (Ždrelac from the sea) |
| `og:site_name` | Locale-specific via `t(lang, "brand.name")`: hr "Apartmani Novoselec", de "Ferienwohnungen Novoselec", sl "Apartmaji Novoselec", en "Apartments Novoselec" |
| `og:locale` | Locale-mapped: `hr_HR`, `de_CH`, `sl_SI`, `en_US` |

### Twitter Card

Every page also emits Twitter Card tags derived from the same values:

| Tag | Value |
|---|---|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | Full page title |
| `twitter:description` | Page meta description |
| `twitter:image` | Per-page image or same fallback as `og:image` |

### ogImage prop

The `Page` layout and `Base` layout both accept an optional `ogImage` string (absolute URL). When provided it is written directly into `og:image`. When omitted the fallback is `{siteOrigin}/api/img/aa0fd53c-5d96-4a78-a5b5-0f68b543515a` (Ždrelac from the sea).

```astro
<Page title={...} locale={typedLocale} ogImage="https://apartmani.novoselec.ch/api/img/<uuid>">
```

### Per-page OG images

Each editorial page passes the same image used as its hero, ensuring the social preview matches what the user sees on arrival. All images are served from R2 via `/api/img/:uuid`.

| Page | Subject |
|---|---|
| `/aktivnosti` | Cyclist on island path (fixed UUID, not from CMS first section) |
| `/dolazak` | Marina harbour |
| `/faq` | Chapel front |
| `/hrana` | Beach at Ždrelac |
| `/kontakt` | Chapel pines |
| `/o-nama` | Golden pine trees |
| `/plaze` | Sandy beach |
| `/vodic` | Pine forest with child |
| All others (fallback) | Ždrelac from the sea |

UUIDs are managed in each page's `ogImage` prop in `src/pages/[locale]/`. The fallback UUID is set in `src/layouts/Base.astro`.

---

## Theme Color and Web App Manifest

### theme-color

Two `theme-color` meta tags are emitted in every `<head>` — one for each color scheme:

| Media query | Value | Usage |
|---|---|---|
| `(prefers-color-scheme: light)` | `#F8F5EF` (cream) | Browser chrome tint on mobile (address bar, tab strip) |
| `(prefers-color-scheme: dark)` | `#0A1F33` (navy) | Same, dark mode |

### Web App Manifest

`/site.webmanifest` (static file at `public/site.webmanifest`) enables "Add to Home Screen" on Android and provides home-screen metadata for browsers that support the Web App Manifest spec. This is not a PWA — there is no service worker, offline support, or push notifications.

| Field | Value |
|---|---|
| `name` | `Apartmani Novoselec` |
| `short_name` | `Apartmani` |
| `start_url` | `/hr/` |
| `display` | `standalone` |
| `theme_color` | `#F8F5EF` |
| `background_color` | `#F8F5EF` |
| `icons` | `android-chrome-192x192.png`, `android-chrome-512x512.png` |

The manifest is linked from every page via `<link rel="manifest" href="/site.webmanifest" />`.

### Apple Touch Icon

`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />` and `<meta name="apple-mobile-web-app-title" content="Apartmani" />` are present in every `<head>`. The PNG files (`apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`) were generated from `public/favicon.svg` and are committed in `public/`. All three are served with a 30-day cache via `public/_headers`.

---

## Gallery Alt Text

Gallery items in `src/pages/[locale]/galerija.astro` use 57 rotating captions per locale sourced from the `gallery_captions` CMS collection (228 total across 4 locales), assigned by rotating index (`i % captions.length`). Alt text is intentionally evocative rather than descriptive — the images are decorative in an auto-scrolling context and the captions reinforce the editorial voice. Captions are fully localized in all 4 locales (HR, DE, SL, EN). The gallery uses 142 distinct island photos shuffled deterministically per locale.

---

## Structured Data

Schema.org JSON-LD is injected via `src/components/seo/SchemaOrg.astro`. The component accepts a `type` and a `data` object and emits a single `<script type="application/ld+json">` tag. `<` characters in serialized JSON are escaped as `\u003c` to prevent XSS.

### Builder layer

`src/lib/schema.ts` provides two pure builder functions that construct the JSON-LD objects consumed by `SchemaOrg.astro`:

| Function | Output type | Used on |
|---|---|---|
| `buildVacationRentalSchema(apartment)` | `VacationRental` | Apartment detail pages |

`buildVacationRentalSchema` accepts an `ApartmentData` object (`name`, `description`, `image`, `sleeps`, `bedrooms`, `bathrooms`, `size`, `priceFrom`, `amenities`) and returns a Schema.org `VacationRental` object with a hardcoded `PostalAddress` for Ždrelac, Zadar County, HR.

Breadcrumb markup is built inline in `Breadcrumbs.astro` — there is no separate `buildBreadcrumbSchema` function.

### Supported schema types

| Type | Builder | Used on | Purpose |
|---|---|---|---|
| `LodgingBusiness` | Inline in `index.astro` | `/:locale/` | Business identity for Google Knowledge Panel — name from `t(locale, "brand.name")` (locale-specific), address (Fratarsko 5, Ždrelac), geo coordinates, amenity features |
| `FAQPage` | Inline in `faq.astro` | `/:locale/faq` | Enables FAQ rich results in Google Search |
| `VacationRental` | `buildVacationRentalSchema` | Apartment detail pages | Enables rental rich results |
| `BreadcrumbList` | Inline in `Breadcrumbs.astro` | Apartment detail pages | Breadcrumb trail in search results |

### FAQPage markup

The FAQ page (`src/pages/[locale]/faq.astro`) loads entries from the `faqs` Emdash collection via `getLocalizedCollection` and builds a `mainEntity` array passed to `<SchemaOrg type="FAQPage" />`. Each entry maps to a `Question` / `Answer` pair. When the CMS has no entries for a locale, a hardcoded fallback of 8 questions per locale is used (topics: directions/ferry routes, car needed, check-in/key safe, pets with prior notice, AC/Wi-Fi/parking, groceries and fresh fish, beaches, house rules). The fallback "getting there" answer contains an inline locale-aware HTML anchor (`<a href="/${locale}/dolazak">`) pointing to the Getting Here page. The answer strings are rendered into the accordion via `set:html` so the link is live in the browser. Before building the FAQPage JSON-LD, a `stripHtml` pass removes all tags from `acceptedAnswer.text` so the schema contains plain text only, which is what Google's rich result validator expects.

---

## Editorial Pages and SEO

The Phase 6 editorial pages exist primarily to capture long-tail search intent and support internal linking. Each page is a single Astro route under `src/pages/[locale]/` that renders inline-translated content for all four locales at build time.

| Page | Primary intent |
|---|---|
| `/dolazak` | "Fähre Pašman", "how to get to Pašman" — practical planning |
| `/faq` | Common pre-booking questions — FAQ rich results |
| `/o-nama` | Brand trust, host story |
| `/vodic` | Local guide overview — links to detail pages |
| `/hrana` | "Restaurants Pašman", "where to eat Pašman" — dining intent; linked from homepage triptych |
| `/aktivnosti` | "Things to do Pašman", "Kornati tour", "kayaking Pašman" — activity intent; linked from homepage triptych |
| `/plaze` | "Beaches Pašman", "Pašman swimming", "coves Ugljan" — beach intent; linked from homepage triptych |
| `/kontakt` | Contact page — inquiry form entry point; all site-wide CTAs link here |
| `/privatnost` | GDPR legal requirement |

All editorial pages use the `hero-simple` pattern (navy header) and the shared `Page` layout which injects the canonical tag and `<html lang>` attribute.

---

## Keyword Targets

Primary targets by locale:

| Locale | Primary keywords |
|---|---|
| `de` | Ferienwohnung Pašman, Appartement Pašman, Urlaub Pašman Kroatien |
| `hr` | Apartmani Pašman, smještaj Ždrelac, apartmani Ždrelac |
| `sl` | Apartmaji Pašman, počitnice Pašman, namestitev Pašman |
| `en` | Apartments Pašman, holiday rental Pašman, accommodation Pašman |

---

## Related Documentation

- [Architecture](architecture.md#public-page-routes) — Full list of public page routes
- [API Reference](api-reference.md#get-sitemapxml) — Sitemap and robots.txt endpoint specs
- [Decisions](decisions/README.md) — AD9: locale prefix on all routes including default
