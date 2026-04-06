# Social Proof

Guest testimonials with contextual metadata and trust signal aggregates.

## Key Concepts

- **Testimonial**: Guest quote with country, travel type, season, apartment tag
- **Trust strip**: Compact aggregate signals placed near conversion points

## Requirements

### REQ-SP-1: Guest Testimonials

- **Intent:** Validate the emotional promise with real guest experiences
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Emdash collection: guest name (first name + initial), country flag, travel type (family/couple/solo/remote work), season of stay, year, short quote, optional longer story, optional apartment tag, rating (1-5), source (direct guest / Booking.com / Airbnb — for attribution transparency), **"Most loved for" manual tags** per testimonial (sea view, quiet, child-friendly, terrace, food, location — owner selects from predefined list)
  - **Homepage testimonials (current implementation):** 3-column grid on desktop (single column mobile) showing up to 3 testimonials from Emdash CMS `testimonials` collection, filtered by locale with Croatian fallback. Each card: `<blockquote>` with italic serif quote text, `<cite>` footer with guest name (bold) and country. Cards have warm cream/white background, border, hover lift (-4px translateY) with shadow. Section hidden if no testimonials exist in CMS. Section label ("Our guests" / localized) above grid.
  - Card carousel on homepage (planned enhancement: replace static grid with carousel for 4+ testimonials)
  - **Contextual placement on apartment detail pages:** one featured quote near inquiry widget, filtered list below. Featured quote selected by: 1) owner-flagged `isFeatured` boolean in CMS, or 2) fallback to most recent 5-star testimonial for that apartment, or 3) fallback to most recent global testimonial if none apartment-specific.
  - "Guests love:" tag cloud derived from "most loved for" tags across testimonials for each apartment
  - Card design: warm cream background, large quote marks, context line ("Maria K. · Germany · Family · August 2025")
  - Owner adds testimonials from phone via structured fields (not rich text)
  - Per-locale: quotes can be single language with locale indicator
  - Toggleable via section settings (homepage carousel). Contextual quotes on apartment pages shown if testimonials exist (no toggle needed).
- **Constraints:** CON-CMS, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-AP-1
- **Verification:** Create testimonials, verify on homepage and apartment pages
- **Status:** Partial — homepage testimonials grid renders 3 cards from the `testimonials` Emdash collection with locale fallback. Section hidden if collection empty. Apartment detail page does NOT yet render featured/contextual testimonials, "Most loved for" tag cloud, or per-apartment filtering. Card carousel for 4+ testimonials is also planned, not built.

### REQ-SP-2: Trust Strip

- **Intent:** Aggregate trust signals near inquiry widget
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Displayed near inquiry form on apartment detail page
  - Shows: average rating, total review count, years hosting, response time promise, "No payment required — free inquiry"
  - Compact single/two-line design
  - Data computed from testimonial collection
  - Hidden if no testimonials exist
  - Additional trust signals near inquiry: "No obligation", "Direct contact with owner", cancellation policy summary
- **Constraints:** CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-SP-1
- **Verification:** Verify with 0, 1, and 10+ testimonials
- **Status:** Planned

## Out of Scope

- Third-party review widget (Google Reviews, Booking.com API)
- Guest-submitted reviews (all owner-curated)
- Photo reviews from guests

## Domain Dependencies

- CMS (testimonial collection, section toggles)
- Apartments (apartment tagging)
- Booking (placement near inquiry)
