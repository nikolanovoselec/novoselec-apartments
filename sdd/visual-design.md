# Visual Design

Color system, typography, scroll animations, micro-interactions, and Croatian visual identity.

## Key Concepts

- **Design system**: Colors, typography, spacing, component patterns
- **Motion system**: Scroll animations and transitions with strict performance budget
- **Croatian identity**: Stone textures, olive motifs, coastal geometry — not generic Mediterranean

## Requirements

### REQ-VD-1: Color System

- **Intent:** Cohesive Croatian Mediterranean palette
- **Applies To:** System
- **Acceptance Criteria:**
  - Primary: Adriatic azure `#1A6B8F`, warm stone `#EDE8DE`, deep navy `#0A1F33`
  - Accents: olive `#5C6E3B`, terracotta `#C2714E`
  - Neutrals: warm cream `#F8F5EF`, warm gray `#3D3D3D`, white `#FFFFFF`, black `#111111`
  - Sand accent `#D4C9B8` for dividers and muted elements
  - Semantic color tokens: `--color-text`, `--color-text-heading`, `--color-text-light`, `--color-text-muted`, `--color-bg`, `--color-bg-alt`, `--color-bg-dark`, `--color-accent`, `--color-accent-warm`, `--color-border`
  - CSS custom properties on `:root`
  - Dark backgrounds used sparingly for contrast sections (`.section--dark`)
  - All text/background combinations pass WCAG AA contrast
- **Constraints:** CON-A11Y
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Contrast checker for all combinations
- **Status:** Implemented

### REQ-VD-2: Typography System

- **Intent:** Elegant, readable type with Croatian editorial feel
- **Applies To:** System
- **Acceptance Criteria:**
  - Display/headings: DM Serif Display (transitional serif with high contrast strokes), regular weight (400), dramatic clamp scale (`clamp(3rem, 7vw, 6rem)` for display, `clamp(2rem, 4vw, 3.5rem)` for h2), negative letter-spacing (-0.02em headings, -0.03em display)
  - Body: Inter (variable humanist sans-serif, weight range 100-900), regular weight, 15px base, 1.7 line-height
  - Utility classes: `.text-lead` (19px, 1.65 line-height) for introductory paragraphs, `.text-label` (11px, 600 weight, 0.12em tracking, uppercase) for small-caps section labels
  - Max 2 typefaces loaded (DM Serif Display + Inter variable). Both self-hosted as `.woff2` in `/fonts/`, preloaded via `<link rel="preload">`.
  - Full glyph coverage verified: Croatian (c, c, d, s, z), Slovenian (c, s, z), German (a, o, u, ss)
  - `font-display: swap` with size-adjusted fallback system font stack
  - Body max-width: 60ch
  - No ultra-thin fonts below 24px
  - **Long German strings:** heading wrapping and hyphenation tested. `hyphens: auto` for German body text. Max heading length tested with typical German translations (30-50% longer than English).
  - Line length controlled on desktop split layouts to prevent ultra-wide text blocks
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** None
- **Verification:** Visual review in all 4 locales
- **Status:** Implemented

### REQ-VD-3: Scroll Animation System

- **Intent:** Subtle, purposeful motion enhancing luxury feel
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **CSS-first approach:** All standard animations via CSS transitions + IntersectionObserver. No JS animation library required for most effects.
  - **Progressive enhancement gate:** Animation CSS hidden behind `.reveal-ready` class on `<html>`. JS adds this class at runtime. Without JS, all content remains fully visible (no opacity:0, no hidden clip-paths). This is the primary accessibility and resilience mechanism.
  - Fade-up reveal: CSS `opacity` + `transform: translateY()` triggered by IntersectionObserver via `data-reveal` attribute
  - Image clip-path reveal: CSS `clip-path: inset()` transition on scroll-triggered class via `data-reveal-clip` attribute
  - Staggered entry: CSS `transition-delay` per child (100ms increments) via `data-reveal-stagger` attribute
  - Section divider wavy SVG fades in on scroll entry
  - **Ken Burns:** Hero carousel uses a continuous CSS keyframe animation (`heroZoom`, 12s ease-in-out infinite alternate) on slide images — scaling from 1.0 to 1.1 with a subtle translate3d drift (-1%, -1%). Animation is paused by default (`animation-play-state: paused`) and plays only on `.is-active` slides. The infinite alternating cycle ensures the hero image is never static, replacing the previous one-shot 8s transition.
  - **Breathing/floating keyframes:** `@keyframes breathe` (scale 1 to 1.02, 6s infinite), `@keyframes float` (translateY 0 to -8px, 5s infinite), `@keyframes slowZoom` (scale 1 to 1.05). Utility classes `.animate-breathe` and `.animate-float` available for decorative elements.
  - **GSAP optional:** Max 1 signature moment per page if CSS cannot achieve it (e.g., pinned "A Day on Pašman" timeline on desktop). If GSAP adds >20KB to bundle, skip it and use CSS-only alternative.
  - No parallax (complexity vs. value tradeoff for this project)
  - Only animate `transform` and `opacity` (GPU-composited), plus `clip-path` and `width` for specific reveal types
  - `prefers-reduced-motion`: all animation durations set to 0.01ms, content immediately visible. Premium effects (sunset gradient shift, haze drift, caustics drift, breathing cards) explicitly disabled via dedicated `@media (prefers-reduced-motion: reduce)` block.
  - Mobile: simple fade-in only, no scroll-triggered complexity
  - **Art direction rules:**
    - Max 1 animated reveal per viewport height
    - No animation should delay content visibility by more than 0.8s
    - Animations enhance content, never compete with photography
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Lighthouse audit, reduced-motion test
- **Status:** Implemented

### REQ-VD-4: Micro-Interactions

- **Intent:** Premium tactile details
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Default button: outline with fill-sweep from left via `scaleX` pseudo-element, text color inversion on hover (0.4s)
  - Button variants: `--primary` (solid navy fill, azure on hover), `--ghost` (white text, translucent border, subtle backdrop fill on hover). Ghost variant used on dark/gradient backgrounds (e.g., sunset CTA section).
  - Image hover: subtle zoom (1.03-1.05x) within overflow:hidden (0.8s ease-out), applied to photo strip items, duo images, feature images, and triptych
  - Triptych label slide-in: labels hidden below frame (`translateY(100%)`) and slide up on hover (0.5s ease-out). Always visible on mobile (no hover).
  - Testimonial card lift: translateY(-6px) with shadow escalation on hover (0.4s ease-out)
  - Tag pills: border-radius 20px, fill-sweep to navy background with white text on hover (0.3s)
  - Form focus: bottom-border animates from center via `.focus-line` element
  - Nav: smooth transparent-to-solid transition
  - Hamburger: morphs to X via CSS transform transitions on three `<span>` elements
  - Section dividers: wavy SVG divider fades in on scroll-triggered reveal
  - All hover effects have equivalent focus states for keyboard (`:focus-visible` with 2px accent outline)
- **Constraints:** CON-A11Y, CON-PERF
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Visual review + keyboard test
- **Status:** Implemented

### REQ-VD-5: Section Color Progression

- **Intent:** Daylight-inspired color temperature through the page
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Top sections: cool azure tones
  - Mid sections: warm stone/cream
  - Evening sections: warmer olive/terracotta accents
  - Bottom: deep navy
  - CSS background-color transitions between sections
  - Subtle temperature shift, not theme switching
- **Constraints:** CON-PERF
- **Priority:** P2
- **Dependencies:** REQ-VD-1
- **Verification:** Visual review full-page scroll
- **Status:** Planned

### REQ-VD-6: Photo Frame Treatments

- **Intent:** Make photos look polished and art-directed
- **Applies To:** System
- **Acceptance Criteria:**
  - **Homepage photos (organic system):** All homepage photo treatments use rounded corners (16-24px border-radius), contained within page grid with gaps, and subtle box-shadow. Specific treatments: ~~photo strip (removed — images moved to hero carousel)~~, feature image (21:9 desktop / 16:9 mobile, 24px radius desktop / 16px mobile, contained with shadow), duo-image (3:4, 2-col with organic asymmetric radius `20px 4px 20px 4px`, hover zoom 1.03x), triptych (4:5, 3-col, 16px radius, labels slide in on hover). All images within containers, not edge-to-edge.
  - **Apartment galleries:** Standard aspect ratios (4:3 landscape, 3:4 portrait) with subtle `border-radius: 4-8px`. No extreme clip-path masks -- let the photography speak.
  - **Editorial/curated photos** (local guide, food, Why Pašman): Dalmatian stone arch `clip-path` for select featured images only (pre-curated in CMS, not auto-applied to all uploads)
  - **Testimonial avatars:** Circular mask, small size
  - **Host story photo:** Soft rounded rectangle or arch — owner chooses in CMS from 2-3 preset frame styles
  - All masks via CSS `clip-path` — no image processing
  - Consistent padding and subtle shadow treatment on non-homepage contexts
  - Mobile: masks scale proportionally, homepage photos switch to single-column stacking with adjusted aspect ratios
  - **Guard rail:** Arch masks never auto-applied to user-uploaded apartment photos. Only used on editorial images where composition is controlled.
- **Constraints:** CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-VD-1
- **Verification:** Test with various phone photo aspect ratios and orientations
- **Status:** Implemented

### REQ-VD-7: Croatian Visual Identity

- **Intent:** Unmistakably Pašman/Dalmatian, not generic Mediterranean
- **Applies To:** System
- **Acceptance Criteria:**
  - Stone texture: inline SVG fractalNoise filter at 2-3% opacity applied via `.texture-stone` utility class on background sections. Uses `feTurbulence` with `baseFrequency` 0.9, 4 octaves, `stitchTiles`.
  - Hero uses same noise texture overlay at 3% opacity for depth
  - Section dividers: wavy SVG path (`currentColor`) at 0.3 opacity, 200px width, using CSS mask-image. Full-width wave separators (60px height) between major sections using inline SVG with organic bezier curves.
  - Decorative: olive branch silhouettes (max 2-3 per page)
  - No cliche anchors, seashells, compass roses, or folk patterns
  - Galešnjak (heart island in Pašman channel) as potential brand element
  - All decorative SVGs inline, minimal file size
- **Constraints:** CON-PERF
- **Priority:** P2
- **Dependencies:** None
- **Verification:** Visual review
- **Status:** Implemented

### REQ-VD-8: Gradient Utility System

- **Intent:** Subtle background gradients to add depth and warmth between content sections
- **Applies To:** System
- **Acceptance Criteria:**
  - Warm gradient: diagonal blend of terracotta and azure at 5% opacity for experience/editorial sections
  - Azure gradient: vertical fade of azure at 3% opacity for top-of-section accents
  - Sunset gradient: animated multi-color gradient (deep navy, azure, gold, terracotta, purple) with 200% background-size shifting on an 18s infinite cycle, plus a haze overlay with blur and drift animation. Used for high-impact CTA sections. Text forced to white with adjusted alpha for hierarchy.
  - All gradients are CSS utility classes applicable to any section
  - Warm and azure gradients are barely perceptible -- subtle temperature shifts, not visible color blocks
  - Sunset gradient is intentionally dramatic and animated -- reserved for CTA or hero-level sections only
  - All gradient animations respect `prefers-reduced-motion: reduce` (animation disabled)
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P2
- **Dependencies:** REQ-VD-1
- **Verification:** Visual review across sections, reduced-motion test
- **Status:** Implemented

### REQ-VD-9: Water-Flow Section Divider

- **Intent:** Organic, liquid transition between page sections evoking the Adriatic sea surface
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - `.water-flow` CSS utility class applicable to any section
  - Top-edge wave: CSS `mask-image` with inline SVG organic bezier path, cream background fill, responsive height (`clamp(56px, 8vw, 100px)`)
  - Caustics shimmer: radial-gradient pseudo-element (`::after`) with 4 overlapping light spots, 200px height, drifting horizontally on a 9s infinite animation
  - Caustics are subtle (0.5 opacity) and purely decorative (`pointer-events: none`)
  - `prefers-reduced-motion: reduce`: caustics animation disabled, opacity reduced to 0.3
  - Applied to the homepage apartments section (dark background)
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P2
- **Dependencies:** REQ-VD-7
- **Verification:** Visual review, reduced-motion test
- **Status:** Implemented

### REQ-VD-10: Breathing Image Cards

- **Intent:** Subtle life-like motion on feature images conveying premium quality
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - `.breath-card` component: 22px border-radius, `overflow: clip`, 4:3 aspect ratio, deep shadow
  - Image inside scales between 1.03x and 1.06x with slight vertical drift (-6px) on a 7.5s infinite ease-in-out cycle
  - Warm-tone gradient overlay (`::before`) blends warm gold and cool azure radial gradients with a bottom-darkening linear gradient
  - Figcaption: glassmorphism treatment (frosted blur, translucent navy background, subtle border, positioned absolute at bottom)
  - Image saturation and contrast boosted slightly (1.05x each) for vibrancy
  - `prefers-reduced-motion: reduce`: breathing animation disabled
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P2
- **Dependencies:** REQ-VD-6
- **Verification:** Visual review, reduced-motion test
- **Status:** Implemented

### REQ-VD-11: Animated Link Underline

- **Intent:** Premium hover interaction for inline text links
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - `.link-lux` utility class: underline drawn via `background` gradient at 0% width, expanding to 100% on hover (400ms ease)
  - Uses `currentColor` so it adapts to any text color context
  - No `text-decoration` (replaced entirely by background technique)
  - No animation on reduced-motion (CSS transitions naturally respect the reduced-motion media query applied globally)
- **Constraints:** CON-A11Y
- **Priority:** P2
- **Dependencies:** None
- **Verification:** Visual review, keyboard focus test
- **Status:** Implemented

## Out of Scope

- Custom cursor effects
- Sound design / ambient audio
- Dark mode
- Theme customization by owner

## Domain Dependencies

- Storefront (hero, nav)
- All content domains (animation targets)
- Performance (budget enforcement)
- Accessibility (reduced motion, contrast)
