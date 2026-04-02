# Deployment

Dev setup, deployment steps, and Cloudflare resource provisioning.

**Audience:** Developers

---

## Prerequisites

- Node.js 20+
- Wrangler CLI: `npm install` (included as devDependency)
- Cloudflare account with access to the `apartmani` Worker project

## Local Development

```bash
npm install
npm run dev        # Astro dev server (local, no Worker runtime)
```

Note: local dev does not emulate D1 or R2 bindings. For full Worker runtime testing, deploy to a preview environment.

## Seed Data

`seed/seed.json` contains the full Emdash CMS seed: all 6 collections, ~80 entries across all 4 locales, and global site settings. It is the source of truth for initial CMS content.

### Running the seed

After first deploy, call the seed endpoint once to populate all Emdash collections:

```bash
curl -X POST https://apartmani.novoselec.ch/api/admin/seed
```

The endpoint is idempotent — it is safe to call multiple times. After seeding, content can be edited through the Emdash admin panel at `/_emdash/`.

### Collections in seed.json

| Collection | Description |
|---|---|
| `pages` | Editorial pages (Why Pašman, Getting Here, About, Privacy, Impressum) in all 4 locales |
| `apartments` | Lavanda and Tramuntana — structured fields + per-locale names, descriptions, SEO |
| `faq` | FAQ entries per locale with sort order |
| `guide` | Local guide entries by category (beaches, food, activities, day trips) per locale |
| `testimonials` | Guest testimonials linked to apartments |
| `amenities` | Amenity definitions with icons and localized labels |

See [Architecture](architecture.md#seed-data-structure) for full field-level details.

### Media seed plan

`seed/media/README.md` tracks royalty-free stock photo sources (Pexels, Pixabay, Unsplash) organized by category: hero/landscape, apartment interiors, editorial, local guide. Stock photos will be uploaded to R2 with descriptive slug keys (e.g., `hero-turquoise-sea.jpg`) once the `/media/:key` routing issue is resolved. Until then, homepage stock photos are served as direct Pexels CDN URLs. Owner-uploaded apartment photos use UUID keys. See [Media Pipeline](architecture.md#media-pipeline) for the full current state.



## Apply D1 Migrations

All migrations live in `migrations/`. Apply them to the remote D1 database with:

```bash
npx wrangler d1 migrations apply apartmani-db --remote
```

### Migration files

| File | Tables created |
|---|---|
| `migrations/0001_auth.sql` | `auth_codes`, `sessions` |
| `migrations/0002_availability.sql` | `availability_blocks`, `inquiries`, `events`, `redirects` |

Migrations are applied in order. The D1 `wrangler_migrations` table tracks which have been applied.

## Deploy to Production

```bash
npm run deploy
```

This runs `astro build && wrangler deploy`. The Worker is deployed to `apartmani` under the configured Cloudflare account.

Wrangler reads credentials from `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables. The account ID is also committed in `wrangler.jsonc` (`eac400a0a3a3638c7c91fe2e7875756d`).

## Cloudflare Resource Setup

### D1 Database

The D1 database `apartmani-db` (`1b519a56-0c60-475b-a30d-34f845bcff41`) is provisioned. After any schema change:

```bash
npx wrangler d1 migrations apply apartmani-db --remote
```

### R2 Bucket

The `apartmani-media` bucket binding is defined in `wrangler.jsonc` but commented out pending R2 enablement in the Cloudflare dashboard. Once enabled:

1. Uncomment the `r2_buckets` block in `wrangler.jsonc`.
2. Uncomment the corresponding line in `astro.config.mjs`.
3. Redeploy.

### Secrets

Set all required secrets before first deploy. See [Configuration](configuration.md#secrets) for the full list and commands.

## File Structure

```
src/
  components/     # Astro + React components
  i18n/           # Locale config and translation files
  layouts/        # Page layout shells
  lib/            # Business logic (auth, availability, pricing, media, email, content)
  middleware/     # Request pipeline (redirects, locale, headers)
  pages/          # Astro file-based routing
    [locale]/     # Public locale-prefixed pages
    admin/        # Admin panel and admin API routes
    api/          # Public API routes (availability, track)
    media/        # R2 image serving route
  schemas/        # Zod validation schemas
  styles/         # Global CSS design system
migrations/       # D1 SQL migration files (applied via wrangler)
seed/
  seed.json       # Emdash CMS seed — 6 collections, ~80 entries, all 4 locales
  media/          # Stock media sourcing plan (README.md)
public/           # Static assets
wrangler.jsonc    # Cloudflare Worker configuration
astro.config.mjs  # Astro build configuration
```

---

## Related Documentation

- [Configuration](configuration.md#cloudflare-bindings) — Bindings, secrets, and migration details
- [Architecture](architecture.md#components) — What each resource is used for
- [Architecture](architecture.md#seed-data-structure) — Seed file schema and field definitions
- [API Reference](api-reference.md) — All endpoint signatures
