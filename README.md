# Apartmani Novoselec

Vacation rental website for family apartments in Ždrelac, Pašman island, Croatia.

**Live:** [apartmani.novoselec.ch](https://apartmani.novoselec.ch)

## Tech Stack

- **Runtime:** Astro 6 SSR on Cloudflare Workers (HTML rendered per-request, no static generation)
- **CMS:** [Emdash](https://emdash.dev) — content management for apartments, editorial pages, testimonials, FAQ, guide collections
- **Database:** Cloudflare D1 (SQLite — inquiries, availability, analytics)
- **Storage:** Cloudflare R2 (media served via `/api/img/[key]`)
- **Auth:** Cloudflare Access (admin protected via identity-aware proxy)
- **Email:** Resend (inquiry notifications)
- **Languages:** Croatian (primary), German, English, Slovenian
- **Architecture:** Islands — minimal JS, `is:inline` scripts, IntersectionObserver for scroll reveals

## Key Patterns

- **i18n:** Manual routing with 4 locales (`hr` default, `de`, `sl`, `en`). Locale fallback: requested → `hr`.
- **Inquiry pipeline:** Zod validation → honeypot → Turnstile → sanitize → availability check → D1 insert → Resend email
- **Security:** Cloudflare Access for admin, Turnstile on public forms, CSP headers, input sanitization
- **Pricing:** Season-based with tourist tax. Defined in `seed/content/seasons.json`.

## Quick Start

```bash
npm install
npm run bootstrap   # Init Emdash + seed content
npm run dev         # Local dev server
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run typecheck` | Astro type checking |
| `npm test` | Run tests |
| `npm run seed` | Re-seed CMS content |

CI runs typecheck → test → build → deploy (on main) in a single job via `.github/workflows/ci.yml`. Build and deploy are merged into one job (single checkout, single install, single build) with deploy steps conditional on the main branch.

## Cloudflare Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| `DB` | D1 | SQLite database |
| `MEDIA` | R2 | Image/media storage |

## Documentation

| Document | Description |
|----------|-------------|
| [Documentation Index](documentation/README.md) | Full documentation with architecture, API, security, deployment guides |
| [Product Specification](sdd/README.md) | Requirements, acceptance criteria, design spec |
| [Architecture](documentation/architecture.md) | System overview, components, data flow |
| [API Reference](documentation/api-reference.md) | All API endpoints |
| [Configuration](documentation/configuration.md) | Environment variables, secrets, bindings |
| [Deployment](documentation/deployment.md) | Dev setup, Cloudflare resources |
| [CMS Guide](documentation/cms-guide.md) | Content management for operators |
| [Decisions](documentation/decisions/README.md) | Architecture Decision Records |

## Project Structure

```
src/
  components/    # UI components (shell, home, ui, seo)
  i18n/          # Translations and locale config
  layouts/       # Base and Page layouts
  lib/           # Content helpers, schema builders, sanitization
  middleware/    # Redirects, locale extraction, security headers
  pages/         # Routes ([locale]/*, api/*, admin/*)
  styles/        # Global CSS
seed/            # CMS seed data (apartments, seasons, testimonials)
migrations/      # D1 database migrations
documentation/   # Developer and operator docs
sdd/             # Product specification (SDD)
```

## License

Private. All rights reserved.
