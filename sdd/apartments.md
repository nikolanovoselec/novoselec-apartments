# Apartments

Apartment listings, detail pages, photo galleries, amenities, seasonal pricing, and availability calendars.

## Key Concepts

- **Listing**: Card-based overview of all apartments
- **Detail page**: Full presentation — gallery, amenities, pricing, availability, inquiry widget
- **Amenity**: Structured boolean field with icon (AC, WiFi, parking, etc.)
- **Seasonal pricing**: Price bands by date range (peak, shoulder, off-peak)
- **Availability**: Calendar showing booked/available dates per apartment

## Requirements

### REQ-AP-1: Apartment Collection Schema

- **Intent:** Define the data model for apartments in Emdash CMS
- **Applies To:** Owner, System
- **Acceptance Criteria:**
  - **Per-locale fields:** name, slug, short description, full description (Portable Text), one-line value proposition ("Best for couples with sea view terrace"), SEO title, SEO description
  - **Identity:** max occupancy (total adults + children), max children within occupancy, bedroom count, bathroom count, area (m2), floor/level, apartment naming (e.g., "Apartment Tramuntana")
  - **Bed configuration:** structured list — each entry: room name, bed type (double/single/sofa bed/bunk/crib), bed dimensions (e.g., "160x200cm"), count
  - **Distances:** distance to nearest beach (meters, walking), beach type (pebble/sand/rocky/concrete), distance to nearest shop (meters), distance to nearest restaurant (meters), distance to ferry Tkon (km), distance to Ždrelac bridge (km). Methodology noted: "walking distance" vs "straight line"
  - **Detailed amenities:**
    - Climate: AC type (whole unit / bedroom only / split units), heating
    - Connectivity: WiFi (yes/no + approximate speed if known), TV, satellite
    - Kitchen: full kitchen / kitchenette, fridge, oven, microwave, dishwasher, coffee machine type (filter/espresso/capsule), toaster, kettle, cooking utensils, tableware for X persons
    - Bathroom: shower / bathtub, hair dryer, washing machine location (in-unit / shared), iron
    - Outdoor: balcony/terrace (with size in m2 and furnishing), sea view quality (full / partial / none), BBQ type (stone / gas / charcoal), garden/yard access
    - Parking: type (private / street / reserved), vehicle count, covered (yes/no), distance from apartment
    - Access: floor level, stairs only / elevator, step-free access, number of steps
    - Policies: pet-friendly (with conditions/extra fee), smoking (indoor no / outdoor terrace ok), max occupancy strictly enforced
    - Child amenities: crib available, high chair, baby bath, child safety (balcony railing height, pool fence if applicable)
  - **House rules:** quiet hours, check-in/out times, party policy, additional guest policy. Per-locale rich text.
  - **Media:** ordered photo gallery (min 5, max 30), optional floor plan image
  - **Pricing:** linked seasonal pricing entries + optional per-stay cleaning fee
  - **Availability:** booked date ranges
  - **Status:** published/draft per locale independently
  - **Sort order** for listing page
  - **"Best for" labels:** owner selects from: couples, families, remote workers, groups, nature lovers. Displayed on listing cards.
- **Constraints:** CON-CMS, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-CMS-1, REQ-I18N-4
- **Verification:** Create test apartment in admin on phone, verify all fields render
- **Status:** Planned

### REQ-AP-2: Apartment Listing Page

- **Intent:** Let visitors browse and compare all apartments at a glance
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Card grid showing apartments from Emdash CMS (with hardcoded fallback data when CMS is not yet seeded). Each card: hero photo (3:2 aspect, `object-fit: cover`), name, tagline (italic), meta row (sleeps count, size in m2, beach distance in meters), "Best for" badge (navy uppercase overlay on image), price ("from EUR X/night"), and inquiry CTA button. 2-column grid on desktop, single column on mobile. Cards have hover shadow lift and subtle image zoom (1.03x). Uses `HeroSimple` header. Inquiry section below cards with email CTA.
  - **Fallback behavior:** When Emdash returns no apartments (CMS not seeded), two hardcoded example apartments display (Lavanda 4-pax, Tramuntana 2-pax) with Pexels stock photos and locale-aware names/taglines/labels. This replaces the previous "coming soon" lifestyle layout.
  - **With full CMS (planned):** sea view badge if applicable, one-line value proposition, link to detail page
  - Cards link to detail page
  - Quick-compare key facts visible on cards without clicking through
  - Image hover: subtle zoom within overflow:hidden
  - Scroll-triggered staggered fade-up entry
  - If only 1 apartment exists, listing page redirects to detail page
  - **If zero apartments published in current locale:** lifestyle coming-soon layout (described above) with inquiry CTA, not empty page or 404
  - 2-column grid on desktop (cards), single column on mobile
  - Only shows apartments published in current locale
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-AP-1
- **Verification:** Visual review with 0, 1, and 3+ apartments
- **Status:** Implemented

### REQ-AP-3: Apartment Detail Page

- **Intent:** Give the visitor everything needed to decide and inquire
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Visual hierarchy (top to bottom, most important first):**
    1. Hero: apartment name, key stats strip (guests, bedrooms, m2, beach distance, "Best for" label)
    2. Photo gallery (REQ-AP-6)
    3. Description: Portable Text rendered from Emdash
    4. Pricing table + availability calendar side by side on desktop (REQ-AP-4, REQ-AP-5)
    5. Inline inquiry widget pre-filled with this apartment (REQ-BK-1)
    6. Trust: direct booking benefits strip (REQ-BK-5) + contextual testimonial snippet (REQ-SP-1)
    7. Detailed amenities grid: icon + label, grouped by category (climate, kitchen, bathroom, outdoor, access)
    8. Bed configuration: visual diagram with bed types and dimensions
    9. House rules: check-in/out times, quiet hours, policies
    10. Floor plan: optional zoomable image
    11. Contextual FAQs (REQ-ED-7)
  - Trust info near inquiry widget: response time, no payment required, no obligation, cancellation summary
  - Contextual objection handling: common concerns answered inline (beach quality, parking, AC, stairs, noise, ferry stress)
  - Sticky mobile CTA at bottom
  - Breadcrumb navigation
- **Constraints:** CON-PERF, CON-A11Y, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-AP-1, REQ-AP-4, REQ-AP-5, REQ-AP-6, REQ-BK-1
- **Verification:** Full visual review + screen reader test
- **Status:** Planned

### REQ-AP-4: Seasonal Pricing

- **Intent:** Display transparent, season-based pricing
- **Applies To:** Visitor, Owner
- **Acceptance Criteria:**
  - Owner defines seasons in CMS: name (e.g., "Peak"), date range (e.g., Jul 1 - Aug 31), price per night per apartment, minimum stay (nights)
  - Optional per-stay cleaning fee per apartment
  - Tourist tax rate configurable in CMS (default per Croatian regulations), children under 12 exempt
  - Prices in EUR, displayed with locale-appropriate formatting (`Intl.NumberFormat`)
  - **Pricing table on apartment detail page:** season name, date range, price/night, min stay — sorted chronologically
  - Cleaning fee and tourist tax shown as separate line items below table
  - "All prices are estimates. Final price confirmed upon booking." disclaimer
  - German locale: total price including all mandatory fees shown prominently (PAngV compliance — German pricing transparency law)
  - If visitor selects dates in inquiry widget, itemized total computed (see REQ-BK-1)
  - **If no valid current/future season pricing exists:** hide "from €X/night" on listing card, show "Price on request" instead. Inquiry widget still usable (Quick Question tab).
  - **Publish validation warning** if next 12 months have pricing gaps
  - Owner can update prices from phone — simple numeric fields, no complex UI
- **Constraints:** CON-CMS, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-AP-1, REQ-CMS-1
- **Verification:** Test price computation across season boundaries
- **Status:** Implemented

### REQ-AP-5: Availability Calendar

- **Intent:** Let visitors see available dates instantly
- **Applies To:** Visitor, Owner
- **Acceptance Criteria:**
  - Visual month grid per apartment, 2 months on desktop, 1 on mobile
  - Booked dates: greyed out, not selectable, distinguished by color AND pattern (not color-only)
  - Available dates: clickable, highlight on hover/tap
  - Selecting check-in + check-out pre-fills inquiry form dates
  - Owner marks dates as booked from CMS (date range picker on phone)
  - Calendar updates without full page reload
  - **Failure mode — data fetch failure:** If availability API returns error, calendar renders all dates as "available" with subtle banner: "Live availability may be unavailable. Please confirm dates in your inquiry." Inquiry form remains usable.
  - **Failure mode — stale data:** Calendar data fetched client-side via uncached API (REQ-PERF-2). If JS fails to load or execute, static calendar shell shows "Enable JavaScript to check availability" with direct inquiry link.
- **Constraints:** CON-CMS, CON-PERF, CON-A11Y
- **Priority:** P0
- **Dependencies:** REQ-AP-1, REQ-CMS-1
- **Verification:** Test date selection, test across month boundaries
- **Status:** Planned

### REQ-AP-6: Photo Gallery

- **Intent:** Showcase apartment through stunning photography
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Detail page shows 4-6 photos in asymmetric grid (desktop) or horizontal scroll-snap (mobile)
  - "View all X photos" opens lightbox
  - Lightbox: full-screen, keyboard nav (arrow keys, Esc), swipe on mobile, counter, close button always visible
  - Blurhash placeholder crossfades to sharp image
  - Images served as AVIF/WebP with responsive srcset
  - Image reveal: clip-path uncover animation on scroll
  - Alt text per image per locale
  - Focus trapping in lightbox
  - **Failure mode — image load error:** If an image fails to load in gallery or lightbox, blurhash placeholder remains visible with alt text. "Image unavailable" indicator shown. Navigation skips failed images. No broken image icons.
- **Constraints:** CON-PERF, CON-A11Y, CON-MEDIA
- **Priority:** P0
- **Dependencies:** REQ-AP-1, REQ-CMS-2
- **Verification:** Lighthouse image audit + keyboard nav test
- **Status:** Planned

### REQ-AP-7: ICS Calendar Sync (Future)

- **Intent:** Auto-sync availability from Airbnb/Booking.com
- **Applies To:** Owner
- **Acceptance Criteria:**
  - Owner pastes ICS feed URL per apartment in admin
  - System fetches ICS periodically (every 6 hours via Cron Trigger)
  - Booked dates from ICS merged into availability calendar
  - Conflicts surfaced in admin
- **Constraints:** CON-PERF
- **Priority:** P2
- **Dependencies:** REQ-AP-5, REQ-CMS-1
- **Verification:** Test with real Airbnb ICS export
- **Status:** Planned

### REQ-AP-8: Apartment Comparison (Future)

- **Intent:** Side-by-side comparison when multiple apartments exist
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Comparison table showing key stats for 2-3 apartments
  - Available from listing page when 2+ apartments exist
- **Constraints:** CON-PERF
- **Priority:** P3
- **Dependencies:** REQ-AP-1, REQ-AP-2
- **Verification:** Visual review
- **Status:** Planned

## Out of Scope

- Real-time booking/payment processing
- Room type variants within a single apartment
- Dynamic pricing algorithms

## Domain Dependencies

- CMS (content schema, media library)
- Booking (inquiry widget, date selection flow)
- i18n (per-locale content and formatting)
- Visual Design (gallery animations, calendar styling)
- Social Proof (testimonials linked to apartments)
