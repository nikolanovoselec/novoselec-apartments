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
  - ~~Section divider wavy SVG fades in on scroll entry~~ — Wave dividers are now always visible (REQ-VD-9), not scroll-triggered
  - **Ken Burns:** Hero carousel uses a continuous CSS keyframe animation (`heroZoom`, 12s ease-in-out infinite alternate) on slide images — scaling from 1.0 to 1.1 with a subtle translate3d drift (-1%, -1%). Animation is paused by default (`animation-play-state: paused`) and plays only on `.is-active` slides. The infinite alternating cycle ensures the hero image is never static, replacing the previous one-shot 8s transition.
  - **Breathing/floating keyframes:** `@keyframes breathe` (scale 1 to 1.02, 6s infinite), `@keyframes float` (translateY 0 to -8px, 5s infinite), `@keyframes slowZoom` (scale 1 to 1.05). Utility classes `.animate-breathe` and `.animate-float` available for decorative elements.
  - **GSAP optional:** Max 1 signature moment per page if CSS cannot achieve it (e.g., pinned "A Day on Pašman" timeline on desktop). If GSAP adds >20KB to bundle, skip it and use CSS-only alternative.
  - No parallax (complexity vs. value tradeoff for this project)
  - Only animate `transform` and `opacity` (GPU-composited), plus `clip-path` and `width` for specific reveal types
  - `prefers-reduced-motion`: all animation durations set to 0.01ms, content immediately visible. Premium effects (sunset gradient shift, haze drift, breathing cards) explicitly disabled via dedicated `@media (prefers-reduced-motion: reduce)` block.
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
  - Triptych and feature-image overlays: unified card overlay with gradient background (transparent to navy), always-visible label (uppercase, sans-serif) and title (serif). No slide-in animation — text is statically positioned over the image.
  - Testimonial card lift: translateY(-6px) with shadow escalation on hover (0.4s ease-out)
  - Tag pills: border-radius 20px, fill-sweep to navy background with white text on hover (0.3s)
  - Form focus: bottom-border animates from center via `.focus-line` element
  - Nav: smooth transparent-to-solid transition
  - Hamburger: morphs to X via CSS transform transitions on three `<span>` elements
  - Section dividers: standalone WaveDivider components between sections (always visible, `aria-hidden`, no scroll-triggered reveal)
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
  - **Homepage photos (organic system):** All homepage photo treatments use rounded corners (16-24px border-radius), contained within page grid with gaps, and subtle box-shadow. Specific treatments: ~~photo strip (removed — images moved to hero carousel)~~, feature image (21:9 desktop / 16:9 mobile, 24px radius desktop / 16px mobile, contained with shadow), ~~duo-image (removed — apartments preview section simplified to centered text-only layout)~~, triptych (4:5, 3 items, 16px radius, labels always visible). All images within containers, not edge-to-edge.
  - **Apartment galleries:** Standard aspect ratios (4:3 landscape, 3:4 portrait) with subtle `border-radius: 4-8px`. No extreme clip-path masks -- let the photography speak.
  - ~~**Guide page cards** (local guide): Full-bleed image cards with gradient overlay.~~ **Superseded:** The local guide page (`/vodic`) now uses an editorial section layout with titled content blocks and `MiniCollage` horizontal photo strips per section, replacing the previous card-overlay grid.
  - **Editorial/curated photos** (food, Why Pašman, activities, beaches, getting here): Dalmatian stone arch `clip-path` for select featured images only (pre-curated in CMS, not auto-applied to all uploads)
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
  - Section dividers: wavy SVG path (`currentColor`) at 0.3 opacity, 200px width, using CSS mask-image. Full-width wave separators (REQ-VD-9) between major sections using inline SVG with organic bezier curves, responsive height `clamp(50px, 8vw, 100px)`.
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
  - Warm gradient: diagonal blend of terracotta and azure at 5% opacity for editorial sections (no longer used on the homepage experience triptych)
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

### REQ-VD-9: Wave Section Dividers

- **Intent:** Organic, flowing transitions between page sections evoking the Adriatic coastline
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Reusable `WaveDivider` component: standalone SVG wave shape placed between sections to create organic color transitions
  - Inline SVG with `viewBox="0 0 1440 80"`, `preserveAspectRatio="none"`, organic bezier curve path
  - Responsive height via `clamp(50px, 8vw, 100px)`
  - Configurable fill color to match the target section background (e.g., dark navy for transition into dark section, cream for transition back to light)
  - `flip` prop for vertical mirror (top-of-section vs bottom-of-section placement)
  - `aria-hidden="true"` — purely decorative
  - **Homepage waves (3 placements):** (1) cream-to-dark before apartments section, (2) dark-to-cream after apartments section, (3) cream-to-sunset-gradient at the top of the sunset CTA section — an inline SVG embedded directly in the CTA `<section>` markup (not a WaveDivider component), with `fill="var(--color-bg)"` (cream) and `scaleY(-1)` vertical flip, positioned absolute at top of the section. Each wave's `fill` color must exactly match the background of the section it transitions INTO. The `bg` (background) must match the section it sits ON TOP OF. No visible color gaps or mismatches between wave and adjacent sections.
  - **Homepage hero wave:** The homepage hero section (REQ-SF-1) includes a wave at its bottom edge (cream fill `#F8F5EF`) for organic transition into the first content section. This is part of the hero component, not a separate WaveDivider.
  - **Subpage hero waves:** Every `HeroSimple` component with a background image includes an inline wave SVG at the bottom edge (cream fill `#F8F5EF`), creating an organic transition from hero photo into page content (REQ-VD-12). Pages with custom hero markup (not using HeroSimple) — including `hrana.astro`, `aktivnosti.astro`, and `plaze.astro` — achieve the same effect via inline SVG elements embedded directly in the hero section. **Every page with a hero image MUST have a wave at the bottom of the hero.** No exceptions.
  - **Wave color matching rules:** The fill color of every wave must be sampled from the actual CSS background of the section below it. For pages using `.section` (cream `#F8F5EF`), fill is `#F8F5EF`. For pages using `.section--alt` (stone `#EDE8DE`), fill is `#EDE8DE`. For transitions into dark sections, fill is navy `#0A1F33`. For transitions into gradient sections, fill must match the gradient's starting color at the top edge (e.g., navy `var(--color-navy)` for a navy-to-cream gradient). Never hardcode a color that doesn't match the adjacent section.
  - ~~`.water-flow` CSS utility class with caustics shimmer~~ — **Superseded.**
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P1
- **Dependencies:** REQ-VD-7
- **Verification:** Visual review on mobile and desktop — verify no color gaps between wave and adjacent sections on every page. Responsive test at 375px, 768px, 1440px.
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

### REQ-VD-12: Subpage Hero Pattern

- **Intent:** Consistent, visually rich hero treatment across all non-homepage pages, elevating them from plain gradient headers to immersive photo-backed banners
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Reusable `HeroSimple` component accepts optional `image` prop (URL string)
  - When `image` is provided: full-width background photo (`object-fit: cover`, `width: 100%`, `height: 100%`, absolute positioned) replaces the gradient fallback
  - When no `image` is provided: original gradient background preserved as fallback (overlay and wave still render)
  - Dark overlay (always present): linear gradient from `rgba(10, 31, 51, 0.5)` at top to `rgba(10, 31, 51, 0.7)` at bottom, ensuring white text contrast over any photo or gradient
  - Ken Burns animation on hero image: continuous CSS keyframe (`scale(1)` to `scale(1.06)`, 20s ease-in-out infinite alternate) — subtler and slower than the homepage hero carousel (12s, 1.1x)
  - Minimum height 50vh (50svh on mobile for viewport-accurate sizing), vertically centered content
  - Title (`h1`), optional subtitle, and optional introductory paragraph (`intro` prop) rendered over the overlay. The `intro` prop displays a poetic/descriptive sentence below the title (used on the gallery page, REQ-SF-8).
  - Wave SVG divider at bottom edge (same pattern as REQ-VD-9: `viewBox="0 0 1440 80"`, `preserveAspectRatio="none"`, organic bezier path, fill `#F8F5EF` to match page background, responsive height `clamp(50px, 8vw, 100px)`, `aria-hidden="true"`)
  - Wave positioned absolute at `bottom: -1px` to seamlessly bridge hero into page content with no visible seam
  - Content z-index layering: image (0), overlay (1), text content (2), wave (3)
  - All subpages use hero images: apartments listing, gallery, getting here, FAQ, about hosts, local guide, contact, privacy policy, hrana, aktivnosti, plaze
  - **Imagery authenticity:** Subpage hero photos must depict Croatian/Adriatic scenes relevant to the page topic. No Greek islands (Santorini), no tropical resorts, no generic Mediterranean. Each page uses a unique hero image (no duplicates across pages).
  - **Image source:** All subpage hero photos are real island/Croatian images stored in R2 and served via `/api/img/{key}` Worker route (REQ-PERF-1).
  - `prefers-reduced-motion`: Ken Burns animation disabled
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P1
- **Dependencies:** REQ-VD-9, REQ-VD-1
- **Verification:** Visual review across ALL subpages — verify wave renders at bottom with correct fill color, no gap. Verify hero images are contextually appropriate and unique per page.
- **Status:** Implemented — all subpages have real Croatian hero photos served from R2 via `/api/img/{key}` (UUID keys); inline SVG waves on all custom heroes; no non-Croatian imagery remains

### REQ-VD-13: Icon System

- **Intent:** Consistent, professional iconography across the site using Material Design Icons
- **Applies To:** System
- **Acceptance Criteria:**
  - All icons use `@mdi/js` (already installed) — inline SVG path data, not icon font
  - Icon helper component accepts icon name and renders inline SVG with `currentColor` fill
  - Icons used for: amenities grid on apartment detail, contact info (email, phone, location), navigation items where appropriate, trust strip items, footer links
  - Consistent sizing: 20px for inline text, 24px for standalone, 16px for compact lists
  - `aria-hidden="true"` on decorative icons, descriptive `aria-label` on functional icons
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P1
- **Dependencies:** None
- **Verification:** Visual review — no emoji or text-based icon substitutes remain
- **Status:** Planned — `@mdi/js` installed but not used anywhere

### REQ-VD-14: Unique Imagery Per Page

- **Intent:** Every page feels distinct and curated — no recycled stock photos
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Every hero image is unique across all pages (no two pages share the same hero photo)
  - Every content section image is unique within and across pages
  - All images are real Croatian Adriatic coast, Dalmatian architecture, Pašman/Ugljan islands, or contextually relevant Croatian subjects (food, nature, villages) — stored in R2 and served via `/api/img/{key}` Worker route (REQ-PERF-1)
  - **Triptych-to-page continuity:** Homepage triptych preview images (REQ-SF-5) may intentionally reuse the same photo as their target page's hero image. This is deliberate visual continuity (the card is a preview of the page), not accidental duplication.
  - Explicitly forbidden: Santorini/Greek blue dome imagery, tropical resorts, Maldives-style overwater bungalows, generic Mediterranean stock
- **Constraints:** CON-MEDIA
- **Priority:** P1
- **Dependencies:** REQ-VD-12
- **Verification:** Audit all image URLs — no duplicates, no non-Croatian imagery
- **Status:** Implemented — all pages use unique real island photos stored in R2 with UUID keys, served via `/api/img/{key}`; 139+ photos total (gallery page alone uses 139); zero Pexels URLs, zero stock photos, zero local `/photos/` paths remain; no non-Croatian imagery present

### REQ-VD-15: Exterior Photo Collage

- **Intent:** Ambient, luxury feel showcasing the property's outdoor spaces — terraces, BBQ, pine forest, arches — through an endlessly scrolling photo band
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Pure CSS infinite horizontal scroll (marquee technique) — no JavaScript
  - `reverse` prop: when set, animation plays in reverse direction (`animation-direction: reverse`), scrolling right-to-left instead of the default left-to-right. Used for two-direction collage pairs (e.g., Food & Drink page, REQ-ED-8).
  - `showCaptions` prop (default false): when enabled, renders each photo's alt text as an overlay caption positioned absolute at the bottom of the photo. Caption styling: sans-serif (`var(--font-sans)`), base font size, normal weight (400), line-height 1.6, white text at 90% opacity, padding `var(--space-md) var(--space-lg)`, with a bottom-to-top gradient background (`rgba(0,0,0,0.5)` to transparent) for legibility over any image. `pointer-events: none` so the overlay does not interfere with hover pause. Currently enabled only on the gallery page (REQ-SF-8) to display poetic Croatian captions over photos.
  - `@keyframes scroll-collage` from `translateX(0)` to `translateX(-50%)` with duplicated image track
  - Image height: 250px mobile, 350px desktop
  - 16px border-radius, `var(--space-md)` gap between images
  - 35s loop duration, `linear infinite` timing
  - Pauses on hover (`:hover` sets `animation-play-state: paused`)
  - Reduced motion: animation disabled, fallback to static display with `overflow-x: auto`
  - Accessibility: `aria-roledescription="carousel"`, duplicate images get `aria-hidden="true"`
  - Photos sourced from CMS editorial entry (`page_key=homepage`, `section_key=collage`, `body` field containing JSON array of `{src, alt}` objects). JSON is validated at render time: non-array values are discarded, and array items missing `src` or `alt` string fields are filtered out.
  - Owner manages collage by editing the gallery array in Emdash admin — add/remove photos without code changes
  - Placed on homepage in the apartments section (`section--dark`), after the text content. Also reused on: (1) apartment listing page (`section--dark`, exterior photos from same CMS entry, 35s speed), (2) apartment detail page (interior photos from `gallery` CMS field, 35s speed), (3) editorial detail pages (aktivnosti, dolazak, plaze, vodic) where each CMS section with photos renders a MiniCollage strip at 35s speed, (4) Food & Drink page (hrana) where a single gallery is split into two MiniCollage strips scrolling in opposite directions (default left, `reverse` right) stacked below the description text, and (5) Gallery page (galerija, REQ-SF-8) where 139 photos are split into strips of 10 (14 strips total) with alternating scroll directions and deterministic locale-based shuffle order. MiniCollage speed: 35s default for most pages; gallery page (REQ-SF-8) uses a fixed 80s duration per strip for uniform scroll pacing across all 14 strips.
- **Constraints:** CON-PERF, CON-A11Y
- **Priority:** P2
- **Dependencies:** REQ-VD-14, REQ-SF-1
- **Verification:** Collage scrolls smoothly, pauses on hover, respects reduced motion, photos load from CMS
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
