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

After first deploy, call the seed endpoint once to populate all Emdash collections. The endpoint requires the `X-Seed-Token` header matching the `EMDASH_AUTH_SECRET` Worker secret:

```bash
curl -X POST https://apartmani.novoselec.ch/api/admin/seed \
  -H "X-Seed-Token: <EMDASH_AUTH_SECRET value>"
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

The `apartmani-media` bucket is provisioned and the `r2_buckets` binding is active in `wrangler.jsonc`. The Emdash CMS storage integration is configured in `astro.config.mjs` via `storage: r2({ binding: "MEDIA" })`. No additional setup steps are needed unless recreating the bucket from scratch.

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
  seed.json       # Emdash CMS seed — 6 collections, ~80 entries, all 4 locales
  media/          # Stock media sourcing plan (README.md)
public/           # Static assets (fonts, favicon; no photos)
wrangler.jsonc    # Cloudflare Worker configuration
astro.config.mjs  # Astro build configuration
```

---

## Related Documentation

- [Configuration](configuration.md#cloudflare-bindings) — Bindings, secrets, and migration details
- [Architecture](architecture.md#components) — What each resource is used for
- [Architecture](architecture.md#seed-data-structure) — Seed file schema and field definitions
- [API Reference](api-reference.md) — All endpoint signatures
