# Apartmani Novoselec

Vacation rental website for family apartments in Ždrelac, Pašman island, Croatia.

**Live:** [apartmani.novoselec.ch](https://apartmani.novoselec.ch)

## Tech Stack

- **Runtime:** Astro 6 SSR on Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (media)
- **CMS:** Emdash
- **Languages:** Croatian (primary), German, English, Slovenian

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
