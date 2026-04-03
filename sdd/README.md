# Apartmani Pašman — Product Specification

## Vision

A vacation rental website for apartments on Pašman island, Croatia. The site is a visual love letter to the Adriatic — full-bleed photography, Mediterranean color palette (sea blues, warm stone, olive greens, terracotta), smooth scroll animations, and effortless coastal elegance. Visitors browse apartments, swipe through photo galleries, check availability, and submit booking inquiries (spam-protected with Cloudflare Turnstile, delivered via Resend). The owner gets a simple admin dashboard (Emdash CMS) to manage apartment listings, update descriptions, upload photos, toggle sections, and manage translations — all from her phone. The site ships fully preloaded with real Pašman content in four languages and curated stock photography, ready to go live on day one. Deployed as a single Cloudflare Worker.

## Actors

| Actor | Description |
|-------|-------------|
| **Visitor** | Potential guest browsing the site. Could be Croatian, German, Slovenian, or English-speaking. Wants to see photos, check availability, compare apartments, and submit a booking inquiry. |
| **Owner** | The property owner. Manages apartments, uploads photos from her phone, updates prices and availability, reads inquiry emails, toggles site sections and languages. Logs in via Cloudflare Access (zero-trust). Zero technical knowledge. |
| **System** | Cloudflare Workers + Astro 6 + Emdash CMS + D1 + R2 + Turnstile + Resend. Handles content delivery, form processing, email delivery, image optimization, and edge caching. |

## Design Principles

1. **Photo-first, always.** The site lives or dies by its imagery. Every layout decision serves the photographs. Phone-quality photos must look stunning through smart optimization, generous whitespace, and editorial framing.
2. **Croatian, not generic Mediterranean.** Stone textures, not marble. Olive branches, not palm trees. Dalmatian dry-stone wall geometry. The Pašman channel and Galešnjak as visual anchors. No cliche anchors or seashells.
3. **Calm is luxury.** Maximum 2-3 "wow" animation moments per page. White space does the heavy lifting. Restraint over spectacle. The site should feel like a slow exhale.
4. **Mother-proof CMS.** If it takes more than 2-3 taps to do something on a phone, redesign it. The owner never touches code, never sees a terminal, never struggles.
5. **German precision, Croatian warmth.** German visitors get exact distances, detailed specs. Croatian/Slovenian content is warmer and more familiar. English is universal clarity. Translation is cultural adaptation, not word-for-word.
6. **Every page converts.** No dead-end pages. Every scroll position has a path to the inquiry form or WhatsApp. But never aggressive — luxury whispers.
7. **Performance is invisible luxury.** Sub-2-second loads. Blurhash-to-sharp image transitions. No layout shift. Smoothness IS the premium signal.
8. **Ship complete, personalize later.** The site arrives fully preloaded with real Pašman content, stock photography, and all four languages. The owner replaces and edits — she never builds from scratch.

## Domains

| # | Domain | File | Priority | Description |
|---|--------|------|----------|-------------|
| 1 | Storefront | [storefront.md](storefront.md) | P0 | Homepage, hero, navigation, footer, language switcher, "Why Pašman" |
| 2 | Apartments | [apartments.md](apartments.md) | P0 | Listings, detail pages, galleries, amenities, pricing, availability |
| 3 | Booking | [booking.md](booking.md) | P0 | Request-to-book, inquiry pipeline, WhatsApp, trust signals |
| 4 | i18n | [i18n.md](i18n.md) | P0 | 4-locale routing, owner-activated languages, content localization |
| 5 | Editorial | [editorial.md](editorial.md) | P1 | Why Pašman, Getting Here, A Day on Pašman, local guide, host story, FAQ |
| 6 | Social Proof | [social-proof.md](social-proof.md) | P1 | Guest testimonials, trust strip, review aggregates |
| 7 | Visual Design | [visual-design.md](visual-design.md) | P1 | Color system, typography, scroll animations, micro-interactions, Croatian identity |
| 8 | CMS | [cms.md](cms.md) | P0 | Emdash integration, media library, Cloudflare Access auth, mobile admin, section toggles, content safeguards, preloaded content |
| 9 | SEO & Analytics | [seo-analytics.md](seo-analytics.md) | P1 | Schema.org, OG images, sitemap, Cloudflare Web Analytics, conversion events |
| 10 | Trust & Compliance | [trust-compliance.md](trust-compliance.md) | P1 | GDPR, privacy policy, Impressum, security headers |
| 11 | Performance | [performance.md](performance.md) | P1 | Image pipeline, edge caching, bundle budget |
| 12 | Accessibility | [accessibility.md](accessibility.md) | P0 | Reduced motion, keyboard nav, screen reader, contrast |

## Constraints

See [constraints.md](constraints.md) for the full list.

## Glossary

See [glossary.md](glossary.md) for term definitions.

## Documentation

Implementation produces documentation at `documentation/`:
- `architecture.md` — System overview, components, data flow
- `configuration.md` — Env vars, secrets, Cloudflare bindings
- `deployment.md` — Dev setup, deployment steps
- `cms-guide.md` — Owner's manual (every task from phone, with screenshots)
- `content-guide.md` — Tone, photography guidelines, translation workflow
- `security.md` — Auth, rate limiting, headers
- `seo.md` — Keyword targets, structured data, local SEO
- `troubleshooting.md` — Common issues and diagnostics
- `decisions/README.md` — Architecture Decision Records

## Changelog

See [changes.md](changes.md) for specification history.
