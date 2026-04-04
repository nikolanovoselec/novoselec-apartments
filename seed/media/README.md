# Media Library

All photos in the `apartmani-media` R2 bucket are real photos taken on-site or in Zadar. No stock photos from Pexels, Pixabay, or Unsplash remain in the CMS or seed data.

## Current inventory (68 photos uploaded April 2026)

All photos are stored under UUID keys, matching Emdash's native upload format. The UUIDs below are the actual R2 object keys.

### Nikola apartment (11 photos)

Kitchen, living room, bedroom, bathroom, terrace, exterior, and 5 additional interior shots.

### Marko apartment (7 photos)

Living room, bedroom, terrace, and 4 additional interior/exterior shots.

### Island / hero photos

Hilltop panorama, bay aerial, village path, pine coast, and others used on hero sections across all pages.

### Food photos

Peka embers, grilled fish, konoba table, and others used on the `/hrana` food & drink page.

### Zadar guide photos

Colorful rooftops, sea organ, Roman forum, and others used in the Zadar day-trip guide entries.

### Gallery page (12 photos)

Photos referenced directly in `galerija.astro`.

## R2 key format

All keys use UUID format: `<uuid>.<ext>` (e.g., `aa0fd53c-5d96-4a78-a5b5-0f68b543515a.jpg`).

Photos are served via `GET /api/img/:key`. The UUID and extension are passed as-is. See [API Reference](../../documentation/api-reference.md#get-apiimgkey) for the full serving route details.
