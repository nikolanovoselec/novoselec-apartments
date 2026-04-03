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
  - **Pre-CMS state (current):** Standalone guide page (`/[locale]/vodic`) with `HeroSimple` photo-backed header (REQ-VD-12). Four categories displayed in alternating image+text layout: Beaches, Food & Drink, Activities, Day Trips. Each category: landscape photo (3:2 aspect), uppercase label, per-locale descriptive paragraph. Alternating layout: odd items show image left / text right, even items reverse (image right / text left on desktop). Single-column stacking on mobile. No filtering, no "coming soon" message — content is visible but static. Three categories expanded to standalone detail pages: Food & Drink (REQ-ED-8), Nature & Activities (REQ-ED-9), Beaches (REQ-ED-10).
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

### REQ-ED-6: "About Ždrelac" Page

- **Intent:** Introduce the village where the apartments are located
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/zdrelac` with full-screen hero (70vh, min 400px) using aerial village photo with gradient overlay (transparent 30% to navy 80%), village name as display heading, and introductory paragraph at 80% white opacity. Below the hero, content sections in alternating image+text row layout. Each row: 2-column grid on desktop (1fr + 1fr), single column on mobile. Odd rows show image left / text right; even rows reverse. Images have 16px border-radius, 4:3 aspect ratio, subtle hover zoom (1.03x). CTA button at bottom links to apartments listing. Scroll-triggered fade-up reveal on each section. Alternating section backgrounds (`.section--alt`).
  - **CMS wiring:** Page queries the `editorial` CMS collection filtered by `page_key === "zdrelac"`, sorted by `sort_order`. When CMS entries exist, they replace the hardcoded fallback sections. When no CMS entries exist, hardcoded per-locale content is rendered. Intro paragraph is suppressed when CMS content is active.
  - **Croatian fallback content (6 sections):** Bridge between two islands (210m bridge, Zadar-Preko ferry access), Veliki Bokolj peak (274m, panoramic viewpoint with telescope), Benedictine monastery Cokovac (12th century, above Tkon, plus Pustograd fortress ruins), centuries-old olive groves (OPG direct sales), St. Michael's Fortress on Ugljan (6th century, 265m, 200-island view), Galovac islet and Ugljan caves (Franciscan monastery, Zeljina/Boskova/Vela/Mala caves, 100km+ trails)
  - **DE/SL/EN fallback content (4 sections):** Bridge access, hidden beaches, Dalmatian life, olive groves (shorter, general descriptions)
  - **Homepage appearance (planned):** Brief Ždrelac introduction on homepage between "Why Pašman" and apartments sections (condensed version of standalone page)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-I18N-4
- **Verification:** Visual review across all 4 locales; verify CMS override when editorial entries with page_key "zdrelac" exist
- **Status:** Implemented

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

### REQ-ED-8: "Food & Drink" Detail Page

- **Intent:** Showcase local cuisine and dining options to help visitors plan meals and discover the island's food culture
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/hrana` with 60vh hero image, gradient overlay, locale-aware title and introductory paragraph
  - 5 content sections in alternating image+text row layout: konobas on Pasman, restaurants on Ugljan, Dalmatian specialties, local products (olive oil, wine, figs), markets and shopping
  - Each section: named restaurants/konobas with distance from Zdrelac in km (Konoba Bokolj 0-1 km, Lanterna 10-12 km, Dardin 8-10 km, Intrada 10-12 km)
  - Practical info: Studenac for basics, larger shops in Preko/Kali, Zadar for full shopping
  - All content hardcoded per locale (4 languages) with culturally adapted tone
  - Alternating layout: odd sections image-left/text-right, even sections reversed (desktop); single column on mobile
  - Images: 4:3 aspect, 16px border-radius, hover zoom (1.03x)
  - Scroll-triggered reveal via `data-reveal`
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5
- **Verification:** Visual review across all 4 locales
- **Status:** Implemented

### REQ-ED-9: "Nature & Activities" Detail Page

- **Intent:** Present outdoor activities and excursion options to help visitors plan active days on the islands
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/aktivnosti` with 60vh hero image, gradient overlay, locale-aware title and introductory paragraph
  - 6 content sections: walks and viewpoints (Bokolj hill 8-10 km), cycling (25-40 km loop route), Kornati National Park (departures 10-15 km), Telascica Nature Park, water sports (kayak, SUP, snorkeling, diving), history and culture (St. Michael's Fortress 12-14 km, Galevac monastery)
  - Each section includes distances from Zdrelac and practical tips
  - All content hardcoded per locale (4 languages) with culturally adapted tone
  - Same alternating row layout, image styling, and reveal animations as REQ-ED-8
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5
- **Verification:** Visual review across all 4 locales
- **Status:** Implemented

### REQ-ED-10: "Beaches" Detail Page

- **Intent:** Guide visitors to the best swimming spots, from nearby coves to hidden beaches reachable by boat
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/plaze` with 60vh hero image, gradient overlay, locale-aware title and introductory paragraph
  - 5 content sections organized by proximity: Zdrelac coves (0-2 km, Mali Zdrelac bay, bridge area), northern Pasman beaches (5-15 km, Matlovac, Soline), Ugljan beaches (10-20 km, Jaz, Kali, Muline), hidden coves (by boat/kayak), practical beach day tips (parking, shade, maestral wind patterns)
  - Each section includes named beaches with distances from Zdrelac
  - All content hardcoded per locale (4 languages) with culturally adapted tone
  - Same alternating row layout, image styling, and reveal animations as REQ-ED-8
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5
- **Verification:** Visual review across all 4 locales
- **Status:** Implemented

## Out of Scope

- Blog with publishing dates
- Events calendar
- Restaurant/activity booking integration

## Domain Dependencies

- CMS (all content collections, section toggles)
- i18n (per-locale content)
- Visual Design (scroll animations, color progression)
- SEO (structured data, category pages)
