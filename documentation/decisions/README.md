# Architecture Decision Records

Decisions made during implementation with rationale.

**Audience:** Developers

---

## Decision Index

| ID | Decision | Category | Date |
|----|----------|----------|------|
| AD1 | Use Cloudflare Image Resizing instead of Worker-side processing | Architecture | 2026-04-02 |
| AD2 | Magic Link auth via Resend instead of Google OAuth | Security | 2026-04-02 |
| AD3 | CSS-first animations, GSAP optional for max 1 signature moment | UI/Frontend | 2026-04-02 |
| AD4 | No PWA — unnecessary complexity for this scale | Architecture | 2026-04-02 |
| AD5 | Structured fields over rich text for most CMS content types | UI/Frontend | 2026-04-02 |
| AD6 | Inquiry lifecycle via email-first, D1 as backup log | Architecture | 2026-04-02 |
| AD7 | JWT implemented with Web Crypto API, no third-party library | Security | 2026-04-02 |
| AD8 | R2 presigned uploads via aws4fetch, not Worker-proxied | Storage | 2026-04-02 |
| AD9 | Locale prefix on all routes including default (hr) | Architecture | 2026-04-02 |
| AD10 | Input sanitization layer separate from Zod schema validation | Architecture | 2026-04-02 |
| AD11 | Scroll animations gated on `.reveal-ready` JS class | UI/Frontend | 2026-04-02 |
| AD12 | Editorial photos committed to `public/photos/` replacing Pexels; R2 migration deferred | Storage | 2026-04-03 |
| AD13 | Switch to manual i18n routing to prevent Astro from rewriting integration-injected routes | Architecture | 2026-04-02 |
| AD14 | Emdash CMS auth switched to Cloudflare Access | Security | 2026-04-03 |

---

### AD1: Use Cloudflare Image Resizing instead of Worker-side processing

**Decision:** Serve image variants via Cloudflare Image Resizing (`/cdn-cgi/image/`) instead of processing uploads in the Worker.

Workers have 128MB memory and strict CPU limits. Decoding 15MB HEIC files, generating AVIF/WebP variants, and computing blurhash in-Worker would cause OOM and timeout. Image Resizing runs on Cloudflare's edge infrastructure with no such limits, supports HEIC natively, and caches transformed images at the edge.

### AD2: Magic Link auth via Resend instead of Google OAuth

**Decision:** Use email-based Magic Link authentication (6-digit code via Resend) instead of Google OAuth.

Setting up GCP projects, consent screens, and maintaining OAuth credentials for exactly one user is overkill. Magic Link requires no external account setup, works on any phone, and uses the Resend infrastructure already needed for inquiry emails. Recovery path: developer adds new email via Wrangler CLI.

### AD3: CSS-first animations, GSAP optional

**Decision:** Use CSS transitions + IntersectionObserver for all standard animations. GSAP only if one specific signature moment truly needs it and adds <20KB to bundle.

For a 2-3 apartment site, GSAP's 30KB+ adds disproportionate bundle weight. CSS animations cover 95% of the needed effects (fade-up, clip-path reveal, staggered entry). Art direction and photography quality matter more than animation tech.

### AD4: No PWA

**Decision:** Do not implement PWA / Service Worker.

Visitors don't install PWAs for a vacation rental they visit once. Service worker caching adds complexity and edge-case bugs (stale content, cache invalidation). The site is fast enough via Cloudflare edge caching. Offline forms were explicitly unsupported anyway.

### AD5: Structured fields over rich text for most CMS content types

**Decision:** Use structured input fields (dropdowns, checkboxes, text inputs) for FAQ, testimonials, guide entries, amenities. Reserve rich text (Portable Text) only for apartment descriptions and editorial page bodies.

Mobile rich text editing is frustrating on phones. Structured fields are faster, less error-prone, and produce consistent output. The owner manages content from her phone — structured editing beats WYSIWYG elegance for this user profile.

### AD6: Inquiry lifecycle via email-first, D1 as backup log

**Decision:** Owner manages inquiries primarily via email (rich HTML from Resend with one-tap actions). D1 stores inquiries as backup and status tracker, not as a full inbox UI.

Building a custom inbox in the CMS admin is reinventing email. The owner already checks email and WhatsApp on her phone. D1 ensures no inquiry is lost if email fails, and provides the "Confirm + Block Dates" action that email alone can't do.

### AD7: JWT implemented with Web Crypto API, no third-party library

**Decision:** Auth JWTs are signed and verified using `crypto.subtle` (Web Crypto API) directly, with no third-party JWT library (e.g., jose, jsonwebtoken).

The Workers runtime does not support Node.js crypto modules. Third-party JWT libraries vary in Workers compatibility and add bundle weight. The HMAC-SHA-256 signing pattern requires only ~50 lines of code using standard Web Crypto API, which is available natively in all Workers environments. The implementation lives in `src/lib/auth.ts`.

### AD8: R2 presigned uploads via aws4fetch, not Worker-proxied

**Decision:** Browser-to-R2 uploads use presigned PUT URLs generated server-side with `aws4fetch`. The browser uploads directly to R2; the Worker is not in the upload data path.

Proxying large binary uploads through a Worker consumes egress bandwidth, adds latency, and risks hitting Worker memory limits (128MB) on large images. Presigned URLs offload the upload entirely to R2's S3-compatible endpoint. The Worker only generates and returns the signed URL. `aws4fetch` is used because the Workers runtime lacks the Node.js `aws-sdk`. R2 S3 credentials are separate from the bucket binding and must be created in the Cloudflare dashboard.

### AD9: Locale prefix on all routes including default (hr)

**Decision:** All public page routes include a locale prefix — including the default Croatian locale (`/hr/`). The root `/` redirects to the detected locale.

Prefixing the default locale avoids two canonical URLs for the same content (`/` and `/hr/`), which would require explicit canonical tag management. It also makes locale-switching symmetric and keeps URL structure consistent across all languages. The redirect at `/` uses `Accept-Language` for initial detection. Astro's i18n is configured with `routing: "manual"` (see [AD13](#ad13-switch-to-manual-i18n-routing-to-prevent-astro-from-rewriting-integration-injected-routes)) — locale prefixing is enforced by the file layout under `src/pages/[locale]/`, not by Astro's automatic routing.

### AD10: Input sanitization layer separate from Zod schema validation

**Decision:** Form inputs go through a dedicated sanitization module (`src/lib/sanitize.ts`) in addition to Zod schema validation. Sanitization runs before or alongside schema validation, not as a Zod transform.

Zod validates shape and types. Sanitization addresses content safety concerns orthogonal to schema validity: HTML injection, email header injection, URL spam in message bodies. Keeping them separate makes each responsibility testable in isolation and avoids coupling content-security logic to schema definitions.

### AD12: Editorial photos committed to `public/photos/` replacing Pexels; R2 migration deferred

**Decision:** Real island and location photos (hero carousel, page heroes, content-row images, Local Guide category images) are committed to the repository under `public/photos/` and served as static Worker assets via root-relative paths (e.g., `/photos/zdrelac-from-sea.jpg`). All Pexels stock photography has been removed.

**Rationale:** Pexels images required external CDN dependency, had no caching control, and did not represent the actual property and location. Real photos are a hard requirement for honest marketing. Committing them to `public/` resolves immediately without additional infrastructure — the Worker's asset manifest serves them with full edge caching.

**R2 end state (deferred):** The intended architecture remains R2-based serving for all images. The routing issue from the original AD12 (404 on `.jpg`-suffixed `/media/:key` paths due to Astro's file-based router intercepting extension-suffixed paths) is unresolved. Migration path: fix the routing issue (catch-all route or extension-free keys), upload photos to R2, update `src` references from `/photos/...` to `/media/...` slugs, and remove `public/photos/`. This allows photo swaps without redeploy and keeps the Worker bundle slim.

### AD11: Scroll animations gated on `.reveal-ready` JS class

**Decision:** Scroll-triggered reveal animations only activate when JavaScript adds a `.reveal-ready` class to `<body>` via IntersectionObserver. CSS selectors scope all animation rules under `.reveal-ready`, so without JS, all content renders at full opacity in its final position.

If JS is blocked or slow, visitors see all content immediately — no hidden headings, no invisible sections. This avoids the most common progressive-enhancement failure mode where CSS animations make content invisible until a script runs. The pattern also ensures crawlers and no-JS users receive fully readable pages with zero layout shift.

### AD14: Emdash CMS auth switched to Cloudflare Access

**Decision:** Emdash CMS (`/_emdash/admin`) authentication is handled by Cloudflare Access via the `access()` adapter from `@emdash-cms/cloudflare`, replacing the previous `EMDASH_AUTH_SECRET`-based mechanism. Users are auto-provisioned with Admin role (50) on first authenticated request.

Cloudflare Access enforces identity at the network edge before any request reaches the Worker, eliminating the need for a custom login page (`admin-login.astro`), a per-request secret comparison, and session state in D1. Access policies (email allowlist, IdP selection) are managed in the Cloudflare dashboard rather than in application code. The audience tag (`CF_ACCESS_AUDIENCE`) is the only secret the Worker needs to validate Access JWTs.

### AD13: Switch to manual i18n routing to prevent Astro from rewriting integration-injected routes

**Decision:** Astro's i18n is configured with `routing: "manual"` in `astro.config.mjs`. The `[locale]` file-based directory structure handles all locale routing; Astro performs no automatic route prefixing or rewriting.

With Astro's automatic `prefixDefaultLocale` routing enabled, Astro localizes every route it knows about — including pages injected by integrations such as Emdash. This moved `/_emdash/admin` to `/hr/_emdash/admin`. Requests to `/_emdash/admin` then hit the `[locale]` handler with `locale="_emdash"`, which returned 404 instead of reaching Emdash's request handler. Manual mode stops Astro from touching integration-injected routes while leaving file-based `[locale]` routing unchanged. The previous workaround — a `src/pages/_emdash/[...path].ts` catch-all and per-page underscore-prefix guards — was removed when manual routing was adopted.
