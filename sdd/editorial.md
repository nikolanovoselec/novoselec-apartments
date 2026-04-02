# Editorial

Content pages that sell the destination and build emotional connection — Why Pašman, Getting Here, A Day on Pašman, local guide, host story, FAQ.

## Key Concepts

- **Local guide**: Curated recommendations — beaches, restaurants, activities, day trips
- **Arrival guide**: Complete transport info — ferry, airport, driving, parking
- **Storytelling**: "A Day on Pašman", seasonal atmosphere, daylight progression
- **Host story**: Personal connection to the place

## Requirements

### REQ-ED-1: "Why Pašman" Page

- **Intent:** Sell the destination emotionally — differentiate from saturated islands
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Sections: crystal-clear sea, quiet island rhythm, easy ferry access, authentic Dalmatia, olive groves, cycling/walking
  - Each section: poetic headline, 2-3 sentence description, full-bleed photo
  - Scroll-driven storytelling with pinned sections (desktop only)
  - Links to specific guide entries
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Visual review + toggle test
- **Status:** Planned

### REQ-ED-2: "Getting Here" Page

- **Intent:** Remove travel anxiety — make the journey feel easy and exciting
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Visual journey timeline: Airport -> Drive -> Ferry -> Island -> Property
  - Sections: by car + ferry (Biograd na Moru -> Tkon, 25 min), without car (bus + foot passenger), from Zadar Airport (ZAD), from Split Airport, **alternative via Ždrelac bridge to Ugljan + Zadar-Preko ferry** (convenient since apartments are in Ždrelac)
  - Ferry info: Jadrolinija link, frequency, cost, peak season advice
  - Parking info: at Biograd terminal, at property
  - "We can arrange airport transfer" with WhatsApp link
  - **Map:** Static image map showing route + "Open in Google Maps" / "Open in Apple Maps" deep links. No interactive map library at launch (CSP/performance/privacy concerns). Interactive map deferred to P2 if needed.
  - German version: exact distances, travel times, cost breakdowns
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Accuracy check against Jadrolinija schedules
- **Status:** Planned

### REQ-ED-3: "A Day on Pašman" Section

- **Intent:** Help visitor visualize their experience
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Timeline: morning coffee, beach swim, konoba lunch, sunset terrace, evening stars
  - Each entry: time, poetic description, supporting photo
  - Scroll-triggered fade-in per entry
  - Daylight color progression: morning azure -> midday brightness -> golden warmth -> evening navy
  - CMS-managed content and photos per locale
  - Appears on homepage (condensed) and as standalone section
  - Toggleable via section settings
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-VD-5
- **Verification:** Visual review
- **Status:** Planned

### REQ-ED-4: Local Guide

- **Intent:** Curated recommendations that build trust and drive SEO
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Pre-CMS state (current):** Standalone guide page (`/[locale]/vodic`) with `HeroSimple` header. Four categories displayed in alternating image+text layout: Beaches, Food & Drink, Activities, Day Trips. Each category: landscape photo (3:2 aspect), uppercase label, per-locale descriptive paragraph. Alternating layout: odd items show image left / text right, even items reverse (image right / text left on desktop). Single-column stacking on mobile. No filtering, no "coming soon" message — content is visible but static.
  - **With CMS (planned):** Categories expanded to: Beaches, Food & Drink, Restaurants & Konobas, Activities, Day Trips
  - **Food & Drink** is a featured category: local specialties (grilled fish, octopus peka, lamb, olive oil, island wine, figs), appetizing full-bleed food photography, where to buy/eat
  - Each entry: name, short description, photo, distance from property, category tags
  - Emdash collection — owner adds/edits from phone
  - Per-locale descriptions
  - Cards filterable by category
  - Map view with pins (P2)
  - SEO: each category generates a page
  - Toggleable via section settings
- **Constraints:** CON-CMS, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Visual review of guide page layout; later: create guide entries, verify rendering and filtering
- **Status:** Implemented

### REQ-ED-5: "About Your Hosts" Page

- **Intent:** Build trust through personal connection — this is a family, not an agency
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page (`/hr/o-nama`, `/de/ueber-uns`, `/sl/o-nas`, `/en/about-us`) AND condensed version on homepage
  - Photo(s) of the hosts (framed with Dalmatian arch clip-path mask)
  - Rich text story about their connection to Pašman, the property, the family
  - Warm, personal tone — "Our family has been on this island for generations"
  - CMS-managed per locale — each language can have different length/tone
  - Response time badge: "We usually respond within 2 hours"
  - WhatsApp link for direct contact
  - Toggleable via section settings (homepage appearance; standalone page always available)
- **Constraints:** CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5
- **Verification:** Visual review
- **Status:** Planned

### REQ-ED-6: "About Ždrelac" Section

- **Intent:** Introduce the village where the apartments are located
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Short paragraph (3-5 sentences) about Ždrelac: small village at the northern tip of Pašman, connected to Ugljan island by bridge, quiet and authentic, close to the sea
  - Highlights: bridge to Ugljan (alternative ferry route via Zadar-Preko), proximity to both coasts of the island, local character
  - Supporting photo(s) of the village
  - Appears on homepage (between "Why Pašman" and apartments) and on the "Why Pašman" page
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Visual review
- **Status:** Planned

### REQ-ED-7: FAQ

- **Intent:** Answer common questions, reduce non-converting inquiries
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Emdash collection: question + answer per locale, category tag, sort order
  - Categories: Booking & Payment, The Apartment, Getting There, The Island
  - Accordion UI with smooth animation
  - Contextual: apartment pages show apartment FAQs, transport page shows transport FAQs
  - Schema.org FAQPage markup
  - Owner manages from phone
  - Toggleable via section settings
- **Constraints:** CON-CMS, CON-I18N, CON-SEO
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Test accordion, verify structured data
- **Status:** Planned

## Out of Scope

- Blog with publishing dates
- Events calendar
- Restaurant/activity booking integration

## Domain Dependencies

- CMS (all content collections, section toggles)
- i18n (per-locale content)
- Visual Design (scroll animations, color progression)
- SEO (structured data, category pages)
