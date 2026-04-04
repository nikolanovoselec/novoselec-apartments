# Editorial

Content pages that sell the destination and build emotional connection — Why Pašman, Getting Here, A Day on Pašman, local guide, host story, FAQ.

## Key Concepts

- **Local guide**: Curated recommendations — beaches, restaurants, activities, day trips
- **Arrival guide**: Complete transport info — ferry, airport, driving, parking
- **Storytelling**: "A Day on Pašman", seasonal atmosphere, daylight progression
- **Host story**: Personal connection to the place
- **Editorial density**: 3-4 focused sections per page (consolidated from 5-6 for stronger narrative flow)

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
- **Status:** Implemented

### REQ-ED-2: "Getting Here" Page

- **Intent:** Remove travel anxiety — make the journey feel easy and exciting
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/dolazak` with `HeroSimple` photo-backed header (marina/harbor image). Content model restructured from single CMS entry with `sections_json` to individual `editorial` entries filtered by `page_key === "dolazak"`, sorted by `sort_order` — same pattern as all other editorial pages (REQ-ED-1, REQ-ED-8, REQ-ED-9, REQ-ED-10). Each entry renders as one content row with `title`, `body` (rendered as HTML via `set:html`), and optional `image`. Alternating layout: odd rows image-left/text-right, even rows reversed. Single column on mobile.
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
  - **Current state:** Standalone guide page (`/[locale]/vodic`) with `HeroSimple` photo-backed header (REQ-VD-12). **Editorial-only content model** — the `guide` CMS collection is no longer used; all content comes from `editorial` entries with `page_key === "vodic"`, sorted by `sort_order`. Each section renders as a titled content block with optional photo gallery displayed via `MiniCollage` horizontal scroll strip. Scroll-triggered reveal on each section. Alternating section backgrounds (`.section--alt`).
  - **Content sections (4 total):** (1) Pašman villages — 10 villages, each with character: Ždrelac fishing heritage, Dobropoljana sunsets, Neviđane St. Michael statue, Tkon Benedictine monastery (1129), Kraj Franciscan monastery; (2) Ugljan villages — "Green Island" of olives, Preko with fortress, Kali fishing capital, Kukljica gastro hub; (3) Zadar — Sea Organ, Greeting to the Sun, Roman Forum, St. Donatus, cathedral, Hitchcock sunset quote; (4) Day trips — Kornati NP (89 islands, 40-50 EUR), Telašćica (salt lake Mir, 161m cliffs), Vransko jezero.
  - Three guide categories have standalone detail pages: Food & Drink (REQ-ED-8), Nature & Activities (REQ-ED-9), Beaches (REQ-ED-10). Linked from homepage experience triptych as 4th card (REQ-SF-5).
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-CMS, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Visual review of guide page layout; verify editorial entries render correctly for all 4 locales
- **Status:** Implemented — editorial-only content model (guide collection removed); 4 sections including Zadar city guide; all 4 locales populated (hr/en/de/sl)

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
- **Status:** Implemented

### REQ-ED-6: "About Ždrelac" Page

- **Intent:** Introduce the village where the apartments are located
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/zdrelac` with full-screen hero (70vh, min 400px) using aerial village photo with gradient overlay (transparent 30% to navy 80%), village name as display heading, and introductory paragraph at 80% white opacity. Hero includes a bottom wave divider (inline SVG with organic bezier path, cream fill `#F8F5EF`, responsive height `clamp(40px, 6vw, 80px)`, `aria-hidden="true"`) for organic transition into page content (REQ-VD-9). Below the hero, content sections in alternating image+text row layout. Each row: 2-column grid on desktop (1fr + 1fr), single column on mobile. Odd rows show image left / text right; even rows reverse. Images rendered conditionally (only if CMS entry has `image` field) with 16px border-radius, 4:3 aspect ratio, subtle hover zoom (1.03x). CTA button at bottom links to apartments listing. Scroll-triggered fade-up reveal on each section. Alternating section backgrounds (`.section--alt`).
  - **Content sections (4 total):** (1) the bridge — 210m span, 68m steel arch (2009), views of Zadar archipelago at sunset, (2) the village — stone centre, St. Luke's church (13th century), fishing harbour, lavender and rosemary, (3) the fishermen — night squid fishing with lamps, morning catch on the grill, fish straight from the boat, (4) olive groves, pines and trails — 13 km recreational trail from Bokolj to Soline, Mediterranean vegetation
  - **CMS wiring:** Page queries the `editorial` CMS collection filtered by `page_key === "zdrelac"`, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries are missing, page renders with empty content.
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
- **Status:** Implemented

### REQ-ED-8: "Food & Drink" Detail Page

- **Intent:** Showcase local cuisine and dining options to help visitors plan meals and discover the island's food culture
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/hrana` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge** (cream fill `#F8F5EF`, organic bezier path, responsive height). The wave is part of HeroSimple and renders automatically.
  - 4 content sections (consolidated from 5): (1) grilled fish and konoba culture — Mureta, Udica, Kiss with distances, (2) olive oil — Ugljan's 200,000 trees, family producers, tasting, (3) dining as ritual — multi-course Dalmatian meal progression, pošip wine, (4) markets and provisions — Kali fish market, Zadar Ribarnica, island shops, Hajduk ice cream in Kukljica
  - Each section includes named restaurants/producers with contextual details
  - CMS-only content model: page queries `editorial` collection filtered by `page_key === "hrana"`, sorted by `sort_order`. No hardcoded fallback — if CMS entries missing, no sections render.
  - Alternating layout: odd sections image-left/text-right, even sections reversed (desktop); single column on mobile
  - Images: 4:3 aspect, organic asymmetric border-radius (`20px 4px 20px 4px`) with subtle box-shadow, hover zoom (1.03x)
  - Scroll-triggered reveal via `data-reveal`
  - Hero image must be contextually appropriate (food/dining scene, not Santorini or tropical)
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5, REQ-VD-12
- **Verification:** Visual review across all 4 locales. Verify wave renders at bottom of hero. Verify hero image is food-related.
- **Status:** Implemented

### REQ-ED-9: "Nature & Activities" Detail Page

- **Intent:** Present outdoor activities and excursion options to help visitors plan active days on the islands
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/aktivnosti` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge**
  - Hero image must depict nature/outdoor activities, not food or beaches
  - 4 content sections (consolidated from 6): (1) trails and viewpoints — Veliki Bokolj (274m) with panoramic telescope, Pustograd 6th-century fortress, (2) cycling — Ždrelac bridge bike lane, 46 km two-island loop, Staza 7/8, ZZUUM e-bike tours, rental from 10 EUR/day, (3) Kornati and Telašćica — 89 islands, salt lake Mir, 161m cliffs, day trips from 40-50 EUR, (4) water sports — kayaking to hidden coves, SUP on calm mornings, snorkeling/diving, clean sea currents
  - Each section includes distances from Ždrelac and practical tips
  - **CMS wiring:** Page queries the `editorial` collection filtered by `page_key === "aktivnosti"`, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries missing, no sections render.
  - Same alternating row layout, image styling, and reveal animations as REQ-ED-8
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
  - Hero image must depict Croatian/Adriatic beach or coastline (not Santorini blue domes or tropical beaches)
  - 4 content sections (consolidated from 5): (1) Ždrelac coves — Matlovac sandy beach with beach bar, Soline mineral-rich sand, pine forest microclimate, (2) Pašman beaches — Banj shallow water, Lokva under tamarisk in Neviđane, Mrljane with view of heart-shaped Galešnjak, (3) Ugljan beaches — Jaz Blue Flag in Preko, Sabuša in Kukljica, Mostir snorkeling, (4) hidden coves — kayak-access south side cliffs, Prtljug in Lukoran (40m pebble cove, no facilities)
  - Each section includes named beaches with distances from Ždrelac
  - **CMS wiring:** Page queries the `editorial` collection filtered by `page_key === "plaze"`, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries missing, no sections render.
  - Same alternating row layout, image styling, and reveal animations as REQ-ED-8
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
