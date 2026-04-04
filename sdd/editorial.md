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
- **Status:** Partial — Page exists at `/{locale}/zasto-pasman` with HeroSimple. CMS content model restructured: queries individual `editorial` entries filtered by `page_key === "why-pasman"`, sorted by `sort_order` (each entry = one content row with `title`, `body`, `image` fields). Alternating image+text row layout, same pattern as REQ-ED-8/ED-9/ED-10. Images rendered conditionally (only if CMS entry has `image` field). HR locale seeded with 4 sections (more, mir, blizina, autenticnost). DE/SL/EN not yet seeded. Missing: scroll-driven pinned sections, full-bleed photos per section, section toggles, links to guide entries.

### REQ-ED-2: "Getting Here" Page

- **Intent:** Remove travel anxiety — make the journey feel easy and exciting
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/dolazak` with `HeroSimple` photo-backed header (marina/harbor image). Content model restructured from single CMS entry with `sections_json` to individual `editorial` entries filtered by `page_key === "dolazak"`, sorted by `sort_order` — same pattern as all other editorial pages (REQ-ED-1, REQ-ED-8, REQ-ED-9, REQ-ED-10). Each entry renders as one content row with `title`, `body` (rendered as HTML via `set:html`), and optional `image`. Alternating layout: odd rows image-left/text-right, even rows reversed. Single column on mobile.
  - **Address + map links section:** Dark-background section at the bottom of the page with property address ("Fratarsko 3, 23271 Zdrelac, Croatia") displayed in serif font, plus two ghost-style buttons linking to Google Maps and Apple Maps with lat/lng coordinates. No static map image or interactive map — just deep-link buttons.
  - **Planned content sections:** by car + ferry (Biograd na Moru -> Tkon, 25 min), without car (bus + foot passenger), from Zadar Airport (ZAD), from Split Airport, **alternative via Ždrelac bridge to Ugljan + Zadar-Preko ferry** (convenient since apartments are in Ždrelac)
  - Ferry info: Jadrolinija link, frequency, cost, peak season advice
  - Parking info: at Biograd terminal, at property
  - German version: exact distances, travel times, cost breakdowns
  - CMS-managed per locale
  - Toggleable via section settings
- **Constraints:** CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-5, REQ-I18N-4
- **Verification:** Accuracy check against Jadrolinija schedules. Verify address section renders with map deep links.
- **Status:** Partial — Page restructured to editorial entry model (individual CMS entries per section). Address + map links section implemented with Google Maps and Apple Maps deep links. Translation key `gettingHere.ourAddress` added in all 4 locales. Missing: CMS editorial entries not yet seeded for `dolazak` page_key (page renders empty content sections until seeded), visual journey timeline, "arrange airport transfer" WhatsApp link, section toggles.

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
  - **Current state:** Standalone guide page (`/[locale]/vodic`) with `HeroSimple` photo-backed header (REQ-VD-12). Card-overlay grid layout: guide categories and CMS editorial entries (`page_key === "vodic"`) merged into unified card array. Each card displays full-bleed image background with gradient overlay containing title label and description text. Responsive grid: 1-column on mobile, 2-column at 640px+, 3-column at 1024px+. Cards have 16px border-radius, 4:3 aspect ratio, hover zoom (1.06x) on images. No alternating row layout — all entries rendered as equal-weight visual cards. No filtering. Three categories expanded to standalone detail pages: Food & Drink (REQ-ED-8), Nature & Activities (REQ-ED-9), Beaches (REQ-ED-10). Linked from homepage experience triptych as 4th card (REQ-SF-5).
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
- **Status:** Partial — Page exists at `/{locale}/o-nama` with HeroSimple, CMS-only content via `editorial` collection with `page_key === "about"` (hardcoded fallback story removed; empty string when CMS entry missing). No CTA/link to apartments at bottom of page (removed per owner decision). HR locale seeded with host story entry. DE/SL/EN not yet seeded. Missing: host photo with arch clip-path, response time badge, WhatsApp link, homepage condensed version, section toggle.

### REQ-ED-6: "About Ždrelac" Page

- **Intent:** Introduce the village where the apartments are located
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - **Current implementation:** Standalone page at `/{locale}/zdrelac` with full-screen hero (70vh, min 400px) using aerial village photo with gradient overlay (transparent 30% to navy 80%), village name as display heading, and introductory paragraph at 80% white opacity. Hero includes a bottom wave divider (inline SVG with organic bezier path, cream fill `#F8F5EF`, responsive height `clamp(40px, 6vw, 80px)`, `aria-hidden="true"`) for organic transition into page content (REQ-VD-9). Below the hero, content sections in alternating image+text row layout. Each row: 2-column grid on desktop (1fr + 1fr), single column on mobile. Odd rows show image left / text right; even rows reverse. Images have 16px border-radius, 4:3 aspect ratio, subtle hover zoom (1.03x). CTA button at bottom links to apartments listing. Scroll-triggered fade-up reveal on each section. Alternating section backgrounds (`.section--alt`).
  - **CMS wiring:** Page queries the `editorial` CMS collection filtered by `page_key === "zdrelac"`, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries are missing, page renders with empty content.
  - **Homepage appearance (planned):** Brief Ždrelac introduction on homepage between "Why Pašman" and apartments sections (condensed version of standalone page)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-I18N-4
- **Verification:** Visual review across all 4 locales; verify CMS override when editorial entries with page_key "zdrelac" exist
- **Status:** Partial — CMS-only content model (hardcoded fallbacks removed). Page renders CMS editorial entries only; empty if unseeded.

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
- **Status:** Partial — Page exists at `/{locale}/faq` with HeroSimple, hardcoded FAQs in all 4 locales, CMS override via `faqs` collection sorted by `sort_order`. Accordion UI uses native `<details>/<summary>` elements. FAQPage schema.org JSON-LD applied. Missing: category filtering, contextual FAQs on apartment/transport pages, section toggle. Accordion animation is browser-native (no smooth custom animation).

### REQ-ED-8: "Food & Drink" Detail Page

- **Intent:** Showcase local cuisine and dining options to help visitors plan meals and discover the island's food culture
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/hrana` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge** (cream fill `#F8F5EF`, organic bezier path, responsive height). The wave is part of HeroSimple and renders automatically.
  - 5 content sections in alternating image+text row layout: konobas on Pasman, restaurants on Ugljan, Dalmatian specialties, local products (olive oil, wine, figs), markets and shopping
  - Each section: named restaurants/konobas with distance from Zdrelac in km (Konoba Bokolj 0-1 km, Lanterna 10-12 km, Dardin 8-10 km, Intrada 10-12 km)
  - Practical info: Studenac for basics, larger shops in Preko/Kali, Zadar for full shopping
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
- **Status:** Partial — CMS-only content model (hardcoded fallbacks removed). Page queries `editorial` collection by `page_key === "hrana"`. Inline SVG wave in hero markup. HR locale seeded with 5 sections (konobe, specijaliteti, ulje, ritual, trznice). Pending: DE/SL/EN CMS seeding, live site confirmation.

### REQ-ED-9: "Nature & Activities" Detail Page

- **Intent:** Present outdoor activities and excursion options to help visitors plan active days on the islands
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/aktivnosti` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge**
  - Hero image must depict nature/outdoor activities, not food or beaches
  - 6 content sections: walks and viewpoints (Bokolj hill 8-10 km), cycling (25-40 km loop route), Kornati National Park (departures 10-15 km), Telascica Nature Park, water sports (kayak, SUP, snorkeling, diving), history and culture (St. Michael's Fortress 12-14 km, Galevac monastery)
  - Each section includes distances from Zdrelac and practical tips
  - **CMS wiring:** Page queries the `editorial` collection filtered by `page_key === "aktivnosti"`, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries missing, no sections render.
  - Same alternating row layout, image styling, and reveal animations as REQ-ED-8
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5, REQ-VD-12
- **Verification:** Visual review across all 4 locales. Verify wave renders at bottom of hero.
- **Status:** Partial — CMS-only content model (hardcoded fallbacks removed). Page queries `editorial` collection by `page_key === "aktivnosti"`. Inline SVG wave in hero markup. HR locale seeded with 6 sections (setnje, biciklizam, kornati, telascica, vodeni, povijest). Pending: DE/SL/EN CMS seeding, live site confirmation.

### REQ-ED-10: "Beaches" Detail Page

- **Intent:** Guide visitors to the best swimming spots, from nearby coves to hidden beaches reachable by boat
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/plaze` with `HeroSimple` component (REQ-VD-12) — photo-backed hero with gradient overlay, locale-aware title, introductory paragraph, and **wave SVG at the bottom edge**
  - Hero image must depict Croatian/Adriatic beach or coastline (not Santorini blue domes or tropical beaches)
  - 5 content sections organized by proximity: Zdrelac coves (0-2 km, Mali Zdrelac bay, bridge area), northern Pasman beaches (5-15 km, Matlovac, Soline), Ugljan beaches (10-20 km, Jaz, Kali, Muline), hidden coves (by boat/kayak), practical beach day tips (parking, shade, maestral wind patterns)
  - Each section includes named beaches with distances from Zdrelac
  - **CMS wiring:** Page queries the `editorial` collection filtered by `page_key === "plaze"`, sorted by `sort_order`. CMS-only content model — no hardcoded fallback. If CMS entries missing, no sections render.
  - Same alternating row layout, image styling, and reveal animations as REQ-ED-8
  - Linked from homepage triptych (REQ-SF-5)
- **Constraints:** CON-I18N, CON-PERF
- **Priority:** P1
- **Dependencies:** REQ-ED-4, REQ-SF-5, REQ-VD-12
- **Verification:** Visual review across all 4 locales. Verify wave renders at bottom of hero. Verify hero image is a Croatian beach/coast scene.
- **Status:** Partial — CMS-only content model (hardcoded fallbacks removed). Page queries `editorial` collection by `page_key === "plaze"`. Inline SVG wave in hero markup. Real Croatian beach hero image from `/photos/` directory. HR locale seeded with 5 sections (zdrelac, pasman, ugljan, skrivene, savjeti). Pending: DE/SL/EN CMS seeding, live site confirmation.

## Out of Scope

- Blog with publishing dates
- Events calendar
- Restaurant/activity booking integration

## Domain Dependencies

- CMS (all content collections, section toggles)
- i18n (per-locale content)
- Visual Design (scroll animations, color progression)
- SEO (structured data, category pages)
