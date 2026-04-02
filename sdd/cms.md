# CMS

Emdash CMS integration, media library, authentication, mobile admin UX, section toggles, content safeguards, and preloaded content.

## Key Concepts

- **Emdash**: Astro integration providing admin panel, REST API, content loader, media library
- **Mobile-first admin**: Every operation must work on owner's phone
- **Collections**: Apartments, seasons, testimonials, guide entries, FAQs, pages, site-settings
- **Section toggles**: Owner can show/hide optional homepage sections without deleting content
- **Preloaded content**: Site ships complete with real Pašman content in all 4 locales
- **Structured editing**: Prefer structured fields over freeform rich text for most content types

## Requirements

### REQ-CMS-1: Emdash Integration

- **Intent:** Embedded CMS for content management without code
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - Emdash as Astro integration with D1 database and R2 storage
  - Admin panel at `/_emdash/admin/` for authenticated owner only
  - Content queried via Emdash content loader (`getEmDashCollection`, `getEmDashEntry`) wrapped in a locale-aware abstraction layer (`src/lib/content.ts`) providing `getLocalizedCollection(collectionSlug, locale)`, `getLocalizedEntry(collectionSlug, slug, locale)`, and `getSettings()`. All queries filter by `data.locale` field with automatic Croatian fallback.
  - Collections: homepage, apartments, testimonials, guide, faqs, pages (currently seeded). Planned: seasons, inquiries, site-settings
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
- **Status:** Planned

### REQ-CMS-2: Media Library (Mobile-First)

- **Intent:** Upload, organize, and manage photos from phone
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Tap-to-upload (mobile) and drag-and-drop (desktop)
  - Multiple photo upload in one action from phone camera roll
  - **Upload via R2 presigned URLs:** CMS client requests presigned PUT URL from Worker, then uploads directly to R2 from browser/phone. Avoids Worker memory limits on large files.
  - **Originals stored in private R2 bucket, never exposed directly.** Public images served via Worker route `GET /media/:key` which fetches from private R2 and applies Cloudflare Image Resizing via `cf: { image: { width, format, quality } }` on the fetch response. This Worker-mediated approach works with private R2 (unlike `/cdn-cgi/image/` path which requires public origins). Image Resizing handles format conversion (HEIC → AVIF/WebP), resizing, and orientation. Object keys are opaque (UUIDs, not filenames).
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
- **Status:** Planned

### REQ-CMS-3: Magic Link Authentication

- **Intent:** Owner logs in without passwords or external accounts
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Owner enters email address on login page
  - System sends 6-digit code via Resend to whitelisted email
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
- **Constraints:** CON-SEC
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Login from phone, verify session persistence, test session expiry recovery
- **Status:** Planned

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
- **Status:** Planned

### REQ-CMS-5: Section Visibility Toggles

- **Intent:** Owner shows/hides optional homepage sections
- **Applies To:** Owner
- **Acceptance Criteria:**
  - **Toggleable (optional homepage sections):** Why Pašman, About Ždrelac, A Day on Pašman, Local Guide, Testimonials, Host Story, Direct Booking Benefits
  - **Always visible (cannot disable):** Hero, Apartments, Navigation, Footer, Inquiry Form, Language Switcher, FAQ, Getting Here, Privacy/Impressum
  - Disabled sections: not rendered on homepage, navigation link removed
  - Content preserved when hidden (re-enable restores it)
  - Toggle on phone: simple on/off switches with section name and preview thumbnail
  - **Dependency warnings:** "Disabling Testimonials will also hide the trust strip on apartment pages"
  - No empty homepage possible — apartments and inquiry always shown
- **Constraints:** CON-CMS
- **Priority:** P0
- **Dependencies:** REQ-CMS-1
- **Verification:** Toggle each section, verify no broken layout or dead links
- **Status:** Planned

### REQ-CMS-6: Preloaded Content & Media

- **Intent:** Ship complete, polished, live-ready site
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - All pages fully written in HR, DE, SL, EN with native-quality copy
  - Preloaded:
    - 2-3 example apartments with descriptions, amenities, realistic seasonal pricing, house rules
    - Hero slideshow: 5 curated stock photos (Pašman/Adriatic)
    - "Why Pašman" with real selling points and photos
    - "About Ždrelac" village description with photos
    - "Getting Here" with real Jadrolinija ferry info for both routes (Biograd-Tkon AND Zadar-Preko via Ždrelac bridge), airport distances, driving routes
    - "A Day on Pašman" with real itinerary and real places
    - Local guide: 12-15 real entries across all categories including Food & Drink
    - 3-5 example testimonials with realistic profiles
    - 10-15 real FAQ entries including house rules, cancellation, tourist tax
    - Host story template
    - Privacy policy, Impressum, house rules, and cancellation policy templates
  - **Placeholder marking:** All preloaded content tagged as `placeholder: true` in CMS. Admin shows "Demo content — replace with your own" badge on placeholder items. Dashboard checklist: "Replace these 5 stock apartment photos", "Update host story", etc.
  - Stock media: 30-40 curated royalty-free photos
  - Optional hero video: one 10-15s ambient stock clip
  - Site deployable and visitor-ready on day one
  - Owner workflow: open admin → see checklist → replace photos → edit text → mark as own content → done
  - **Seed API:** `POST /api/admin/seed` endpoint applies `seed/seed.json` to D1 via Emdash's `applySeed()`. Idempotent (safe to run multiple times). Returns JSON `{ success, result }` on 200 or `{ success: false, error }` on 500.
  - **Seed data (`seed/seed.json`):** 6 collections across 4 locales: `homepage` (section-based: why-pasman, zdrelac, apartments, cta), `pages` (why-pasman, getting-here, about, faq with structured section data), `apartments` (2 listings: Lavanda 4-pax, Tramuntana 2-pax with full field set), `faqs` (categorized Q&A), `guide` (local guide entries across categories), `testimonials` (guest quotes with country metadata). All entries have per-locale variants (hr, de, sl, en).
- **Constraints:** CON-MEDIA, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-CMS-1, REQ-CMS-2, REQ-I18N-4
- **Verification:** Deploy fresh instance, run seed endpoint, verify complete site renders in all 4 locales, verify placeholder badges
- **Status:** Planned

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
  - **Singleton pages** (Homepage, Privacy Policy, Impressum) cannot be deleted or unpublished in Croatian. They can be edited but not removed.
- **Constraints:** CON-CMS
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-I18N-4
- **Verification:** Test each safeguard scenario on phone
- **Status:** Planned

### REQ-CMS-8: Error Pages

- **Intent:** Branded error pages that maintain luxury feel
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Custom 404 page: branded design with site navigation, suggested links (homepage, apartments, getting here, contact), per locale. Uses normal site shell (header/footer from CMS).
  - Custom 500 page: **hardcoded minimal fallback shell** — no CMS/D1 dependency. Static HTML with property name, contact email/phone, homepage link, brand colors. No CMS-driven nav/footer. Baked into Worker at deploy time.
- **Constraints:** CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-VD-1
- **Verification:** Trigger 404 and 500, verify branded pages
- **Status:** Planned

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
