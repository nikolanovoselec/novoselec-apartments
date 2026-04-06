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

Initial CMS content is sourced from `seed/content/` — individual JSON files per collection. The `/api/admin/seed` endpoint and the `seed/seed.json` monolithic file have been removed. Content is entered directly through the Emdash admin panel or bootstrapped via SQL inserted through the D1 console.

### Seed content files

| File | Description |
|---|---|
| `seed/content/apartments.json` | Lavanda and Tramuntana — structured fields + per-locale names, descriptions, SEO |
| `seed/content/seasons.json` | Season date ranges, prices per night, and minimum stay rules |
| `seed/content/site-settings.json` | Property name, WhatsApp, phone, email, active locales, social links, etc. |
| `seed/content/testimonials.json` | Guest testimonials linked to apartments |

### Current CMS collections

| Collection | Description |
|---|---|
| `apartments` | Apartment detail pages per locale — Lavanda and Tramuntana |
| `testimonials` | Guest testimonials linked to apartments |
| `faqs` | FAQ entries in all 4 locales with sort order |
| `editorial` | Homepage section overrides and legal page body overrides |
| `vodic` | Local Guide content rows per locale |
| `hrana` | Food & Drink page — single entry per locale |
| `aktivnosti` | Nature & Activities content rows per locale |
| `plaze` | Beaches content rows per locale |
| `dolazak` | Getting Here content rows per locale |
| `about` | About Us — single entry per locale |
| `site-settings` | Global site settings |

See [Architecture](architecture.md#seed-data-structure) for full field-level details.

### Media

All photography is stored in the `apartmani-media` R2 bucket. No photos are committed to the repository. Images are served via `GET /api/img/:key` — see [Media Pipeline](architecture.md#media-pipeline) for the full serving route.

All R2 keys use UUID format (e.g., `aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg`), matching Emdash's native upload format. This applies to all photos — both those bulk-loaded at setup and those uploaded later through the CMS.

To add photos, upload through Emdash (`/_emdash/admin`) or via the presigned PUT flow (`POST /admin/api/upload-url`). The route returns a UUID key — reference it in the relevant CMS field (`gallery_json`, hero image, `collage` JSON array, etc.).

See `seed/media/README.md` for the full inventory of uploaded photos.



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

Wrangler reads credentials from `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables. The account ID is also committed in `wrangler.jsonc` (`ab75f75941a21a81db27bf12e99c620b`).

## Cloudflare Resource Setup

### D1 Database

The D1 database `apartmani-db` (`dd28856a-60e0-48d2-bb91-2b91ba8a0603`) is provisioned. After any schema change:

```bash
npx wrangler d1 migrations apply apartmani-db --remote
```

### R2 Bucket

The `apartmani-media` bucket is provisioned and the `r2_buckets` binding is active in `wrangler.jsonc`. The Emdash CMS storage integration is configured in `astro.config.mjs` via the custom hybrid adapter `storage: { entrypoint: "~/lib/storage-r2-hybrid", config: { binding: "MEDIA" } }`. No additional setup steps are needed unless recreating the bucket from scratch.

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
    api/          # Public API routes (availability, img serving, track)
  schemas/        # Zod validation schemas
  styles/         # Global CSS design system
migrations/       # D1 SQL migration files (applied via wrangler)
seed/
  content/        # Per-collection seed JSON files (apartments, seasons, site-settings, testimonials)
  media/          # Stock media sourcing plan (README.md)
public/           # Static assets (fonts, logo.png, favicon PNGs, web manifest; no photos)
wrangler.jsonc    # Cloudflare Worker configuration
astro.config.mjs  # Astro build configuration
```

---

## Related Documentation

- [Configuration](configuration.md#cloudflare-bindings) — Bindings, secrets, and migration details
- [Architecture](architecture.md#components) — What each resource is used for
- [Architecture](architecture.md#seed-data-structure) — Seed file schema and field definitions
- [API Reference](api-reference.md) — All endpoint signatures
