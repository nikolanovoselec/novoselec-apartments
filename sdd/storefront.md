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
  - **Background:** Crossfade image carousel with 7 stacked full-viewport slides. First slide eager-loaded with `fetchpriority="high"`, remaining slides lazy-loaded. Solid navy (`#0A1F33`) background color as fallback before images load. Dual-layer overlay: radial gradient (1200px ellipse at 50% 30%, from 30% to 65% navy opacity) plus linear gradient (40% opacity top, 20% mid, 50% bottom) providing soft vignette contrast for text. Gradient-only fallback remains available when no hero photo is configured.
  - **Crossfade carousel:** Slides stacked via absolute positioning, opacity 0 by default, `is-active` class sets opacity 1 with 1.8s ease-in-out CSS transition. Auto-advances every 6 seconds via inline `<script is:inline>` (IIFE pattern). Progress dots at bottom allow manual slide selection. Clicking a dot resets the auto-advance timer. Carousel pauses on mouseenter (desktop), resumes on mouseleave.
  - **Ken Burns on active slide:** Active slide image uses a continuous CSS keyframe animation (`@keyframes heroZoom`, 12s ease-in-out infinite alternate) that scales from 1.0 to 1.1 with a subtle translate3d drift (-1%, -1%). Animation is paused by default and plays only while the slide has `is-active` class. The continuous alternating cycle ensures the hero image is never static.
  - **Progress dots:** Centered at bottom (80px from bottom, 100px on mobile), 8px circles with 1.5px white border at 50% opacity. Active dot fills white and scales to 1.3x. `aria-label` on each dot button (`Slide N`).
  - Two-line title: property name on first line, location on second line in italic at reduced opacity (0.65)
  - `.text-label` location tag above title (localized per locale, e.g. "Otok Pasman, Hrvatska" for Croatian) at 0.7 opacity with wide letter-spacing
  - Tagline below title in `.text-label` style: uppercase sans-serif, 11px (`--font-size-xs`), 600 weight, 0.2em letter-spacing, white at 0.7 opacity (via `rgba`)
  - Ghost CTA button linking to apartments listing
  - Scroll indicator pulses at bottom (CSS keyframe animation)
  - Title and subtitle fade up with staggered CSS animation (0.3s and 0.6s delay)
  - On `prefers-reduced-motion`: all animations disabled, content immediately visible
  - Mobile: title scales down via clamp (subtitle remains 11px at all breakpoints)
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
  - Transitions to warm cream background with `backdrop-filter: blur(10px)` after scrolling past hero. All nav transitions use 0.5s cubic-bezier easing.
  - **Brand logo icon:** Sailboat PNG (`/logo.png`) displayed left of "Apartmani Novoselec" text at 28px. White (CSS `brightness(0) invert(1)` filter) when nav is transparent over hero; original colors (filter removed) when nav transitions to solid background on scroll.
  - **Logo text visibility:** The "Apartmani Novoselec" text next to the logo is hidden (opacity 0) while the nav is transparent over the hero. It fades in when the nav transitions to solid background on scroll. Only the sailboat icon is visible in the hero state.
  - **Scroll trigger:** Nav transition is driven by IntersectionObserver on `.hero-title` (the hero heading element) as the primary trigger. Falls back to `.hero-sentinel` on pages with a hero but no title element, or applies `is-scrolled` immediately on pages with no hero.
  - Logo, language switcher, and nav links always visible
  - "Inquire" CTA button always visible in nav, links to `/{locale}/kontakt` (REQ-BK-8)
  - Hamburger menu on mobile with fullscreen overlay, including inline language picker (locale links with active state highlight)
  - Mobile menu contains no logo — nav links, language picker, and CTA button only
  - Hamburger button: `.nav__hamburger` class with CSS styles (display flex, flex-direction column, gap 6px, no background/border, cursor pointer, padding 12px, z-index 101, position relative), three `<span>` elements (block, 24x2px, currentColor background, 1px border-radius, transform/opacity transitions). Selected via `#hamburger-btn` ID. CSS transform morph to X on `.is-open` (translateY + rotate).
  - **Nav items (current order):** Apartments, Gallery (REQ-SF-8), Getting Here, Local Guide, About. ~~Ždrelac~~ removed (page deprecated, REQ-ED-6). "Why Pašman" and FAQ removed from primary navigation (pages still exist, accessible via footer or direct URL).
  - **Admin link:** Footer includes a link to the Emdash admin panel (`/_emdash/admin/`) labeled with the `nav.admin` translation key. No authentication gate on the link itself (Emdash handles auth). ~~Previously in navigation header~~ — moved to footer only.
  - Menu items stagger in with animation
  - Focus trapping when fullscreen menu is open
  - Transition driven by IntersectionObserver on `.hero-title` (0.5s cubic-bezier easing)
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
  - Split-section layout: heading + label on left, body text + tag row on right (desktop). Selling points displayed as uppercase bordered pill-shaped tags (20px border-radius, navy fill on hover with white text, not icon+text grid). No CTA button in this section — navigation to editorial pages is handled by the experience triptych and guide card below.
  - **Guide card** (feature image with overlay text): contained feature image with 16px border-radius, bottom text overlay with localized "Guide" label and poetic subtitle evoking the two islands and the sea between them (e.g., EN: "Pašman, Ugljan, and that small stretch of sea between them"). Aspect-ratio 21:9 desktop, 16:9 mobile, gradient overlay from transparent to navy at bottom, subtle shadow, slow zoom on hover. Clicking/tapping anywhere on the card navigates to `/{locale}/vodic` (local guide page). The entire card is an `<a>` element, not just the text.
  - Scroll-triggered fade-up reveal per section
  - Responsive: stacks vertically on mobile
  - **Apartments preview** section with centered text layout (label, heading, body text, ghost CTA to apartments page). Body text uses the personal family narrative — the hosts chose Pašman as a second home over decades, not a generic comfort pitch. Heading per locale (e.g., "Your home on the Adriatic"). No images in this section — visual interest comes from the dark background and the exterior photo collage below. **Exterior photo collage** (REQ-VD-15) placed after apartments text within the dark section — an infinite CSS horizontal scroll band of property exterior photos sourced from CMS.
  - **Experience triptych**: 3-item image grid within container with gaps (food, activities, beaches), 4:5 portrait aspect, hover zoom (1.05x), 16px border-radius, subtle shadow, gradient label overlay (always visible on mobile). Responsive grid: 2-column on mobile, 3-column on desktop (768px+ breakpoint). Plain cream section background (`.section`) — warm gradient background removed. Each triptych item is a clickable `<a>` element linking to its detail page: Food & Drink -> `/{locale}/hrana` (REQ-ED-8), Nature & Activities -> `/{locale}/aktivnosti` (REQ-ED-9), Beaches -> `/{locale}/plaze` (REQ-ED-10). Local Guide removed from triptych — it is already represented by the guide feature card above (REQ-SF-5 guide card). **Click/tap on the image or anywhere on the card navigates to the detail page** — not just the label text.
  - Toggleable via CMS section settings (REQ-CMS-5)
  - CMS-managed content per locale
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-CMS-5
- **Verification:** Visual review, test toggle off/on, verify all card links navigate correctly on mobile and desktop
- **Status:** Implemented

### REQ-SF-6: Footer

- **Intent:** Secondary navigation, legal links, property identity
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Brand identity:** "Apartmani Novoselec" text rendered as serif heading in the footer brand section. No logo image in footer — logo appears only in the top nav header.
  - Physical address displayed below tagline (muted, small text)
  - Quick links to all visible sections
  - Legal links: impressum (REQ-TC-3), privacy policy, house rules, inquiry/contact page, admin panel
  - ~~"Book direct — no platform fees" trust message~~ — **Removed:** direct-booking trust message removed from footer per owner decision
  - SVG wave at the top edge of the footer (organic bezier path, navy fill `#0C2D48` to match footer background, responsive width, `aria-hidden="true"`). Creates organic transition from page content into footer — no hard edge.
  - Footer background: vertical gradient from `#0C2D48` to `#091E32`
  - Bottom bar: gradient divider line (transparent edges, 15% white center), copyright with location ("Ždrelac, Pašman")
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
  - After scrolling past hero, a bottom bar slides up with two text spans: primary label (`cta.checkAvailability`, e.g., "Check availability") and secondary label (`homepage.cta.title`, e.g., "Get in touch"). No price is displayed.
  - Tapping navigates to the contact page (`/{locale}/kontakt`, REQ-BK-8)
  - Thin bar (~56px), does not obscure content
  - Visibility controlled by two sentinels: shows when `.hero-title` leaves the viewport (hero heading scrolled off-screen), falling back to `.hero-sentinel` on pages with a hero but no title element; hides when `.sticky-cta-end` sentinel enters the viewport. Once `.sticky-cta-end` has been reached, the CTA stays hidden even if the user scrolls back up (latch behavior — `reachedEnd` only resets if the sentinel moves back below the viewport). On the homepage, `.sticky-cta-end` is placed immediately after the triptych section, so the CTA disappears once the user scrolls down to the triptych end. On non-homepage pages where no `.sticky-cta-end` exists, the bar remains visible for the full scroll past the hero.
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-BK-8
- **Verification:** Mobile device test
- **Status:** Implemented

### REQ-SF-8: Gallery Page

- **Intent:** Showcase the property and destination through a curated photo collection
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/galerija` with `HeroSimple` photo-backed header (REQ-VD-12), locale-aware title, and a locale-specific intro sentence in poetic tone (brief, evocative, ending with an open statement rather than a closed sentence). 137 island photos (excluding apartment interiors) rendered as alternating infinite-scroll `MiniCollage` strips — photos split into groups of 10, each group becoming one strip (14 strips total: 13 full strips of 10 + 1 strip of 7); strips alternate scroll direction (`reverse` prop on odd-indexed strips). Photo order is deterministically shuffled per locale using the first character of the locale as a seed (XOR with the UUID's leading 32-bit integer), so each language version presents a different visual sequence. Poetic Croatian captions from a 50-item list are assigned to photos by rotating index (`i % captions.length`) and used as both alt text and visible overlay captions (via `showCaptions` prop on MiniCollage, REQ-VD-15). Captions appear as sans-serif white text (normal weight, 90% opacity) over a bottom-edge gradient on each photo. All images served from R2 via `/api/img/{key}` with `UUID.ext` keys — real island photos, zero stock photography.
  - Accessible from primary navigation in all locales
  - Linked from navigation as top-level page (between Apartments and Getting Here)
- **Constraints:** CON-PERF, CON-I18N, CON-A11Y
- **Priority:** P1
- **Dependencies:** REQ-VD-15, REQ-VD-12
- **Verification:** Visual review + responsive check on mobile/desktop. Verify strips scroll in alternating directions. Verify different locale produces different photo order.
- **Status:** Implemented — 137 real island photos in alternating scrolling collage strips (14 strips); locale-specific intro text in all 4 locales; locale-seeded deterministic shuffle for per-language visual variety; 50 poetic Croatian captions rendered as visible sans-serif overlay text on photos (via `showCaptions`) and used as alt text; fixed 80s scroll speed per strip; zero stock photos

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
