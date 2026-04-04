# Storefront

The homepage and visual shell — hero, navigation, footer, language switcher, and the emotional "Why Pašman" selling section.

## Key Concepts

- **Hero**: Full-viewport opening section with Ken Burns photo slideshow or optional ambient video loop
- **Shell**: Navigation, footer, language switcher, persistent CTAs that wrap every page
- **Why Pašman**: Emotional selling section — crystal sea, island rhythm, ferry accessibility

## Requirements

### REQ-SF-1: Hero Section

- **Intent:** Instantly immerse the visitor in Pašman's atmosphere
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Hero fills 100vh (100svh on mobile) with min-height 600px
  - **Background:** Crossfade image carousel with 4 stacked full-viewport slides. First slide eager-loaded with `fetchpriority="high"`, remaining slides lazy-loaded. Solid navy (`#0A1F33`) background color as fallback before images load. Dual-layer overlay: radial gradient (1200px ellipse at 50% 30%, from 30% to 65% navy opacity) plus linear gradient (40% opacity top, 20% mid, 50% bottom) providing soft vignette contrast for text. Gradient-only fallback remains available when no hero photo is configured.
  - **Crossfade carousel:** Slides stacked via absolute positioning, opacity 0 by default, `is-active` class sets opacity 1 with 1.8s ease-in-out CSS transition. Auto-advances every 6 seconds via inline `<script is:inline>` (IIFE pattern). Progress dots at bottom allow manual slide selection. Clicking a dot resets the auto-advance timer. Carousel pauses on mouseenter (desktop), resumes on mouseleave.
  - **Ken Burns on active slide:** Active slide image uses a continuous CSS keyframe animation (`@keyframes heroZoom`, 12s ease-in-out infinite alternate) that scales from 1.0 to 1.1 with a subtle translate3d drift (-1%, -1%). Animation is paused by default and plays only while the slide has `is-active` class. The continuous alternating cycle ensures the hero image is never static.
  - **Progress dots:** Centered at bottom (80px from bottom, 100px on mobile), 8px circles with 1.5px white border at 50% opacity. Active dot fills white and scales to 1.3x. `aria-label` on each dot button (`Slide N`).
  - Two-line title: property name on first line, location on second line in italic at reduced opacity (0.65)
  - `.text-label` location tag above title (localized per locale, e.g. "Otok Pasman, Hrvatska" for Croatian) at 0.7 opacity with wide letter-spacing
  - Tagline in uppercase sans-serif at 0.7 opacity below title
  - Ghost CTA button linking to apartments listing
  - Scroll indicator pulses at bottom (CSS keyframe animation)
  - Title and subtitle fade up with staggered CSS animation (0.3s and 0.6s delay)
  - On `prefers-reduced-motion`: all animations disabled, content immediately visible
  - Mobile: title scales down via clamp, subtitle uses smaller font size
  - **Wave at bottom of hero:** Inline SVG wave divider at the bottom edge of the hero section (same pattern as REQ-VD-9: organic bezier path, fill `#F8F5EF` to match page background below, responsive height, `aria-hidden="true"`, positioned absolute at `bottom: -1px`). Creates organic transition from hero photo into the "Why Pašman" section — no hard edge.
  - **Imagery authenticity:** All hero carousel photos must depict the Croatian Adriatic coast, Pašman island, or Dalmatian architecture. No tropical resorts, Greek islands (Santorini blue domes), or generic Mediterranean stock. Each carousel image must be unique (no photo reused elsewhere on the site).
  - **Image source:** All hero carousel photos are real island images stored in R2 and served via `/api/img/{key}` Worker route (REQ-PERF-1).
  - **Future enhancement:** CMS-managed hero image selection will replace the hardcoded local paths. Owner will be able to choose and reorder carousel images from the admin panel.
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-VD-9
- **Verification:** Visual + Lighthouse. Verify wave renders at bottom of hero with no gap or color mismatch.
- **Status:** Implemented — carousel and Ken Burns work; inline SVG wave at bottom of hero; all hero photos are real Croatian/island imagery served from R2 via `/api/img/{key}`

### REQ-SF-2: Optional Ambient Video Hero

- **Intent:** Allow a stock video loop as hero enhancement
- **Applies To:** Owner
- **Acceptance Criteria:**
  - A single 10-15s video can be stored in R2 (not uploaded via CMS — developer-managed)
  - Video plays `autoplay muted loop playsinline` on desktop only
  - Falls back to Ken Burns photo slideshow if no video is set or on mobile
  - Video compressed to <5MB
- **Constraints:** CON-PERF, CON-MEDIA
- **Priority:** P2
- **Dependencies:** REQ-SF-1
- **Verification:** Manual test desktop + mobile
- **Status:** Planned

### REQ-SF-3: Transparent-to-Solid Navigation

- **Intent:** Immersive header that becomes functional on scroll
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Nav starts transparent with white text over hero
  - Transitions to warm cream background with `backdrop-filter: blur(10px)` after scrolling past hero
  - Logo, language switcher, and nav links always visible
  - "Inquire" CTA button always visible in nav, links to `/{locale}/kontakt` (REQ-BK-8)
  - Hamburger menu on mobile with fullscreen overlay, including inline language picker (locale links with active state highlight)
  - Hamburger button: `.nav__hamburger` class with CSS styles (display flex, flex-direction column, gap 6px, no background/border, cursor pointer, padding 12px, z-index 101, position relative), three `<span>` elements (block, 24x2px, currentColor background, 1px border-radius, transform/opacity transitions). Selected via `#hamburger-btn` ID. CSS transform morph to X on `.is-open` (translateY + rotate).
  - **Nav items (current order):** Apartments, Ždrelac (village page, REQ-ED-6), Gallery (REQ-SF-8), Getting Here, Local Guide, About. "Why Pašman" and FAQ removed from primary navigation (pages still exist, accessible via footer or direct URL).
  - **Admin link:** Navigation includes a link to the Emdash admin panel (`/_emdash/admin/`) labeled with the `nav.admin` translation key. Visible in both desktop nav and mobile menu. No authentication gate on the link itself (Emdash handles auth).
  - Menu items stagger in with animation
  - Focus trapping when fullscreen menu is open
  - Transition driven by IntersectionObserver (0.4s ease)
- **Constraints:** CON-A11Y, CON-PERF
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Visual + keyboard navigation test
- **Status:** Implemented

### REQ-SF-4: Language Switcher

- **Intent:** Let visitors switch between active locales without losing context
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Dropdown or toggle in nav showing current locale code
  - Only shows locales that are active (per REQ-I18N-2). Exception: legal pages show DE even if globally disabled (CON-LEGAL).
  - Switching navigates to equivalent page in target locale
  - **If target page is unpublished in that locale:** 404 (per REQ-I18N-1). Switcher only offers locales where the current page is published.
  - **If target page is published but has partial missing fields:** Croatian fallback per REQ-I18N-1 rules (page-level banner for rich text, silent fallback for short fields).
  - Never silently mixes languages on a page (Croatian fallback always indicated for rich text)
  - Sets `lang` attribute on `<html>`
  - Stores preference in cookie for return visits
- **Constraints:** CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-I18N-1, REQ-I18N-2
- **Verification:** Test all 4 locales, verify hreflang tags
- **Status:** Implemented

### REQ-SF-5: "Why Pašman" + Ždrelac Section

- **Intent:** Emotionally sell the destination, not just the apartment
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - ~~**Photo strip** between hero and Why Pasman~~ — **Removed:** the 3-image photo strip and wavy SVG separators between hero and "Why Pasman" were removed in favor of the hero crossfade carousel (REQ-SF-1), which now rotates multiple destination images. This eliminates redundant imagery immediately below the hero.
  - Split-section layout: heading + label on left, body text + tag row on right (desktop). Selling points displayed as uppercase bordered pill-shaped tags (20px border-radius, navy fill on hover with white text, not icon+text grid).
  - Brief Ždrelac village introduction as contained feature image with 24px border-radius (16px mobile), bottom text overlay (aspect-ratio 21:9 desktop, 16:9 mobile, gradient overlay from transparent to navy at bottom), subtle shadow, slow zoom on hover
  - Scroll-triggered fade-up reveal per section
  - Links to full editorial content
  - Responsive: stacks vertically on mobile
  - **Apartments preview** section with split-section layout (text + duo-image grid), duo-image is 2-col grid with spacing gap, 3:4 portrait aspect, organic asymmetric border-radius (`20px 4px 20px 4px`), hover zoom (1.03x). Ghost CTA to apartments page. **Exterior photo collage** (REQ-VD-15) placed after apartment cards within the dark section — an infinite CSS horizontal scroll band of property exterior photos sourced from CMS.
  - **Experience triptych** (REQ-ED-4): 4-item image grid within container with gaps (food, activities, beaches, local guide), 4:5 portrait aspect, hover zoom (1.05x), 16px border-radius, subtle shadow, gradient label overlay (always visible on mobile). Responsive grid: 2-column on mobile, 4-column on desktop (768px+ breakpoint). Wrapped in warm gradient background section. Each triptych item is a clickable `<a>` element linking to its detail page: Food & Drink -> `/{locale}/hrana` (REQ-ED-8), Nature & Activities -> `/{locale}/aktivnosti` (REQ-ED-9), Beaches -> `/{locale}/plaze` (REQ-ED-10), Local Guide -> `/{locale}/vodic` (REQ-ED-4). **Click/tap on the image or anywhere on the card navigates to the detail page** — not just the label text.
  - **Ždrelac village card** (feature image with overlay text): clicking/tapping anywhere on the card navigates to `/{locale}/zdrelac`. The entire card is an `<a>` element, not just the text.
  - Toggleable via CMS section settings (REQ-CMS-5)
  - CMS-managed content per locale
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-ED-1, REQ-ED-4, REQ-ED-6, REQ-CMS-5
- **Verification:** Visual review, test toggle off/on, verify all card links navigate correctly on mobile and desktop
- **Status:** Implemented

### REQ-SF-6: Footer

- **Intent:** Secondary navigation, legal links, property identity
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Property name/logo and tagline
  - Physical address displayed below tagline (muted, small text)
  - Quick links to all visible sections
  - Legal links: privacy policy, house rules, inquiry/contact page, admin panel
  - ~~"Book direct — no platform fees" trust message~~ — **Removed:** direct-booking trust message removed from footer per owner decision
  - SVG wave at the top edge of the footer (organic bezier path, navy fill `#0C2D48` to match footer background, responsive width, `aria-hidden="true"`). Creates organic transition from page content into footer — no hard edge.
  - Footer background: vertical gradient from `#0C2D48` to `#091E32`
  - Bottom bar: gradient divider line (transparent edges, 15% white center), copyright with location ("Zdrelac, Pasman")
  - Contact info CMS-managed in site-settings
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-VD-9
- **Verification:** Visual + link test. Verify wave renders at top of footer with no gap.
- **Status:** Implemented

### REQ-SF-7: Sticky Mobile CTA

- **Intent:** Keep inquiry conversion path always accessible on mobile
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - After scrolling past hero, a bottom bar slides up: "From €X/night · Check Availability"
  - Tapping navigates to contact page (`/{locale}/kontakt`, REQ-BK-8)
  - Thin bar (~56px), does not obscure content
  - Disappears when inquiry form is in viewport
  - Price pulled from lowest active seasonal rate
  - **Failure mode — no pricing available:** If no active seasonal pricing exists for any apartment, CTA shows "Check Availability" without price. Still links to inquiry form (Quick Question tab).
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-BK-8
- **Verification:** Mobile device test
- **Status:** Implemented

### REQ-SF-8: Gallery Page

- **Intent:** Showcase the property and destination through a curated photo collection
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/galerija` with `HeroSimple` photo-backed header (REQ-VD-12) and locale-aware title. Image grid using masonry-like layout with alternating aspect ratios (4:3 default, 3:4 for every 3n+1 item, 1:1 for every 3n+3 item). 2-column grid on mobile, 3-column on desktop (768px+ breakpoint). Each image wrapped in a card with 12px border-radius, subtle shadow, hover lift (translateY -4px with enhanced shadow), and image zoom on hover (1.05x). Per-locale alt text and captions on each image. Captions displayed below image in muted text. Staggered reveal animation via `data-reveal-stagger`. All images served from R2 via `/api/img/{key}` Worker route with UUID keys — real island photos, zero stock photography.
  - **With CMS (planned):** Owner uploads and reorders gallery photos via Emdash media library. Mix of apartment and destination images.
  - Accessible from primary navigation in all locales
  - Linked from navigation as top-level page (between Ždrelac and Getting Here)
- **Constraints:** CON-PERF, CON-I18N, CON-A11Y
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Visual review + responsive check on mobile/desktop
- **Status:** Implemented — 12 real island photos with UUID keys; accurate per-locale alt text and captions in all 4 locales via inline `t4()` helper; each alt describes what the photo actually depicts (e.g., "Zdrelac harbour", "Turquoise bay", "Hilltop panorama") rather than generic labels; zero stock photos remain

## Out of Scope

- Multi-property homepage (single property site)
- Blog/news section
- E-commerce/direct payment

## Domain Dependencies

- CMS (media, content, section toggles)
- i18n (translations, language switcher)
- Booking (inquiry CTA)
- Visual Design (animations, palette)
- Editorial (Why Pašman content)
