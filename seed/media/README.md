# Media Library

All photos in the `apartmani-media` R2 bucket are real photos taken on-site or in Zadar. No stock photos from Pexels, Pixabay, or Unsplash remain in the CMS or seed data.

## Current inventory (68 photos uploaded April 2026)

### Nikola apartment (11 photos)
Descriptive R2 keys: `nikola-kitchen`, `nikola-living`, `nikola-bedroom`, `nikola-bathroom`, `nikola-terrace`, `nikola-exterior`, and 5 additional interior shots.

### Marko apartment (7 photos)
Descriptive R2 keys: `marko-living`, `marko-bedroom`, `marko-terrace`, and 4 additional interior/exterior shots.

### Island / hero photos
Descriptive R2 keys: `island-hilltop-panorama`, `island-bay-aerial`, `island-village-path`, `island-pine-coast`, and others used on hero sections across all pages.

### Food photos
Descriptive R2 keys: `food-peka-embers`, `food-grilled-fish`, `food-konoba-table`, and others used on the `/hrana` food & drink page.

### Zadar guide photos
Descriptive R2 keys: `zadar-colorful-rooftops`, `zadar-sea-organ`, `zadar-roman-forum`, and others used in the Zadar day-trip guide entries.

### Gallery page (12 photos)
Descriptive R2 keys used in `galerija.astro` directly in the page source.

## R2 key conventions

Two key formats exist in the bucket:

| Format | Used for | Example |
|---|---|---|
| Descriptive slug | Bulk-uploaded real photos (hardcoded in CMS or page source) | `nikola-kitchen` |
| `<uuid>.<ext>` | Photos uploaded via admin CMS media library (`POST /admin/api/upload-url`) | `aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg` |

Both are served via `GET /api/img/:key`. The key is passed as-is (no extension required for descriptive keys, extension included for UUID uploads).
