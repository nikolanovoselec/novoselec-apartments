# CMS Guide — Owner's Manual

How to manage content, photos, and settings from your phone.

## Accessing the Admin Panel

1. Open `https://apartmani.novoselec.ch/_emdash/admin/`
2. Cloudflare Access login appears — sign in with your Google account
3. The Emdash admin dashboard loads

**Authorized users:** REDACTED_EMAIL, REDACTED_EMAIL

## Common Tasks

### Editing Apartment Content

1. Open Admin → Apartments collection
2. Tap the apartment you want to edit
3. Edit fields: name, description, tagline, amenities
4. Tap **Save** → **Publish**

### Updating Photos

All photos are stored in R2 and served via `/api/img/:uuid`. No photos are committed to the repository.

Apartment galleries are controlled by the **Gallery (JSON array)** (`gallery_json`) field in each apartment entry. The value is a JSON array of `/api/img/:uuid` URL strings.

**To update a gallery via CMS:**
1. Open Admin → Apartments → select apartment
2. Find the **Gallery (JSON array)** field
3. Edit the JSON array — each entry is a URL string, e.g. `"/api/img/aa0fd53c-5d96-4a78-a5b5-0f68b543515a"`
4. Save and publish

**To add new photos:**
1. Open Admin → Media Library (`/_emdash/admin`)
2. Upload the photo — you will receive a UUID key
3. Add `/api/img/<uuid>` to the `gallery_json` field of the relevant apartment
4. Save and publish — no redeploy required

### Managing the Photo Collage

The exterior photo strip that scrolls across the homepage (under the apartments section) is controlled by a CMS entry in the **Homepage** collection with `section_key = collage`.

The `body` field of that entry must contain a JSON array of photo objects using R2 image URLs:

```json
[
  { "src": "/api/img/aa0fd53c-5d96-4a78-a5b5-0f68b543515a", "alt": "Terrace dining area" },
  { "src": "/api/img/4181b561-2828-4119-b04e-9fc596d65569", "alt": "BBQ garden" }
]
```

**To update the collage:**
1. Open Admin → Homepage collection
2. Find the entry with `section_key = collage`
3. Edit the `body` field — paste the updated JSON array
4. Save and publish

The collage strip is hidden entirely if the entry is absent or if the JSON is invalid. At least 5 photos are recommended for a smooth seamless loop. The photo list is locale-independent — all four language versions of the homepage show the same collage.

### Managing Prices

1. Open Admin → Seasons collection
2. Each season has: name, date range, price per night, minimum stay
3. Edit the price or date range
4. Save and publish
5. The apartment listing and detail pages update automatically

### Editing Page Content

1. Open Admin → Editorial collection
2. Filter by `page_key` — see the table below for which key controls which page
3. Each entry represents one section on the page
4. Edit title, body text, image
5. Save and publish

**Page key reference:**

| `page_key` | Page | Notes |
|---|---|---|
| `hrana` | Food & Drink (`/hrana`) | Each entry = one content row; CMS-only, page is blank without entries |
| `about` | About Us (`/o-nama`) | Single entry; `body` field is the host story; CMS-only |
| `getting-here` | Getting Here (`/dolazak`) | Single entry; `sections_json` field holds ferry, alt-route, and airport data as JSON; CMS-only |
| `why-pasman` | Why Pašman (`/zasto-pasman`) | Each entry = one content row; fields: `title`, `body`, `image`, `sort_order`; CMS-only, page is blank without entries |
| `zdrelac` | Ždrelac (`/zdrelac`) | Each entry = one content row; CMS-only, page is blank without entries |
| `aktivnosti` | Nature & Activities (`/aktivnosti`) | Each entry = one content row; CMS-only, page is blank without entries |
| `plaze` | Beaches (`/plaze`) | Each entry = one content row; CMS-only, page is blank without entries |
| `vodic` | Local Guide (`/vodic`) | Supplemental entries appended after `guide` collection rows |

### Reading Inquiries

Guest inquiries arrive by email to hello@graymatter.ch. The D1 database also stores all inquiries as a backup log accessible via the admin panel.

## Content Guidelines

- **Photos:** Minimum 1200px wide for hero use. JPEG or HEIC from phone camera is fine — Cloudflare handles format conversion.
- **Text:** Write naturally. Croatian can be warmer and more familiar. German should be precise with exact distances.
- **Locales:** Content can be published per locale independently. Unpublished locales fall back to Croatian.

## Troubleshooting

- **"Authentication failed":** Clear browser cookies for the site, then try logging in again. Make sure you're using one of the authorized Google accounts.
- **Changes not visible:** Pages are edge-cached. Changes may take up to 1 hour to appear. Force refresh with Ctrl+Shift+R.
- **Can't upload photos:** Check file size (max 15MB). Supported formats: JPEG, PNG, HEIC, WebP.
