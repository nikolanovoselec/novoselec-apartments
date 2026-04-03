# Glossary

| Term | Definition |
|------|-----------|
| **Pašman** | An Adriatic island off northern Dalmatia, Croatia. 60 km2, ~3,400 inhabitants. Known for clean water, olive groves, and quiet rhythm. |
| **Tkon** | The main ferry port on Pašman island, connected to Biograd na Moru on the mainland. |
| **Astro** | Web framework for content-driven sites. Renders pages to static HTML at build time with optional client-side JS "islands" for interactive components. Used as the site framework. |
| **Biograd na Moru** | Mainland coastal town with the ferry terminal serving Pašman (Jadrolinija line). |
| **Galešnjak** | Heart-shaped island in the Pašman channel, visible from the island. |
| **Ždrelac** | Small village at the northern tip of Pašman island where the apartments are located. Connected to Ugljan island by bridge, providing alternative ferry access via the Zadar-Preko route. |
| **Jadrolinija** | Croatian state ferry company operating the Biograd-Tkon route (~25 min). |
| **Konoba** | Traditional Croatian tavern/restaurant, typically family-run, serving local food. |
| **Maestral** | Afternoon onshore breeze typical of the Adriatic coast, picking up around midday and calming by evening. Relevant for beach and water sport planning. |
| **Emdash** | Full-stack TypeScript CMS built as an Astro integration. Provides admin panel, REST API, media library, and content loader. |
| **D1** | Cloudflare's serverless SQL database (SQLite-based). Used for content storage via Emdash. |
| **R2** | Cloudflare's object storage (S3-compatible). Used for media (photos, video). |
| **Honeypot** | Anti-spam technique using a hidden form field invisible to humans but filled by bots. Submissions with the field populated are silently rejected. |
| **Turnstile** | Cloudflare's privacy-preserving CAPTCHA alternative. Used in invisible mode on inquiry forms. |
| **Resend** | Email delivery service. Used to send inquiry notifications to owner and auto-replies to guests. |
| **Crossfade Carousel** | Image slideshow where slides transition by fading opacity (stacked via absolute positioning), as opposed to sliding/swiping. Used for the hero section. |
| **Ken Burns** | Slow zoom and pan animation effect applied to still photographs, named after the documentary filmmaker. |
| **Blurhash** | Compact encoding of an image placeholder as a short string, decoded to a blurred preview before the full image loads. |
| **Portable Text** | Structured JSON format for rich text content used by Emdash, allowing flexible rendering. |
| **HEIC** | High Efficiency Image Container — native iPhone photo format. Stored as-is in R2; converted to AVIF/WebP/JPEG on-the-fly by Cloudflare Image Resizing when served. |
| **Impressum** | Legal notice page required by German/Austrian law (Telemediengesetz). Contains owner identity and contact. |
| **OTA** | Online Travel Agency (e.g., Airbnb, Booking.com). The site encourages direct booking to avoid OTA fees. |
| **ICS** | iCalendar format for sharing calendar data. Used for syncing availability from Airbnb/Booking.com. |
| **hreflang** | HTML attribute indicating the language and geographic targeting of a page, used for multilingual SEO. |
| **DACH** | Germany (D), Austria (A), Switzerland (CH) — the German-speaking market. |
| **PAngV** | Preisangabenverordnung — German pricing transparency regulation requiring total price display including all mandatory fees. |
| **Magic Link** | Passwordless authentication method where a one-time code is sent to the user's email. Used instead of OAuth for simplicity. |
| **Image Resizing** | Cloudflare service that transforms images on-the-fly at the edge (`/cdn-cgi/image/`). Avoids Worker-side image processing. |
| **NAP** | Name, Address, Phone — consistency across all web presences is critical for local SEO. |
| **GBP** | Google Business Profile — local business listing on Google Maps. |
| **GSAP** | GreenSock Animation Platform — JavaScript animation library. Used optionally for max 1 signature scroll animation per page when CSS alone cannot achieve the effect. Gated to <20KB bundle contribution. |
| **DM Serif Display** | Display serif typeface from Google Fonts with high-contrast transitional strokes. Used for headings and display text. Self-hosted as woff2. Replaced Cormorant Garamond in Revision 20. |
| **Masonry Grid** | A layout pattern where items of varying heights are arranged in columns with no fixed row boundaries, creating a staggered brickwork effect. The gallery page uses alternating aspect ratios (4:3, 3:4, 1:1) to approximate this pattern with CSS Grid. |
| **Caustics** | Light patterns produced by refraction through a water surface. Simulated with overlapping radial gradients and slow horizontal drift animation to evoke underwater light play. |
| **Glassmorphism** | UI design trend using frosted-glass effect: translucent background + backdrop-filter blur + subtle border. Used on breathing card figcaptions. |
| **Wave Divider** | A decorative SVG component placed between page sections to create organic, flowing color transitions. Uses a bezier-curve wave path with configurable fill color and optional vertical flip. Responsive height via CSS clamp. |
| **WCAG** | Web Content Accessibility Guidelines — international standard for web accessibility. This site targets WCAG 2.1 Level AA compliance. |
