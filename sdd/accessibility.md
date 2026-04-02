# Accessibility

Reduced motion, keyboard navigation, screen reader support, and color contrast.

## Key Concepts

- **WCAG 2.1 AA**: Web Content Accessibility Guidelines level AA — the target compliance standard
- **Reduced motion**: OS-level preference (`prefers-reduced-motion`) that disables all animations
- **Focus trapping**: Keeping keyboard focus within a modal/overlay until it's closed
- **Semantic HTML**: Using proper elements (`<nav>`, `<main>`, `<article>`) for screen reader navigation

## Requirements

### REQ-A11Y-1: Reduced Motion Support

- **Intent:** Respect preferences, prevent vestibular discomfort
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - `prefers-reduced-motion: reduce`: all CSS animation durations set to 0.01ms, iteration count forced to 1, transition durations set to 0.01ms, scroll-behavior set to auto
  - GSAP: check matchMedia, skip all ScrollTrigger
  - Hero: gradient background always visible, no motion dependency
  - Pinned sections: normal document flow
  - **Progressive enhancement:** Content always visible without JS. Animation CSS gated behind `.reveal-ready` class which JS adds at runtime. Without JS, no `opacity:0` or `clip-path` hiding is applied. This ensures content visibility in three scenarios: (1) reduced motion preference, (2) JS disabled, (3) JS load failure.
- **Constraints:** CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-VD-3
- **Verification:** Enable reduced-motion, verify full site; disable JS, verify all content visible
- **Status:** Implemented

### REQ-A11Y-2: Keyboard Navigation

- **Intent:** Full usability without mouse
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - All interactive elements focusable and keyboard-operable
  - Visible focus indicators (2px accent outline)
  - Skip-to-content link first
  - Lightbox: Tab cycles controls, Esc closes, arrows navigate
  - Fullscreen nav: focus trapped, Esc closes
  - Form: logical tab order, Enter submits
  - Accordion: Enter/Space toggles, arrows between items
- **Constraints:** CON-A11Y
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Tab through entire site
- **Status:** Planned

### REQ-A11Y-3: Screen Reader Support

- **Intent:** Content accessible to visually impaired visitors
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Semantic HTML: heading hierarchy, landmarks
  - All images: meaningful alt text per locale or decorative `alt=""`
  - Form inputs: explicit `<label>` (not placeholder-only)
  - Error messages: `aria-live="polite"`
  - Form success: screen reader announced
  - Gallery: counter announced on navigation
  - Language switcher: `aria-label`
  - Map: text fallback with directions + "Open in Google Maps" link
- **Constraints:** CON-A11Y
- **Priority:** P0
- **Dependencies:** None
- **Verification:** VoiceOver test on key pages
- **Status:** Planned

### REQ-A11Y-4: Color & Contrast

- **Intent:** Readable for all vision levels
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - WCAG AA: 4.5:1 normal text, 3:1 large text
  - Hero text: contrast guaranteed via overlay
  - Transparent nav: gradient ensures text contrast
  - No color-only information (calendar uses color + pattern)
  - Tested with color blindness simulators
- **Constraints:** CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-VD-1
- **Verification:** Automated contrast check + manual review
- **Status:** Planned

## Out of Scope

- WCAG AAA compliance
- High-contrast mode theme
- Text resizing beyond browser zoom

## Domain Dependencies

- Visual Design (animation system, color system)
- Storefront (nav, hero)
- Apartments (gallery, calendar)
- Booking (form)
- Editorial (accordion)
