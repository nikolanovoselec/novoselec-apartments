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
| `/zdrelac` | Ždrelac village |
| `/galerija` | Gallery |
| `/zasto-pasman` | Why Pašman (editorial) |
| `/dolazak` | Getting Here (ferry, airport, maps) |
| `/vodic` | Local Guide (beaches, food, activities) |
| `/o-nama` | About Us |
| `/faq` | FAQ |
| `/privatnost` | Privacy Policy |
| `/impressum` | Legal notice |
| `/pristupacnost` | Accessibility statement |

Each page is emitted once per locale, producing 48 `<url>` entries (12 pages × 4 locales).

The following pages exist as routes but are not yet registered in `sitemap.xml.ts`:

| Slug | Status |
|---|---|
| `/hrana` | Route exists, not in sitemap |
| `/aktivnosti` | Route exists, not in sitemap |
| `/plaze` | Route exists, not in sitemap |
| `/kontakt` | Route exists, not in sitemap |

Add these slugs to the `pages` array in `src/pages/sitemap.xml.ts` to include them.

### hreflang alternates

Every `<url>` entry contains `xhtml:link rel="alternate"` elements for all four locales plus an `x-default` pointing to the Croatian (`hr`) variant. This tells Google which URL to serve for each language/region combination and prevents duplicate content penalties across locales.

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
| `/media/` | Raw R2 asset URLs — canonical images are served via apartment pages |
| `/api/` | JSON API endpoints — no indexable content |

The `Sitemap:` directive in robots.txt points to `/sitemap.xml` using the request origin, so it works correctly across staging and production domains.

**Cache:** `public, max-age=86400` — refreshes once per day.

---

## Structured Data

Schema.org JSON-LD is injected via `src/components/seo/SchemaOrg.astro`. The component accepts a `type` and a `data` object and emits a single `<script type="application/ld+json">` tag. `<` characters in serialized JSON are escaped as `\u003c` to prevent XSS.

### Supported schema types

| Type | Used on | Purpose |
|---|---|---|
| `FAQPage` | `/:locale/faq` | Enables FAQ rich results in Google Search |
| `VacationRental` | Apartment detail pages | Enables rental rich results |
| `BreadcrumbList` | Apartment detail pages | Breadcrumb trail in search results |

### FAQPage markup

The FAQ page (`src/pages/[locale]/faq.astro`) builds a `mainEntity` array from the preloaded FAQ entries and passes it to `<SchemaOrg type="FAQPage" />`. Each entry maps to a `Question` / `Answer` pair. FAQ content is currently static; when loaded from Emdash CMS the schema will be generated from the same data.

---

## Editorial Pages and SEO

The Phase 6 editorial pages exist primarily to capture long-tail search intent and support internal linking. Each page is a single Astro route under `src/pages/[locale]/` that renders inline-translated content for all four locales at build time.

| Page | Primary intent |
|---|---|
| `/zasto-pasman` | "Warum Pašman", "why Pašman island" — destination awareness |
| `/dolazak` | "Fähre Pašman", "how to get to Pašman" — practical planning |
| `/faq` | Common pre-booking questions — FAQ rich results |
| `/o-nama` | Brand trust, host story |
| `/vodic` | Local guide overview — links to detail pages |
| `/hrana` | "Restaurants Pašman", "where to eat Pašman" — dining intent; linked from homepage triptych |
| `/aktivnosti` | "Things to do Pašman", "Kornati tour", "kayaking Pašman" — activity intent; linked from homepage triptych |
| `/plaze` | "Beaches Pašman", "Pašman swimming", "coves Ugljan" — beach intent; linked from homepage triptych |
| `/kontakt` | Contact page — inquiry form entry point; all site-wide CTAs link here |
| `/privatnost` | GDPR legal requirement |
| `/impressum` | German legal requirement (Impressumspflicht) |

All editorial pages use the `hero-simple` pattern (navy header), `data-reveal` scroll animations, and the shared `Page` layout which injects the canonical tag and `<html lang>` attribute.

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
