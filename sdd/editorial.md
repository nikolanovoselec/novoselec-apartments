# Editorial

Content pages that sell the destination and build emotional connection — Getting Here, local guide (with merged Ždrelac village content), food and drink, nature and activities, beaches, host story, FAQ. Why Pašman and About Ždrelac deprecated as standalone pages (content absorbed into homepage and local guide respectively).

## Key Concepts

- **Local guide**: Curated recommendations — beaches, restaurants, activities, day trips
- **Arrival guide**: Complete transport info — ferry, airport, driving, parking
- **Storytelling**: "A Day on Pašman", seasonal atmosphere, daylight progression
- **Host story**: Personal connection to the place
- **Editorial density**: 2-4 focused sections per page (consolidated from 5-6 for stronger narrative flow). Exceptions: Food & Drink uses a single unified section (description first, then two stacked photo collages scrolling in opposite directions); Nature & Activities uses 2 sections (Land + Sea) with love-letter tone.

## Requirements

### REQ-ED-1: "Why Pašman" Page

- **Intent:** Sell the destination emotionally — differentiate from saturated islands
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Sections: crystal-clear sea, quiet island rhythm, easy ferry access, authentic Dalmatia, olive groves, cycling/walking (original 6 topics; may be consolidated to 3-4 per editorial density principle)
  - Each section: poetic headline, 2-3 sentence description, full-bleed photo
  - Scroll-driven storytelling with pinned sections (desktop only)
  - Links to specific guide entries
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-PERF, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Visual review + toggle test
- **Status:** Deprecated — absorbed into homepage. Homepage already renders why-pasman content via `homepage/why-pasman` CMS section. Standalone page deleted. Revision 70.

### REQ-ED-2: "Getting Here" Page

- **Intent:** Remove travel anxiety — make the journey feel easy and exciting
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/dolazak` with `HeroSimple` photo-backed header (marina/harbor image). Content from dedicated `dolazak` CMS collection, sorted by `sort_order`. Multi-section editorial layout: each section renders title, then body text (rendered as HTML via `set:html`), then optional MiniCollage photo strip below the text. Alternating section backgrounds (`.section--alt`). Scroll-triggered reveal via `data-reveal`.
  - **Address + map links section:** Dark-background section at the bottom of the page with property address ("Fratarsko 3, 23271 Zdrelac, Croatia") displayed in serif font, plus two ghost-style buttons linking to Google Maps and Apple Maps with lat/lng coordinates. No static map image or interactive map — just deep-link buttons.
  - **Content sections (3 total, consolidated from 5+):** (1) by car + ferry — two routes: Biograd-Tkon Jadrolinija (25 min) or Zadar-Preko via Ugljan + Ždrelac bridge, (2) without car — Zadar Airport (ZAD), bus/taxi to city, Zadar-Preko ferry + local transport, bike rental from 10 EUR/day, (3) practical travel tips — ferry schedules, parking, peak season advice
  - Ferry info: Jadrolinija link, frequency, cost, peak season advice
  - Parking info: at Biograd terminal, at property
  - German version: exact distances, travel times, cost breakdowns
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Accuracy check against Jadrolinija schedules. Verify address section renders with map deep links.
- **Status:** Implemented

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
  - **Current state:** Standalone guide page (`/[locale]/vodic`) with `HeroSimple` photo-backed header (REQ-VD-12). **Editorial-only content model** — content comes from dedicated `vodic` CMS collection, sorted by `sort_order`. Each section renders title, then body text, then optional `MiniCollage` horizontal photo strip below the text. Scroll-triggered reveal on each section. Alternating section backgrounds (`.section--alt`).
  - **Content sections (8 total):** Sections 1-4 are merged Ždrelac village content (from deprecated REQ-ED-6): (1) the bridge — 210m span, 68m steel arch (2009), views of Zadar archipelago at sunset; (2) the village — stone centre, St. Luke's church (13th century), fishing harbour, lavender and rosemary; (3) the fishermen — night squid fishing with lamps, morning catch on the grill; (4) olive groves, pines and trails — 13 km recreational trail from Bokolj to Soline. Sections 5-8 are original guide content: (5) Pašman villages — 10 villages, each with character: Dobropoljana sunsets, Neviđane St. Michael statue, Tkon Benedictine monastery (1129), Kraj Franciscan monastery; (6) Ugljan villages — "Green Island" of olives, Preko with fortress, Kali fishing capital, Kukljica gastro hub; (7) Zadar — Sea Organ, Greeting to the Sun, Roman Forum, St. Donatus, cathedral, Hitchcock sunset quote; (8) Day trips — Kornati NP (89 islands, 40-50 EUR), Telašćica (salt lake Mir, 161m cliffs), Vransko jezero.
  - Three guide categories have standalone detail pages: Food & Drink (REQ-ED-8), Nature & Activities (REQ-ED-9), Beaches (REQ-ED-10). Linked from homepage experience triptych (REQ-SF-5). Local Guide itself is linked from the guide feature card above the triptych, not from within the triptych.
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-CMS, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Visual review of guide page layout; verify all 8 sections render correctly for all 4 locales
- **Status:** Implemented — editorial-only content model; expanded to 8 sections after Ždrelac merger (sections 1-4 from deprecated REQ-ED-6); dedicated `ec_vodic` CMS collection (migrated from `ec_editorial` page_key filter). All 4 locales populated.

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
- **Status:** Implemented — dedicated `ec_about` CMS collection. All 4 locales populated.

### REQ-ED-6: "About Ždrelac" Page

- **Intent:** Introduce the village where the apartments are located
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - ~~Standalone page at `/{locale}/zdrelac`~~ — **Deprecated.** Content merged into Local Guide page (REQ-ED-4) as sections 1-4 (the bridge, the village, the fishermen, olive groves). Standalone page deleted.
  - Content preserved in dedicated `ec_vodic` CMS collection with `sort_order` 1-4 (first sections on the guide page).
  - Homepage retains condensed Ždrelac introduction (feature image card linking to `/vodic`).
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4
- **Verification:** Verify Ždrelac content appears as first sections on guide page
- **Status:** Deprecated — merged into REQ-ED-4 (Local Guide). Revision 70.

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
- **Status:** Implemented

### REQ-ED-8: "Food & Drink" Detail Page

- **Intent:** Showcase local cuisine and dining options to help visitors plan meals and discover the island's food culture
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/hrana` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge** (cream fill `#F8F5EF`, organic bezier path, responsive height). The wave is part of HeroSimple and renders automatically.
  - **Single unified section** with one CMS entry providing title and body text. ~~4 content sections (consolidated from 5)~~ — replaced by a single love-letter description followed by two stacked photo collages.
  - CMS-only content model: page queries the first entry from the dedicated `hrana` CMS collection. No `sort_order` multi-entry model — a single entry provides all content. If CMS entry is missing, title falls back to locale-aware default; body is empty.
  - **Layout: description then collages.** The description section (title + body) renders first, directly after the hero. Below it, both photo collages are stacked together — first half scrolling left (default), second half scrolling right (`reverse` prop, REQ-VD-15), separated by a small gap. Bottom padding before the footer. Each collage renders only when its half contains more than 1 photo.
  - ~~Alternating layout: odd sections image-left/text-right, even sections reversed (desktop); single column on mobile~~ — replaced by description-then-collages layout.
  - ~~Images: 4:3 aspect, organic asymmetric border-radius (`20px 4px 20px 4px`) with subtle box-shadow, hover zoom (1.03x)~~ — images now displayed within MiniCollage strips (16px border-radius, 250px/350px height).
  - Scroll-triggered reveal via `data-reveal` on the description section
  - Hero image must be contextually appropriate (food/dining scene, not Santorini or tropical)
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5, REQ-VD-12, REQ-VD-15
- **Verification:** Visual review across all 4 locales. Verify wave renders at bottom of hero. Verify hero image is food-related. Verify description appears before both collages. Verify two collages scroll in opposite directions.
- **Status:** Implemented

### REQ-ED-9: "Nature & Activities" Detail Page

- **Intent:** Present outdoor activities and excursion options to help visitors plan active days on the islands
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/aktivnosti` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge**
  - Hero image must depict nature/outdoor activities, not food or beaches. Hero and OG image use a fixed R2 photo (cyclist on island path), not derived from CMS entry order.
  - 2 content sections (Land + Sea): (1) Land — hiking trails, Veliki Bokolj (274m) viewpoint, Pustograd fortress, cycling the Ždrelac bridge bike lane, 46 km two-island loop, ZZUUM e-bike tours; (2) Sea — Adriatic embrace, crystal coves, Kornati and Telašćica day trips, kayaking, SUP, snorkeling
  - Each section written as a love letter to island life, not an activity list; practical tips woven into emotional narrative
  - **CMS wiring:** Page queries the dedicated `aktivnosti` CMS collection, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries missing, no sections render.
  - Multi-section alternating layout: odd sections on default background, even sections on `.section--alt`. Each section renders title, then body text, then MiniCollage photo strip below the text. Scroll-triggered reveal via `data-reveal`.
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5, REQ-VD-12
- **Verification:** Visual review across all 4 locales. Verify wave renders at bottom of hero.
- **Status:** Implemented

### REQ-ED-10: "Beaches" Detail Page

- **Intent:** Guide visitors to the best swimming spots, from nearby coves to hidden beaches reachable by boat
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/plaze` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge**
  - Hero image must depict Croatian/Adriatic beach or coastline (not Santorini blue domes or tropical beaches). Hero and OG image use a fixed R2 photo (Galovac aerial — turquoise sea around Ugljan island), not derived from CMS entry order.
  - 4 content sections (consolidated from 5): (1) Ždrelac coves — Matlovac sandy beach with beach bar, Soline mineral-rich sand, pine forest microclimate, (2) Pašman beaches — Banj shallow water, Lokva under tamarisk in Neviđane, Mrljane with view of heart-shaped Galešnjak, (3) Ugljan beaches — Jaz Blue Flag in Preko, Sabuša in Kukljica, Mostir snorkeling, (4) hidden coves — kayak-access south side cliffs, Prtljug in Lukoran (40m pebble cove, no facilities)
  - Each section includes named beaches with distances from Ždrelac
  - **CMS wiring:** Page queries the dedicated `plaze` CMS collection, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries missing, no sections render.
  - Multi-section alternating layout: odd sections on default background, even sections on `.section--alt`. Each section renders title, then body text, then MiniCollage photo strip below the text. Scroll-triggered reveal via `data-reveal`.
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5, REQ-VD-12
- **Verification:** Visual review across all 4 locales. Verify wave renders at bottom of hero. Verify hero image is a Croatian beach/coast scene.
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
