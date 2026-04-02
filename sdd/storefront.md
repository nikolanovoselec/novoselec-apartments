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
  - **Layered gradient background:** radial gradients (azure at top-left, warm terracotta at bottom-right) over linear navy gradient, creating atmospheric depth without photography dependency
  - Stone grain SVG noise overlay at 3% opacity for tactile texture
  - Two-line title: property name on first line, location on second line in italic at reduced opacity (0.6)
  - `.text-label` location tag above title (localized per locale, e.g. "Otok Pasman, Hrvatska" for Croatian) at 0.7 opacity with wide letter-spacing
  - Tagline in uppercase sans-serif at 0.7 opacity below title
  - Ghost CTA button linking to apartments listing
  - Scroll indicator pulses at bottom (CSS keyframe animation)
  - Title and subtitle fade up with staggered CSS animation (0.3s and 0.6s delay)
  - On `prefers-reduced-motion`: all animations disabled, content immediately visible
  - Mobile: title scales down via clamp, subtitle uses smaller font size
  - **Future enhancement:** Ken Burns photo slideshow can layer over the gradient background when CMS hero photos are configured. Current gradient serves as the "no hero photos configured" fallback described in original spec.
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
  - 3-4 selling points: crystal sea, quiet island, 25-min ferry, authentic Dalmatia
  - Brief Ždrelac village introduction below (REQ-ED-6) — where exactly on the island the apartments are
  - Each point has a brief poetic line + supporting photo
  - Scroll-triggered fade-up reveal per point
  - Links to full editorial content
  - Responsive: stacks vertically on mobile
  - Toggleable via CMS section settings (REQ-CMS-5)
  - CMS-managed content per locale
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-ED-1, REQ-CMS-5
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
