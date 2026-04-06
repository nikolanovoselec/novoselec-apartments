# CMS Guide — Owner's Manual

How to manage content, photos, and settings from your phone.

**Audience:** Owner, Operators

---

## Accessing the Admin Panel

1. Open `https://apartmani.novoselec.ch/_emdash/admin/`
2. Cloudflare Access login appears — sign in with your Google account
3. The Emdash admin dashboard loads

**Authorized users:** Configured in the Cloudflare Access policy (see Cloudflare dashboard).

## Common Tasks

### Editing Apartment Content

1. Open Admin → Apartments collection
2. Tap the apartment you want to edit
3. Edit fields: name, description, tagline, amenities
4. Tap **Save** → **Publish**

### Updating Photos

All photos are stored in R2 and served via `/api/img/:key`. No photos are committed to the repository.

All R2 keys use `UUID.ext` format, matching Emdash's native upload format (e.g., `aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg`). The file extension is part of the key — the image serving route at `/api/img/:key` accepts the key as-is. Every photo — whether uploaded through the CMS media library or bulk-loaded via script — is stored and referenced using a `UUID.ext` key. Descriptive slug keys are not used.

Photos are referenced as `/api/img/<uuid>.<ext>` URLs.

Apartment galleries are controlled by the **Gallery** (`gallery`) field in each apartment entry. The value is a JSON array of `/api/img/:key` URL strings.

**To update a gallery via CMS:**
1. Open Admin → Apartments → select apartment
2. Find the **Gallery** field
3. Edit the JSON array — each entry is a URL string, e.g. `"/api/img/aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg"` (include the file extension)
4. Save and publish

**To add new photos:**
1. Open Admin → Media Library (`/_emdash/admin`)
2. Upload the photo — you will receive a `UUID.ext` key (e.g., `aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg`)
3. Add `/api/img/<uuid>.<ext>` to the `gallery` field of the relevant apartment
4. Save and publish — no redeploy required

### Managing the Photo Collage

The exterior photo strip that scrolls across the homepage (under the apartments section) is controlled by a CMS entry in the **Editorial** collection with `page_key = homepage` and `section_key = collage`.

The `body` field of that entry must contain a JSON array of photo objects using R2 image URLs. Emdash automatically parses any `body` value that begins with `[` or `{`, so the field is delivered to the page as an already-parsed JavaScript value, not a raw string — the page handles both forms safely:

```json
[
  { "src": "/api/img/aa0fd53c-5d96-4a78-a5b5-0f68b543515a", "alt": "Terrace dining area" },
  { "src": "/api/img/4181b561-2828-4119-b04e-9fc596d65569", "alt": "BBQ garden" }
]
```

**To update the collage:**
1. Open Admin → Editorial collection
2. Find the entry with `page_key = homepage` and `section_key = collage`
3. Edit the `body` field — paste the updated JSON array
4. Save and publish

The collage strip is hidden entirely if the entry is absent or if the JSON is invalid. At least 5 photos are recommended for a smooth seamless loop. The photo list is locale-independent — all four language versions of the homepage show the same collage.

### Managing Prices

**Note: The `seasons` table migration (`0003_seasons.sql`) has not yet been applied. Price management through the CMS will not function until that migration is run. See [Configuration — D1 Migrations](configuration.md#d1-migrations).**

Once the migration is applied:

1. Open Admin → Seasons collection
2. Each season has: name, date range, price per night, minimum stay
3. Edit the price or date range
4. Save and publish
5. The apartment listing and detail pages update automatically

### Editing Page Content

Each editorial page has its own dedicated CMS collection. There is no shared `page_key` filter — you go directly to the collection for the page you want to edit.

1. Open Admin → select the collection for the page (see table below)
2. Each entry represents one content section on the page
3. Edit title, body text, image
4. Save and publish

**Collection reference:**

| Collection | Page | Notes |
|---|---|---|
| `vodic` | Local Guide (`/vodic`) | 8 sections (first 4 are Ždrelac village content, merged in Apr 2026); sorted by `sort_order`; CMS-only |
| `hrana` | Food & Drink (`/hrana`) | Single entry per locale; `gallery` field = JSON array of `{src, alt}` photo objects; `title` and `body` fields for the description section; page shows collage strips only when `gallery` has more than 1 photo per half |
| `aktivnosti` | Nature & Activities (`/aktivnosti`) | 2 sections (Land + Sea); CMS-only, page is blank without entries |
| `plaze` | Beaches (`/plaze`) | 4 sections; CMS-only, page is blank without entries |
| `dolazak` | Getting Here (`/dolazak`) | 3 sections; CMS-only |
| `about` | About Us (`/o-nama`) | Single entry per locale; `body` field is the host story; CMS-only |
| `gallery_captions` | Gallery (`/galerija`) | 57 entries per locale (228 total); each entry has `text` (required) and `sort_order`; captions are assigned to gallery photos by rotating index and rendered as visible overlay text via `showCaptions` prop on `MiniCollage`; seeded via `.emdash/seed.json` |

The `editorial` collection is now used only for homepage section overrides (section keys: `why-pasman`, `apartments`, `cta`, `collage`). The `/zdrelac` and `/zasto-pasman` standalone pages have been removed — their content lives in the `vodic` collection and the homepage respectively.

### Emdash Entry Requirements

When inserting entries directly into D1 (e.g., via SQL migration scripts), each row in an Emdash-managed collection table must include:

- `id` — TEXT, UUID format (e.g., `lower(hex(randomblob(4))) || '-' || ...`)
- `slug` — TEXT, unique identifier for the entry (e.g., `hrana-riba-hr`)
- `status` — TEXT, must be `'published'` for the entry to appear on the site

Entries missing `id`, `slug`, or with `status` other than `'published'` will not be returned by the Emdash content API.

### Reading Inquiries

Guest inquiries arrive by email to hello@graymatter.ch. The D1 database also stores all inquiries as a backup log accessible via the admin panel.

## Content Guidelines

- **Photos:** Minimum 1200px wide for hero use. JPEG or HEIC from phone camera is fine. Photos are served as-is from R2 — no server-side format conversion or resizing occurs.
- **Text:** Write naturally. Croatian can be warmer and more familiar. German should be precise with exact distances.
- **Locales:** Content can be published per locale independently. Unpublished locales fall back to Croatian.
- **Voice rules:** Certain pages (`aktivnosti`, `hrana`, `galerija`, `404`) have tighter tone requirements. See [Page-Level Voice Rules](content-guide.md#page-level-voice-rules) before editing intro text on those pages.

## Troubleshooting

- **"Authentication failed":** Clear browser cookies for the site, then try logging in again. Make sure you're using one of the authorized Google accounts.
- **Changes not visible:** Pages are edge-cached. Changes may take up to 1 hour to appear. Force refresh with Ctrl+Shift+R.
- **Can't upload photos:** Check file size (max 15MB). Supported formats: JPEG, PNG, HEIC, WebP.

---

## Related Documentation

- [Content Guide](content-guide.md#page-level-voice-rules) - Tone rules per locale and page-level voice requirements
- [Architecture — Public Page Routes](architecture.md#public-page-routes) - Page slugs, CMS collections, and what each page renders
- [Troubleshooting](troubleshooting.md) - Broader diagnostics beyond admin panel issues
