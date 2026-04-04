# CMS

Emdash CMS integration, media library, authentication, mobile admin UX, section toggles, content safeguards, and preloaded content.

## Key Concepts

- **Emdash**: Astro integration providing admin panel, REST API, content loader, media library
- **Mobile-first admin**: Every operation must work on owner's phone
- **Collections**: Apartments, seasons, testimonials, guide entries, FAQs, pages, site-settings
- **Section toggles**: Owner can show/hide optional homepage sections without deleting content
- **Preloaded content**: Site requires CMS seed data to render content — no hardcoded fallbacks on editorial pages
- **Structured editing**: Prefer structured fields over freeform rich text for most content types

## Requirements

### REQ-CMS-1: Emdash Integration

- **Intent:** Embedded CMS for content management without code
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - Emdash as Astro integration with D1 database and R2 storage
  - Admin panel at `/_emdash/admin/` for authenticated owner only
  - Content queried via Emdash content loader (`getEmDashCollection`, `getEmDashEntry`) wrapped in a locale-aware abstraction layer (`src/lib/content.ts`) providing `getLocalizedCollection(collectionSlug, locale)`, `getLocalizedEntry(collectionSlug, slug, locale)`, and `getSettings()`. All queries filter by `data.locale` field with automatic Croatian fallback.
  - Collections: homepage, apartments, testimonials, guide, faqs, pages (currently seeded), editorial (queried by multiple pages but not yet seeded). Planned: seasons, inquiries, site-settings
  - Site-settings: property name, WhatsApp number, phone number, email, active locales, hero photos, social links, section visibility toggles, check-in/out times, tourist tax rate
  - Public queries filtered by active locale and published status. Admin queries show all content including drafts/unpublished.
  - **Failure modes:**
    - D1 unavailable: visitor sees cached page (edge cache) or branded 500 error. Admin sees "Database temporarily unavailable, try again."
    - R2 unavailable: images fail gracefully (blurhash placeholder remains, alt text visible). No broken image icons.
    - Emdash crash: branded 500 error page for visitors. Admin shows diagnostic message.
- **Constraints:** CON-SEC, CON-STACK
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Full admin walkthrough on phone
- **Status:** Deprecated - all sections always visible

### REQ-CMS-2: Media Library (Mobile-First)

- **Intent:** Upload, organize, and manage photos from phone
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Tap-to-upload (mobile) and drag-and-drop (desktop)
  - Multiple photo upload in one action from phone camera roll
  - **Upload via R2 presigned URLs:** CMS client requests presigned PUT URL from Worker, then uploads directly to R2 from browser/phone. Avoids Worker memory limits on large files.
  - **Originals stored in private R2 bucket, never exposed directly.** Public images served via Worker route `GET /media/{key}` (rest parameter, supports dotted keys) which fetches from private R2 and applies Cloudflare Image Resizing via `cf: { image: { width, format, quality } }` on the fetch response. This Worker-mediated approach works with private R2 (unlike `/cdn-cgi/image/` path which requires public origins). Image Resizing handles format conversion (HEIC → AVIF/WebP), resizing, and orientation. Object keys are opaque (UUIDs, not filenames).
  - **EXIF GPS:** Originals in R2 may retain EXIF metadata, but since originals are never served publicly (only transformed derivatives via Image Resizing), GPS data is not exposed to visitors. Admin shown warning: "Original photos are stored securely. Location data is not visible to visitors."
  - **Blurhash:** Computed at seed time for preloaded content. For new uploads: computed client-side in the CMS admin UI (lightweight JS library, runs on phone) before upload completes. Stored as metadata string in D1.
  - Per-image: alt text (per locale, with "missing alt text" warning), sort order
  - Focal point: optional tap-to-set on mobile, defaults to center. CMS shows crop preview for how image appears in different contexts (hero, card, lightbox).
  - Gallery reordering: move up/down buttons + long-press-drag. "Set as cover" one-tap action.
  - Thumbnail grid preview in admin
  - Max 15MB per image. Warning if image resolution below 1200px wide (minimum for hero use).
  - Warning if aspect ratio is portrait and used in landscape hero slot.
  - Corrupt/unreadable uploads: clear error message, not silent failure
  - Supported: JPEG, PNG, HEIC, HEIF, WebP, AVIF
- **Constraints:** CON-PERF, CON-MEDIA
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Upload 10 photos from iPhone including HEIC, verify display in all contexts
- **Status:** Deprecated - all sections always visible

### REQ-CMS-3: Magic Link Authentication

- **Intent:** Owner logs in without passwords or external accounts
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Owner enters email address on login page
  - System sends 6-digit code via Resend (from `noreply@graymatter.ch`) to whitelisted email
  - Owner enters code, session created
  - Only whitelisted email(s) can receive codes (1-2 emails: owner + optional backup family member)
  - Session persists 30 days
  - Non-whitelisted email: "If this email is registered, you'll receive a code" (no information leak)
  - Login page mobile-friendly, large tap targets
  - Session expiry mid-edit: autosave draft, prompt re-login, restore state after
  - **Failure modes:**
    - Resend email delivery failure: endpoint returns success (identical to sent-successfully response) to prevent admin email enumeration via timing differences. Client shows standard "check your email" message. Log failure server-side.
    - Code expires after 10 minutes: clear message, one-tap resend
    - Brute force protection: max 5 code attempts per email per hour, then lockout with "Try again in 1 hour"
  - **Sessions:** Short-lived JWT (1 hour) + long-lived refresh token (30 days) in `Secure, HttpOnly, SameSite=Lax` cookies. JWT validated without D1 on each request. Refresh token validated against D1 `sessions` table when JWT expires. **Revocation:** owner or developer can delete session rows in D1 to force re-login (e.g., if phone stolen). Session list visible in admin settings.
  - **Recovery:** If owner loses email access, developer can add new email via Wrangler CLI (documented in deployment guide)
  - **Emdash admin panel auth:** Custom Resend email delivery plugin (`resend-email` Emdash plugin) registered via `emdash({ plugins: [...] })` in Astro config. The plugin hooks into Emdash's `email:deliver` event to send magic link codes via Resend API. The Resend API key is stored in Emdash's plugin KV store (key: `resend_api_key`) rather than via `cloudflare:workers` env bindings, because Emdash plugins are bundled at Vite build time when Worker bindings are unavailable. The key is cached in-memory after first fetch. Sender address: `noreply@graymatter.ch`. Recipient email validated before send. Non-200 Resend responses throw with status code for server-side logging.
- **Constraints:** CON-SEC
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Login from phone, verify session persistence, test session expiry recovery
- **Status:** Deprecated — replaced by REQ-CMS-9 (Cloudflare Access authentication). Magic link via Resend proved unreliable due to Vite build-time limitations with Worker bindings. The custom login page (`admin-login.astro`) and Resend email plugin have been removed.

### REQ-CMS-9: Cloudflare Access Authentication

- **Intent:** Owner accesses admin panel via zero-trust identity provider without managing passwords or email delivery infrastructure
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Emdash admin panel (`/_emdash/admin/`) protected by Cloudflare Access
  - Authentication delegated to Cloudflare Access via the `access()` plugin from `@emdash-cms/cloudflare`, configured in Astro config
  - Cloudflare Access team domain configured (organization-level Access policy)
  - `CF_ACCESS_AUDIENCE` env var holds the Access Application AUD tag for JWT validation
  - Auto-provisioning enabled: first authenticated user automatically created as admin (role 50)
  - No custom login page — Cloudflare Access handles the login flow (email OTP, SSO, or other configured identity providers)
  - No Resend dependency for authentication (Resend still used for inquiry notifications and guest auto-replies)
  - Session lifecycle managed by Cloudflare Access (token expiry, re-authentication)
  - **Failure modes:**
    - Cloudflare Access unavailable: admin panel inaccessible, visitor-facing site unaffected
    - Invalid or expired Access JWT: redirect to Cloudflare Access login
    - Revocation: disable user in Cloudflare Access dashboard or revoke Access application
  - **Recovery:** Add new authorized user via Cloudflare Access dashboard (no CLI needed)
- **Constraints:** CON-SEC
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
  - **Post-login redirect:** After Cloudflare Access authentication succeeds (Google login, email OTP, etc.), the browser must be redirected to `/_emdash/admin/` and the Emdash admin panel must load without showing "Authentication failed". The Access JWT (`CF_Authorization` cookie) must be validated by the `access()` plugin which extracts the user identity and provisions/authenticates the Emdash user.
  - **Debugging checklist:** If "Authentication failed" appears after successful CF Access login: (1) verify `CF_ACCESS_AUDIENCE` env var matches the Access Application's AUD tag, (2) verify team domain in astro.config.mjs matches CF Access organization, (3) verify `CF_Authorization` cookie is being set on the `/_emdash/` path, (4) check that `autoProvision: true` creates the user on first login.
- **Verification:** Access admin panel from phone via Cloudflare Access login, verify session persistence, verify unauthorized users cannot reach admin. **Must verify end-to-end: CF Access login → redirect → Emdash admin loads → can create/edit content.**
- **Status:** Partial — CF Access gate works (Google login succeeds) but redirect to Emdash admin fails with "Authentication failed"

### REQ-CMS-4: Mobile Admin UX

- **Intent:** Every admin operation usable on phone with clear task-based navigation
- **Applies To:** Owner
- **Acceptance Criteria:**
  - **Admin dashboard** organized by task, not by collection:
    - "Update Photos" — quick access to apartment galleries
    - "Update Prices" — seasonal pricing editor
    - "Mark Dates" — availability calendar
    - "Read Inquiries" — inquiry list with unread badge
    - "Edit Content" — pages and sections
    - "Settings" — languages, contact info, section toggles
  - All pages responsive, large tap targets (min 44px)
  - **Structured editing preferred over rich text:**
    - FAQ: question field + answer field (plain text or simple formatting)
    - Testimonials: structured fields (name, country, type, quote, rating)
    - Guide entries: structured fields (name, category, description, distance)
    - Apartment amenities: checkboxes and dropdowns, not prose
    - Rich text (Portable Text) only for: apartment full description, page body content (Why Pašman, Getting Here, host story)
  - Photo upload from camera roll
  - Gallery reorder: move up/down buttons as primary, drag as secondary
  - Locale editing: tabs for HR/DE/SL/EN with completion indicator per tab (green check / orange warning / red missing)
  - Date picker: native mobile input for availability
  - Price editing: numeric keyboard triggered
  - Common tasks achievable in 2-3 taps from dashboard
  - **Confirmation dialogs for destructive actions:** unpublish, delete, disable locale, change slug
- **Constraints:** CON-CMS
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Full task flow on iPhone: upload photos, edit text, update prices, mark dates, confirm inquiry, toggle section
- **Status:** Deprecated - all sections always visible

### REQ-CMS-5: Section Visibility Toggles

- **Intent:** Owner shows/hides optional homepage sections
- **Applies To:** Owner
- **Acceptance Criteria:**
  - **Toggleable (optional homepage sections):** Why Pašman, About Ždrelac, A Day on Pašman, Local Guide, Testimonials, Host Story, Direct Booking Benefits
  - **Always visible (cannot disable):** Hero, Apartments, Navigation, Footer, Inquiry Form, Language Switcher, FAQ, Getting Here, Privacy
  - Disabled sections: not rendered on homepage, navigation link removed
  - Content preserved when hidden (re-enable restores it)
  - Toggle on phone: simple on/off switches with section name and preview thumbnail
  - **Dependency warnings:** "Disabling Testimonials will also hide the trust strip on apartment pages"
  - No empty homepage possible — apartments and inquiry always shown
- **Constraints:** CON-CMS
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Toggle each section, verify no broken layout or dead links
- **Status:** Deprecated - all sections always visible

### REQ-CMS-6: Preloaded Content & Media

- **Intent:** Ship complete, polished, live-ready site
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - All pages fully written in HR, DE, SL, EN with native-quality copy
  - Preloaded:
    - 2-3 example apartments with descriptions, amenities, realistic seasonal pricing, house rules
    - Hero slideshow: 4+ real island photos (Pašman/Adriatic) from `/photos/` directory
    - "Why Pašman" with real selling points and photos
    - "About Ždrelac" village description with photos
    - "Getting Here" with real Jadrolinija ferry info for both routes (Biograd-Tkon AND Zadar-Preko via Ždrelac bridge), airport distances, driving routes
    - "A Day on Pašman" with real itinerary and real places
    - Local guide: 12-15 real entries across all categories including Food & Drink
    - 3-5 example testimonials with realistic profiles
    - 10-15 real FAQ entries including house rules, cancellation, tourist tax
    - Host story template
    - Privacy policy, house rules, and cancellation policy templates
  - **Placeholder marking:** All preloaded content tagged as `placeholder: true` in CMS. Admin shows "Demo content — replace with your own" badge on placeholder items. Dashboard checklist: "Replace apartment photos with your own", "Update host story", etc.
  - Real photos: 20+ real island/Croatian photos in `/photos/` directory (no stock photography remaining)
  - Optional hero video: one 10-15s ambient stock clip
  - Site deployable and visitor-ready on day one
  - Owner workflow: open admin → see checklist → replace photos → edit text → mark as own content → done
  - **Seed API:** `POST /api/admin/seed` endpoint applies `seed/seed.json` to D1 via Emdash's `applySeed()`. Idempotent (safe to run multiple times). Returns JSON `{ success, result }` on 200 or `{ success: false, error }` on 500.
  - **Seed data (`seed/seed.json`):** 6 collections across 4 locales: `homepage` (section-based: why-pasman, zdrelac, apartments, cta), `pages` (why-pasman, getting-here, about, faq with structured section data — note: `why-pasman` and `getting-here` page entries with `sections_json` are superseded by individual `editorial` entries with respective `page_key` values), `apartments` (2 listings: Lavanda 4-pax, Tramuntana 2-pax with full field set), `faqs` (categorized Q&A), `guide` (local guide entries across categories), `testimonials` (guest quotes with country metadata). All entries have per-locale variants (hr, de, sl, en).
  - **Editorial collection seeding (critical):** CMS entries for ALL `editorial` page_keys must be seeded in all 4 locales: `hrana` (5 sections), `aktivnosti` (6 sections), `plaze` (5 sections), `zdrelac` (6+ sections), `why-pasman` (4 sections), `dolazak` (individual editorial entries per transport/arrival section), `about` (1 section), `homepage` sections, `privacy`. Hardcoded fallback content has been removed from all editorial pages — pages now render empty sections if CMS entries are missing. Complete seeding is a prerequisite for a functional site.
  - **All 4 locales complete:** DE and SL content must be culturally adapted (not machine-translated Croatian). German content is precise and detailed; Slovenian is warm and familiar. No locale should show Croatian fallback for seeded pages.
- **Constraints:** CON-MEDIA, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-CMS-1, REQ-CMS-2, REQ-I18N-4
- **Verification:** Deploy fresh instance, run seed endpoint, verify complete site renders in all 4 locales with no empty sections (all editorial page_keys have CMS entries), verify placeholder badges
- **Status:** Partial — 118+ entries seeded in HR and EN for most collections; DE and SL largely missing. Editorial collection: 21 HR entries seeded via D1 SQL for `hrana` (5), `aktivnosti` (6), `plaze` (5), `why-pasman` (4), `about` (1). DE/SL/EN editorial entries still missing. `why-pasman` content model restructured from single entry with `sections_json` to individual entries (consistent with other editorial pages). **Risk: pages with missing CMS entries now render empty sections (no fallback) so incomplete seeding in non-HR locales produces visibly broken pages.**

### REQ-CMS-7: Content Safeguards

- **Intent:** Prevent owner from accidentally breaking the site
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - **Required field validation:** Cannot publish apartment without name, at least 5 photos, and price for at least one season
  - **Locale completion indicators:** Per content item, per locale — green (complete), orange (partial), red (not started). Visible in content lists.
  - **"Duplicate from Croatian" action:** One-tap per locale to copy Croatian content as starting point for translation. Owner then edits the copy.
  - **Draft preview:** Owner can preview unpublished changes before going live. Preview URL uses signed token (expires 1 hour, multi-use within that window, scoped to specific content entity + locale). Preview responses: `Cache-Control: private, no-store` + `X-Robots-Tag: noindex, nofollow`. Page refreshes and navigation within preview work normally until token expires.
  - **Slug change safeguards:** Warning when changing a published slug. Automatic redirect from old slug to new slug (301). Old slugs stored per locale in a `redirects` table (locale + old_slug → entity_id + current_slug). Multiple historical slugs supported per entity per locale. Redirect lookup runs before 404.
  - **Missing content warnings:** Dashboard alerts for: missing alt text, empty locale fields on published content, placeholder content still live
  - **Autosave:** Edits saved as draft every 30 seconds. No work lost on session expiry or accidental navigation.
  - **Cannot delete published content without confirmation.** Deletion of apartments requires typing apartment name.
  - **Singleton pages** (Homepage, Privacy Policy) cannot be deleted or unpublished in Croatian. They can be edited but not removed.
- **Constraints:** CON-CMS
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-I18N-4
- **Verification:** Test each safeguard scenario on phone
- **Status:** Deprecated - all sections always visible

### REQ-CMS-8: Error Pages

- **Intent:** Branded error pages that maintain luxury feel
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Custom 404 page: branded design with site navigation, suggested links (homepage, apartments, contact), **fully localized per active locale**. Detects locale from URL path prefix (e.g., `/de/nonexistent` → German 404). Falls back to Croatian if locale cannot be determined. Message and CTA button labels rendered via `t()` translation keys. Links point to locale-appropriate pages (`/{locale}/`, `/{locale}/apartmani`, `/{locale}/kontakt`). Uses normal site shell (header/footer via Page layout).
  - Custom 500 page: **hardcoded minimal fallback shell** — no CMS/D1 dependency. Static HTML with property name, contact email/phone, homepage link, brand colors. No CMS-driven nav/footer. Baked into Worker at deploy time.
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-VD-1, REQ-I18N-3
- **Verification:** Trigger 404 in each locale (e.g., `/hr/xyz`, `/de/xyz`), verify page renders in correct language with nav and suggested links
- **Status:** Partial — 404 page now detects locale from URL path prefix (e.g., `/de/xyz` renders German), falls back to Croatian default, uses `t()` translation keys for message and CTA buttons, links to locale-appropriate homepage/apartments/contact. Still pending: live verification across all 4 locales; 500 page not yet implemented as hardcoded minimal fallback shell

## Out of Scope

- Multi-user admin (beyond optional backup email)
- Role-based permissions
- Content version history (beyond autosave)
- Plugin marketplace
- Theme editing in admin
- Machine translation integration

## Domain Dependencies

- i18n (locale-aware content editing, completion indicators)
- Apartments (schema definition)
- Editorial (content collections)
- Booking (inquiry lifecycle)
- Performance (image serving via Cloudflare Image Resizing)
