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
| **Resend** | Email delivery service. Used to send owner inquiry notifications and legacy Magic Link codes. No longer used for CMS authentication (replaced by Cloudflare Access). Guest auto-reply is not implemented. |
| **Plugin KV** | Emdash's key-value store accessible to plugins at runtime via `ctx.kv`. Used to store configuration (e.g., Resend API key) that cannot be provided via Worker env bindings due to Vite build-time bundling. |
| **Crossfade Carousel** | Image slideshow where slides transition by fading opacity (stacked via absolute positioning), as opposed to sliding/swiping. Used for the hero section. |
| **Ken Burns** | Slow zoom and pan animation effect applied to still photographs, named after the documentary filmmaker. |
| **Blurhash** | Compact encoding of an image placeholder as a short string, decoded to a blurred preview before the full image loads. |
| **Portable Text** | Structured JSON format for rich text content used by Emdash, allowing flexible rendering. |
| **HEIC** | High Efficiency Image Container — native iPhone photo format. Stored as-is in R2 and served as-is via Worker route — no server-side format conversion occurs. |
| **Impressum** | Legal notice page containing operator identity, photo credits, website development attribution, external link disclaimer, and copyright notice. Not strictly required for Croatian-based sites but provided for DACH visitor trust and transparency (REQ-TC-3). Available at `/{locale}/impresum` in all 4 locales. |
| **OTA** | Online Travel Agency (e.g., Airbnb, Booking.com). The site encourages direct booking to avoid OTA fees. |
| **ICS** | iCalendar format for sharing calendar data. Used for syncing availability from Airbnb/Booking.com. |
| **hreflang** | HTML attribute indicating the language and geographic targeting of a page, used for multilingual SEO. |
| **DACH** | Germany (D), Austria (A), Switzerland (CH) — the German-speaking market. |
| **PAngV** | Preisangabenverordnung — German pricing transparency regulation requiring total price display including all mandatory fees. |
| **Magic Link** | Passwordless authentication method where a one-time code is sent to the user's email. **Deprecated** — replaced by Cloudflare Access for admin authentication (REQ-CMS-9). |
| **Cloudflare Access** | Cloudflare's zero-trust identity-aware proxy. Protects the Emdash admin panel by requiring authentication (email OTP, SSO, or other identity providers) before requests reach the Worker. Configured via the `access()` plugin from `@emdash-cms/cloudflare`. |
| **Image Resizing** | Cloudflare service that transforms images on-the-fly at the edge. **Not currently used** — images are served as-is from R2 via the `/api/img/{key}` Worker route. The service remains available for future optimization (AVIF/WebP conversion, responsive widths) but has not been applied. |
| **NAP** | Name, Address, Phone — consistency across all web presences is critical for local SEO. |
| **GBP** | Google Business Profile — local business listing on Google Maps. |
| **GSAP** | GreenSock Animation Platform — JavaScript animation library. Used optionally for max 1 signature scroll animation per page when CSS alone cannot achieve the effect. Gated to <20KB bundle contribution. |
| **DM Serif Display** | Display serif typeface from Google Fonts with high-contrast transitional strokes. Used for headings and display text. Self-hosted as woff2. Replaced Cormorant Garamond in Revision 20. |
| **Masonry Grid** | A layout pattern where items of varying heights are arranged in columns with no fixed row boundaries, creating a staggered brickwork effect. ~~Previously used on the gallery page with alternating aspect ratios (4:3, 3:4, 1:1) approximated via CSS Grid.~~ **Superseded** on the gallery page by scrolling collage strips (Revision 82). Still a general design term. |
| **Deterministic Shuffle** | A sorting technique that produces a stable, reproducible order from a seed value. The gallery page uses the locale's first character code XORed with each photo UUID's leading 32-bit integer to produce a different but consistent photo order per language. |
| **Poetic Captions** | 50 evocative Croatian-language short phrases assigned to gallery photos by rotating index. Rendered as visible overlay captions on photos (sans-serif white text, normal weight, 90% opacity, over a bottom-edge gradient) via the `showCaptions` prop, and also used as alt text. Not localized -- Croatian only, reflecting the love-letter editorial voice. |
| **Caustics** | Light patterns produced by refraction through a water surface. Previously simulated with overlapping radial gradients and slow horizontal drift animation. **Superseded** by Wave Divider components (REQ-VD-9) — caustics are no longer rendered on the site. |
| **Glassmorphism** | UI design trend using frosted-glass effect: translucent background + backdrop-filter blur + subtle border. Used on breathing card figcaptions. |
| **Wave Divider** | A decorative SVG component placed between page sections to create organic, flowing color transitions. Uses a bezier-curve wave path with configurable fill color and optional vertical flip. Responsive height via CSS clamp. |
| **section--wave-in** | CSS utility class applied to any `<section>` that receives an inline wave SVG at its top edge. Provides `position: relative` (for the absolutely-positioned wave), `padding-top: calc(var(--space-section) + clamp(50px, 8vw, 100px))` (standard section spacing plus wave height), and `margin-top: -2px` (subpixel gap fix). Replaces per-section inline style overrides for wave-receiving sections. |
| **section--footer-clear** | CSS utility class applied to the last content section on pages where a CTA, interactive element, or shallow content layout sits near the footer wave. Provides `padding-bottom: calc(var(--space-section) + clamp(50px, 8vw, 100px))` (standard section spacing plus footer wave height), ensuring the footer's top-edge wave SVG does not overlap content. Used on: homepage CTA, apartments listing CTA, kontakt, dolazak, o-nama. Editorial/content pages with sufficient section depth use standard section padding instead. Counterpart to `section--wave-in` (top-edge clearance). |
| **HeroSimple** | Reusable subpage hero component with optional background photo, dark overlay, Ken Burns animation, and bottom wave divider. Minimum height 50vh (50svh on mobile). Used on all non-homepage pages including apartment detail pages. Falls back to gradient when no image is provided. |
| **Scroll Collage** | An infinitely scrolling horizontal photo band using pure CSS marquee technique (duplicated track with `translateX(-50%)` keyframe). Used on the homepage to showcase property exterior photos. Pauses on hover, respects reduced motion. |
| **MiniCollage** | A compact variant of the Scroll Collage component used for inline photo strips within editorial sections and apartment detail pages. Same CSS marquee technique but smaller scale, configurable speed, optional `reverse` direction for right-to-left scrolling, optional `showCaptions` for overlay caption display (absolute-positioned at bottom of each photo with gradient background), and intended for contextual photo galleries within content sections. |
| **WCAG** | Web Content Accessibility Guidelines — international standard for web accessibility. This site targets WCAG 2.1 Level AA compliance. |
| **security.txt** | A standard (RFC 9116) for publishing security vulnerability reporting instructions at `/.well-known/security.txt`. Contains contact, expiry, preferred languages, and canonical URL. Managed via Cloudflare dashboard (not a static file in the repo). |
| **llms.txt** | A convention for providing structured site information to AI/LLM systems at `/llms.txt`. Contains property details, booking method, key URLs, and guidance for accurate AI-generated responses. |
| **Web App Manifest** | A JSON file (`site.webmanifest`) that provides metadata (name, icons, theme color, display mode) for browsers and mobile OSes when a site is added to the home screen. Not a full PWA — no service worker or offline support. |
| **Sailboat Logo** | The brand icon for Apartmani Novoselec — a sailboat silhouette PNG (`/logo.png`) with transparent background. Displayed in the top nav header only (28px — white filter over hero, original colors on scroll). Not used in the footer or mobile menu. Used as the source for all favicon PNGs. Rendered white on dark backgrounds via CSS `brightness(0) invert(1)` filter; original colors on light backgrounds. |
| **HSTS** | HTTP Strict Transport Security — response header instructing browsers to only connect via HTTPS. Configured with max-age=31536000 (1 year) and includeSubDomains (no preload — site is not submitted to the HSTS preload list). |
| **COOP** | Cross-Origin-Opener-Policy — response header controlling cross-origin window references. Set to `same-origin-allow-popups` (allows payment/OAuth popups to communicate back while blocking other cross-origin access). |
| **CORP** | Cross-Origin-Resource-Policy — response header controlling which origins can read a resource. Set to `same-origin`. |
