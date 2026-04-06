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

Each page is emitted once per locale, producing 48 `<url>` entries (12 pages × 4 locales).

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

### Future: apartment URLs

Individual apartment detail pages (`/apartmani/:slug`) are not yet included in the sitemap. They should be added once dynamic slug generation from D1/Emdash is implemented.

---

## Robots.txt

Served at `/robots.txt` by `src/pages/robots.txt.ts`. All crawlers are allowed on public pages. The following paths are disallowed:

| Disallowed path | Reason |
|---|---|
| `/admin/` | Owner admin panel — not indexable |
| `/_emdash/` | CMS interface — not indexable |
| `/media/` | Stale — route removed. Images are now served via `/api/img/:key`. Disallow retained to prevent crawling of any cached/legacy URLs. |
| `/api/` | JSON API endpoints — no indexable content |

The `Sitemap:` directive in robots.txt points to `/sitemap.xml` using the request origin, so it works correctly across staging and production domains.

**Cache:** `public, max-age=86400` — refreshes once per day.

---

## Open Graph Tags

Every page emits Open Graph meta tags via `src/layouts/Base.astro`. The tags are standard `og:title`, `og:description`, `og:type`, `og:url`, and `og:image`.

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

### Gallery alt text

Gallery items in `src/pages/[locale]/galerija.astro` use 50 rotating poetic Croatian captions (e.g. "more šuti, a govori sve", "lavanda i sol") assigned by rotating index (`i % captions.length`). Alt text is intentionally evocative rather than descriptive — the images are decorative in an auto-scrolling context and the captions reinforce the editorial voice. They are not localized (Croatian only). The gallery uses 137 distinct island photos shuffled deterministically per locale.

---

## Structured Data

Schema.org JSON-LD is injected via `src/components/seo/SchemaOrg.astro`. The component accepts a `type` and a `data` object and emits a single `<script type="application/ld+json">` tag. `<` characters in serialized JSON are escaped as `\u003c` to prevent XSS.

### Builder layer

`src/lib/schema.ts` provides two pure builder functions that construct the JSON-LD objects consumed by `SchemaOrg.astro`:

| Function | Output type | Used on |
|---|---|---|
| `buildVacationRentalSchema(apartment, locale)` | `VacationRental` | Apartment detail pages |
| `buildBreadcrumbSchema(items)` | `BreadcrumbList` | Apartment detail pages |

`buildVacationRentalSchema` accepts an `ApartmentData` object (`name`, `description`, `image`, `sleeps`, `bedrooms`, `bathrooms`, `size`, `priceFrom`, `amenities`) and a locale string, and returns a Schema.org `VacationRental` object with a hardcoded `PostalAddress` for Ždrelac, Zadar County, HR.

`buildBreadcrumbSchema` accepts an array of `{ label, href? }` items and returns a `BreadcrumbList`. Items without `href` are emitted without an `item` property — the convention for the current (last) page in a trail.

### Supported schema types

| Type | Builder | Used on | Purpose |
|---|---|---|---|
| `LodgingBusiness` | Inline in `index.astro` | `/:locale/` | Business identity for Google Knowledge Panel — name, address (Fratarsko 5, Ždrelac), geo coordinates, amenity features |
| `FAQPage` | Inline in `faq.astro` | `/:locale/faq` | Enables FAQ rich results in Google Search |
| `VacationRental` | `buildVacationRentalSchema` | Apartment detail pages | Enables rental rich results |
| `BreadcrumbList` | `buildBreadcrumbSchema` | Apartment detail pages | Breadcrumb trail in search results |

### FAQPage markup

The FAQ page (`src/pages/[locale]/faq.astro`) loads entries from the `faqs` Emdash collection via `getLocalizedCollection` and builds a `mainEntity` array passed to `<SchemaOrg type="FAQPage" />`. Each entry maps to a `Question` / `Answer` pair. When the CMS has no entries for a locale, a hardcoded fallback of 8 questions per locale is used (same topics: check-in/lockbox, car needed, pets, AC/Wi-Fi/parking, groceries, beaches, house rules).

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
