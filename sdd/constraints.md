# Constraints

## CON-STACK: Technology Stack

Cloudflare Workers runtime with Astro 6 and Emdash CMS as an Astro integration. D1 for database, R2 for media storage. Single Worker deployment. **Custom domain:** `apartmani.novoselec.ch` (configured as Cloudflare custom domain route in `wrangler.jsonc`). Web-standard APIs only (fetch, crypto.subtle, Request/Response, URL, TextEncoder). No Node.js-specific APIs (fs, child_process, net). Requires `nodejs_compat` compatibility flag for Emdash dependencies. Configuration via `wrangler.jsonc`. **Images served via Worker route (`/api/img/{key}`) fetching from private R2 with Cloudflare Image Resizing (`cf: { image }`)** — no on-upload processing in Workers (memory/CPU limits). R2 object keys are UUIDs. All date/time logic uses `Europe/Zagreb` timezone. **Vite build limitation:** `cloudflare:workers` module cannot be imported at Vite build time — Emdash plugins that access Worker env bindings via dynamic import fail during the Astro build. Runtime-only access to Worker bindings must use API routes or middleware, not Emdash plugin hooks. **Workaround:** Emdash plugins that need secrets (e.g., Resend API key) read them from Emdash's plugin KV store (`ctx.kv`) at runtime instead of from Worker env bindings. **Env access pattern (Astro v6):** API routes access Cloudflare bindings via `import { env } from "cloudflare:workers"` (module-scoped, not extracted from Astro locals). The `@astrojs/cloudflare` adapter marks this import as external; it resolves at Worker runtime. Type safety provided by declaring the global `CloudflareBindings` interface in `src/env.d.ts`; the Cloudflare adapter maps this interface to the `env` export automatically, so API routes need no additional imports for typed bindings. **Non-secret configuration** (`ADMIN_EMAILS`, `TURNSTILE_SITE_KEY`, `CLOUDFLARE_ACCOUNT_ID`) lives in `wrangler.jsonc` `vars` block as plaintext. Secrets (`JWT_SECRET`, `EMDASH_AUTH_SECRET`, `TURNSTILE_SECRET_KEY`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) are set via `wrangler secret put`. `RESEND_API_KEY` is stored in Emdash's plugin KV store (key: `resend_api_key`) because the Resend email plugin is bundled at Vite build time and cannot access `cloudflare:workers` bindings. `CF_ACCESS_AUDIENCE` is set via `wrangler secret put` for Cloudflare Access JWT validation. `CLOUDFLARE_ACCOUNT_ID` is a plaintext var needed for generating R2 presigned upload URLs. **Email sender domain:** All transactional emails (inquiry notifications, guest auto-replies) use `noreply@graymatter.ch` as the From address via Resend. **Admin authentication** handled by Cloudflare Access (not Resend).

## CON-PERF: Performance Budget

- LCP < 2.5s on 4G mobile
- CLS < 0.1
- Total JS < 80KB gzipped (visitor-facing pages)
- Hero: preload only first image, lazy-load subsequent slideshow images
- All images served via Worker route (`/api/img/{key}`, UUID keys) with Cloudflare Image Resizing (`cf: { image }`) — private R2, AVIF/WebP with JPEG fallback, responsive widths
- **CSS-first animation system.** CSS transitions + IntersectionObserver for most effects. GSAP optional for max 1 signature moment per page. No GSAP on mobile.
- Lightbox lazy-loaded on scroll. Interactive map deferred to P2 (static image + deep links at launch).
- Static pages cached at Cloudflare edge with `stale-while-revalidate`
- Branded 404/500 error pages

## CON-A11Y: Accessibility

WCAG 2.1 AA compliance. `prefers-reduced-motion` fully respected — all animations disabled, content immediately visible. Focus trapping on lightbox and fullscreen nav. Keyboard navigable throughout. Visible focus indicators. Semantic HTML with proper heading hierarchy and ARIA landmarks. Alt text on all meaningful images (per locale). No color-only information. ~~Public accessibility statement~~ — Deprecated (REQ-TC-7).

## CON-I18N: Internationalization

4 locales: Croatian (`/hr/`), German (`/de/`), Slovenian (`/sl/`), English (`/en/`). Owner-activated per locale (Croatian always on). Locale-prefixed routes. `Intl.DateTimeFormat` and `Intl.NumberFormat` for locale-aware formatting. **Fallback policy:** Disabled locale = 404. Published page with partial missing content within an active locale = Croatian fallback with visible indicator. ~~Legal pages (Impressum) always available in German regardless of DE locale activation~~ — Impressum deprecated (REQ-TC-3). Never mix languages silently. Locale preference stored in functional cookie (no consent required).

## CON-SEC: Security

Cloudflare Access authentication for admin panel (zero-trust, JWT validation via `CF_ACCESS_AUDIENCE` AUD tag, auto-provisioned admin users). Cloudflare Turnstile (invisible mode) + honeypot on all forms. Rate limiting: max 5 POST requests to inquiry endpoint per IP per 10 minutes via Cloudflare WAF Rate Limiting Rules (Turnstile score is primary defense). CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy headers. No hardcoded secrets — all via Workers secrets. Inquiry data persisted to D1 before email attempt. Server-side Turnstile verification. Server-side availability revalidation. Input sanitization (no HTML injection, email header injection prevented). EXIF GPS data not exposed to visitors (originals never served publicly; Cloudflare Image Resizing strips EXIF from served derivatives).

## CON-CMS: Mobile-First Admin

All admin operations fully usable on phone. Large tap targets (min 44px). **Task-based dashboard** (not collection-based). Common tasks in 2-3 taps. Structured fields preferred over rich text. Locale completion indicators. Confirmation dialogs for destructive actions. Autosave every 30s. Placeholder content clearly marked. "Duplicate from Croatian" one-tap per locale. Move up/down buttons for gallery reorder (not drag-only).

## CON-MEDIA: Photo-First Media

Originals stored in R2. **Served via Cloudflare Image Resizing** (no Worker-side processing). HEIC handled by Image Resizing. EXIF GPS not exposed (originals in R2 never served publicly; Image Resizing strips EXIF from derivatives), orientation respected. Focal point optional (defaults to center) with crop preview. Max 15MB upload. Min 1200px width warning for hero use. Aspect ratio warnings for mismatched slots. Gallery reorder via move buttons + optional drag. No video upload in CMS.

## CON-SEO: Search Optimization

Schema.org structured data: VacationRental, FAQPage, BreadcrumbList. `hreflang` tags on all pages for active locales with `x-default`. Multilingual XML sitemap respecting locale activation. Open Graph images per apartment and per locale. Self-referencing canonical URLs per locale. **Strict URL policy:** no `www`, no trailing slashes, enforced via redirects. `noindex` on disabled locale pages and draft previews. Internal linking from editorial content to apartment pages. Review schema used cautiously (self-published reviews may not generate rich results).

## CON-LEGAL: EU/DACH Legal Compliance

GDPR consent checkbox on inquiry form. Privacy policy with data controller, legal basis, retention periods, processor list, erasure rights. ~~Impressum always 1-click accessible and available in German~~ — Impressum deprecated (REQ-TC-3), not legally required for Croatian-based site. House rules and cancellation policy on apartment pages. Tourist tax disclosure. **PAngV compliance (German pricing law):** total price including all mandatory fees shown for German locale. Cleaning fee disclosed. "Estimate — confirmed by owner" disclaimer.
