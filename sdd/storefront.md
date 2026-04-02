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
  - **Background:** Stock hero photograph (`center/cover`) with semi-transparent linear gradient overlay (navy at 60% top, 40% mid, 70% bottom) providing contrast for text. Gradient-only fallback remains available when no hero photo is configured.
  - Stone grain SVG noise overlay at 3% opacity for tactile texture
  - Two-line title: property name on first line, location on second line in italic at reduced opacity (0.65)
  - `.text-label` location tag above title (localized per locale, e.g. "Otok Pasman, Hrvatska" for Croatian) at 0.7 opacity with wide letter-spacing
  - Tagline in uppercase sans-serif at 0.7 opacity below title
  - Ghost CTA button linking to apartments listing
  - Scroll indicator pulses at bottom (CSS keyframe animation)
  - Title and subtitle fade up with staggered CSS animation (0.3s and 0.6s delay)
  - On `prefers-reduced-motion`: all animations disabled, content immediately visible
  - Mobile: title scales down via clamp, subtitle uses smaller font size
  - **Temporary workaround:** Stock photos currently served directly from Pexels CDN URLs (external hotlink) due to a routing bug in the `/media/:key` Worker route (404 on R2 fetch). When the `/media/` route is fixed, images will move to R2 with Cloudflare Image Resizing per REQ-PERF-1. Pexels CDN URLs use `?auto=compress&w=` for basic optimization.
  - **Ken Burns animation:** Hero background element uses CSS `@keyframes kenBurns` (slow zoom from `scale(1)` to `scale(1.08)`, 20s, ease-in-out, alternating infinite). Background container oversized to 110% at `-5% inset` to prevent edge visibility during zoom. Respects `prefers-reduced-motion` (animation disabled).
  - **Future enhancement:** Ken Burns photo slideshow with crossfade (multiple images) can replace the single static hero photo when CMS hero photo management is available. Current single-photo Ken Burns hero serves as the intermediate step between gradient-only fallback and full multi-image slideshow.
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Visual + Lighthouse
- **Status:** Implemented

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
  - "Inquire" CTA button always visible in nav
  - Hamburger menu on mobile with fullscreen overlay
  - Hamburger button: `.nav__hamburger` class with CSS styles (display flex, flex-direction column, gap 6px, no background/border, cursor pointer, padding 12px, z-index 101, position relative), three `<span>` elements (block, 24x2px, currentColor background, 1px border-radius, transform/opacity transitions). Selected via `#hamburger-btn` ID. CSS transform morph to X on `.is-open` (translateY + rotate).
  - **Admin link:** Navigation includes a link to the Emdash admin panel (`/_emdash/admin/`) labeled with the `nav.admin` translation key. Visible in both desktop nav and mobile menu. No authentication gate on the link itself (Emdash handles auth).
  - Menu items stagger in with animation
  - Focus trapping when fullscreen menu is open
  - Transition driven by IntersectionObserver (0.4s ease)
- **Constraints:** CON-A11Y, CON-PERF
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Visual + keyboard navigation test
- **Status:** Planned

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
- **Status:** Planned

### REQ-SF-5: "Why Pašman" + Ždrelac Section

- **Intent:** Emotionally sell the destination, not just the apartment
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Photo strip** between hero and Why Pasman: 3-image edge-to-edge grid (equal columns, 3:2 aspect, no gaps, no border-radius), no hover zoom, stacks to single column on mobile (21:9 aspect). Uniform treatment — images bleed to viewport edges.
  - Split-section layout: heading + label on left, body text + tag row on right (desktop). Selling points displayed as uppercase bordered tag pills (not icon+text grid).
  - Brief Ždrelac village introduction as full-bleed image with bottom text overlay (aspect-ratio 21:9 desktop, 16:9 mobile, gradient overlay from transparent to navy at bottom)
  - Scroll-triggered fade-up reveal per section
  - Links to full editorial content
  - Responsive: stacks vertically on mobile
  - **Apartments preview** section with split-section layout (text + duo-image grid), duo-image is uniform 1:1 column grid with 4px gap, 3:4 portrait aspect, no border-radius. Ghost CTA to apartments page.
  - **Experience triptych** (REQ-ED-4): 3-column edge-to-edge image grid with overlay labels (food, olive oil, beaches), 4:5 portrait aspect, hover zoom (1.03x), gradient label overlay at bottom, no border-radius. Stacks to single column (16:9 aspect) on mobile.
  - Toggleable via CMS section settings (REQ-CMS-5)
  - CMS-managed content per locale
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-ED-1, REQ-ED-4, REQ-ED-6, REQ-CMS-5
- **Verification:** Visual review, test toggle off/on
- **Status:** Planned

### REQ-SF-6: Footer

- **Intent:** Secondary navigation, legal links, trust signals
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Property name/logo, contact info (email, WhatsApp, phone)
  - Quick links to all visible sections
  - Language switcher (duplicate)
  - "Book direct — no platform fees" trust message
  - Links: privacy policy, cookie settings, Impressum
  - Contact info CMS-managed in site-settings
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1
- **Verification:** Visual + link test
- **Status:** Planned

### REQ-SF-7: Sticky Mobile CTA

- **Intent:** Keep inquiry conversion path always accessible on mobile
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - After scrolling past hero, a bottom bar slides up: "From €X/night · Check Availability"
  - Tapping opens inquiry form or scrolls to booking widget
  - Thin bar (~56px), does not obscure content
  - Disappears when inquiry form is in viewport
  - Price pulled from lowest active seasonal rate
  - **Failure mode — no pricing available:** If no active seasonal pricing exists for any apartment, CTA shows "Check Availability" without price. Still links to inquiry form (Quick Question tab).
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-BK-1, REQ-AP-4
- **Verification:** Mobile device test
- **Status:** Planned

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
