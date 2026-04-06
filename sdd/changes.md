# Changelog

## 2026-04-06 - security.txt moved to Cloudflare dashboard (7f69fc2)

Commit 7f69fc2 removed the static `public/.well-known/security.txt` file from the repository. The security.txt content is now managed via the Cloudflare dashboard rather than deployed as a static file. The endpoint `/.well-known/security.txt` remains accessible to visitors; only the management method changed.

### Requirements updated
- **REQ-TC-8** (Security Contact Disclosure): Acceptance criteria updated — file is now served via Cloudflare dashboard configuration, not as a static file in the repo.

### Constraints updated
- **CON-SEC**: Clarified security.txt is managed via Cloudflare dashboard.

### Glossary terms updated
- **security.txt**: Added note that it is managed via Cloudflare dashboard, not a static repo file.

---

## 2026-04-06 - Security hardening, llms.txt, security.txt, static caching headers (67083a1)

Commit 67083a1 added three new static files and hardened security headers. (1) `public/.well-known/security.txt` — RFC 9116 security contact disclosure with mailto, expiry, preferred languages, and canonical URL. (2) `public/llms.txt` — structured site summary for AI assistants covering property details, apartment specs, booking method, key page URLs, and guidance for accurate AI responses. (3) `public/_headers` — Cloudflare static headers file defining Cache-Control tiers for content-hashed Astro assets (immutable, 1 year), fonts (30 days), R2 image API (1 day + 7-day stale-while-revalidate), favicons/static images (30 days), and HTML pages (1 hour + 1-day stale-while-revalidate). (4) `src/middleware/headers.ts` updated with three new security headers: HSTS (max-age=31536000, includeSubDomains, preload), Cross-Origin-Opener-Policy (same-origin), Cross-Origin-Resource-Policy (same-origin). Permissions-Policy expanded from 3 restrictions (camera, microphone, geolocation) to 9 (added accelerometer, gyroscope, magnetometer, midi, payment, usb).

### Requirements added
- **REQ-TC-8** (Security Contact Disclosure): New P2 requirement for `/.well-known/security.txt` per RFC 9116. Status: Implemented.
- **REQ-SEO-9** (LLM Discoverability): New P2 requirement for `/llms.txt` AI-readable site summary. Status: Implemented.

### Requirements updated
- **REQ-TC-6** (Security Headers): Added HSTS, COOP, CORP to acceptance criteria. Expanded Permissions-Policy from 3 to 9 restricted APIs.
- **REQ-PERF-2** (Edge Caching): Added static asset caching via `_headers` file to acceptance criteria. Status changed from Planned to Partial (static caching implemented, dynamic edge caching still planned).

### Constraints updated
- **CON-SEC**: Added HSTS, COOP, CORP to header list. Expanded Permissions-Policy detail. Added security.txt mention.

### Glossary terms added
- security.txt, llms.txt, HSTS, COOP, CORP

---

## 2026-04-06 - FAQ answers render as HTML, Schema.org strips HTML (45de3f3)

Commit 45de3f3 fixed two rendering issues introduced when inline `<a>` links were added to FAQ answers in 76ff40a: (1) FAQ answers now render as HTML via Astro's `set:html` directive instead of plain text interpolation, so inline links and formatting actually appear as clickable elements in the browser; (2) Schema.org FAQPage structured data strips HTML tags from answer text before JSON-LD emission, ensuring search engines receive clean plain text in `acceptedAnswer.text` rather than raw HTML markup.

### Requirements updated
- **REQ-ED-7** (FAQ): Two new acceptance criteria added — answers rendered as HTML to support inline links; Schema.org answer text HTML-stripped for structured data. Status updated to reference 45de3f3.
- **REQ-SEO-1** (Schema.org): FAQPage acceptance criterion updated to note HTML stripping. Status updated to reference 45de3f3.

---

## 2026-04-06 - FAQ fallback refinements: key safe terminology, locale links, pets with notice (76ff40a)

Commit 76ff40a refined FAQ fallback content across all 4 locales. Four behavioral changes: (1) "lockbox" terminology replaced with "key safe" in all locales (EN: key safe, HR: sef za ključeve, DE: Schlüsselsafe, SL: sef za ključe); (2) directions answer now includes inline `<a>` link to `/{locale}/dolazak` (Getting Here page) instead of plain text reference; (3) pets answer changed from vague "depending on the situation" to explicit "yes, with prior notice — specify animal in inquiry"; (4) house rules answer reframed from "no cleaning service or hotel staff" to "not a hotel, no daily cleaning — apartment handed over clean and ready." Check-in answer tone shifted from "nobody will bother you" to warm availability ("we're a phone call away if you need anything").

### Requirements updated
- **REQ-ED-7** (FAQ): Acceptance criteria updated — lockbox changed to key safe, pets changed from "ask when inquiring" to "yes with prior notice", house rules changed from "no cleaning service, leave as found" to "not a hotel, no daily cleaning, leave tidy", directions answer now includes inline HTML link to dolazak page. Tone description updated from "no formalities, nobody will bother you" to "personal care, warm availability." Status updated to reference 76ff40a and document all terminology/behavioral changes.

---

## 2026-04-06 - Complete FAQ rewrite: family operation, no hotel language (f87bc62)

Commit f87bc62 rewrote all FAQ content. Deleted all 38 previous CMS entries (wrong locales, hotel-style language). Rebuilt 32 entries (8 per locale) reflecting the reality of a family-run operation: self-check-in via PIN code lockbox (no reception, no formalities), pets by arrangement, combined AC/Wi-Fi/parking question, local knowledge (groceries + fish market in Kali, beach types). New topics: car needed (bus/bike alternatives, 10 EUR/day rental), beaches (sand vs pebbles, Matlovac named), groceries and fresh fish. Removed: separate AC, parking, Wi-Fi, and check-in/check-out time questions. Hardcoded fallbacks updated to match.

### Requirements updated
- **REQ-ED-7** (FAQ): Acceptance criteria updated — fallback category distribution changed from getting-there (2), apartment (3), booking (2), house-rules (1) to getting-there (4), booking (2), apartment (1), house-rules (1). Topic list rewritten to reflect actual questions. Status updated to document the complete rewrite, new question topics, and removed questions.

---

## 2026-04-06 - House rules FAQ entry + category-based anchor (d579b1f)

Commit d579b1f added a "house rules" FAQ entry in all 4 locales (HR: "Kućni red", DE: "Hausordnung", SL: "Hišni red", EN: "House rules") with category `house-rules`. Message: no cleaning service, leave apartment as found. Anchor id on `<details>` elements is now derived from `faq.category === "house-rules"` rather than last-item index, making the anchor stable regardless of entry order. An inline script auto-opens and scrolls to the element when `window.location.hash === "#house-rules"` on page load.

### Requirements updated
- **REQ-ED-7** (FAQ): Acceptance criteria updated — categories corrected from aspirational names ("Booking & Payment", "The Apartment", "Getting There", "The Island") to actual code values (`getting-there`, `apartment`, `booking`, `house-rules`). Added AC for 8 fallback entries per locale, `#house-rules` category-based anchor with auto-open/scroll behavior. Verification updated to include anchor test. Status updated to reflect house-rules entry and stable anchor logic.

---

## 2026-04-06 - Swiss German ss normalization extended to seed data (9dbd965)

Commit 9dbd965 replaced remaining `ß` with `ss` in seed content files (`apartments.json`, `testimonials.json`). Three German strings affected: Tramuntana shortDescription, valueProp, and one testimonial quote. Completes the Swiss German orthography normalization started in 63ce6b7 (which covered translations and `.astro` fallbacks).

### Requirements updated
- **REQ-I18N-6** (Cultural Content Adaptation): Status clarified — `ss` normalization now explicitly covers seed data alongside translations and `.astro` fallbacks.

---

## 2026-04-06 - Footer wave clearance added to about page (ee1f014)

Commit ee1f014 added `section--footer-clear` to the about page (`o-nama.astro`). The about page has a single content section between the hero and footer, making it vulnerable to footer wave overlap on the host story text.

### Requirements updated
- **REQ-VD-9** (Wave Section Dividers): `section--footer-clear` page list updated — added `o-nama` (about). Clarified that the class applies not only to CTA/interactive sections but also to shallow single-section layouts where the footer wave would otherwise encroach on content. Removed `o-nama` from the editorial/standard-padding exemption list.

### Glossary updated
- **section--footer-clear**: Page list updated to include `o-nama`. Description broadened from "CTA or interactive element" to also cover "shallow content layout" near footer wave.

---

## 2026-04-06 - CSS class rename, dead cta.fromPrice removed, German ss orthography (63ce6b7)

Commit 63ce6b7 made three cleanup changes: (1) renamed StickyMobileCTA CSS classes from `__price`/`__action` to `__primary`/`__secondary` to match their actual content (no longer price-related); (2) deleted the dead `cta.fromPrice` translation key from all 4 locale JSON files (key was no longer referenced by any component since 19bc983); (3) replaced all German `ß` (sharp s) with `ss` across translation files and hardcoded `.astro` page fallbacks — adopting Swiss German orthography consistent with the `.ch` domain.

### Requirements updated
- **REQ-I18N-6** (Cultural Content Adaptation): AC updated — added Swiss German orthography rule (`ss` instead of `ß`). Status updated to reflect `ss` normalization across all German content.

---

## 2026-04-06 - Sticky CTA: price removed, replaced with two text labels (19bc983)

Commit 19bc983 removed the price display from `StickyMobileCTA`. The `cta.fromPrice` interpolation and the hardcoded `priceText` variable were deleted. The two spans now render `cta.checkAvailability` (primary) and `homepage.cta.title` (secondary) — both purely text labels with no price.

### Requirements updated
- **REQ-SF-7** (Sticky Mobile CTA): AC rewritten — price span removed entirely. Bar now shows two text labels: `cta.checkAvailability` (e.g., "Check availability") as primary and `homepage.cta.title` (e.g., "Get in touch") as secondary. The `cta.fromPrice` translation key is no longer used by this component.

---

## 2026-04-06 - Spec validation: fix stale MiniCollage speed claim (49c03ec)

Post-commit spec review against code found one inaccurate acceptance criterion.

### Requirements updated
- **REQ-AP-3** (Apartment Detail Page): AC item 2 corrected — MiniCollage speed is not a uniform 35s; it scales dynamically with gallery size (minimum 35s). Updated wording from "uniform 35s speed" to "speed scales with gallery size, minimum 35s".

---

## 2026-04-06 - Price format: tilde replaced with natural language per locale (6a3c6b8)

Commit 6a3c6b8 replaced the `~` tilde prefix in the sticky mobile CTA price label with locale-appropriate natural language words: EN "around", DE "ca.", HR "oko", SL "ok.". The `cta.fromPrice` translation key in all 4 locale JSON files was updated. No code logic changed — only translation strings.

### Requirements updated
- **REQ-SF-7** (Sticky Mobile CTA): AC updated — price label no longer uses tilde (`~`) prefix. Each locale now renders its own natural approximation word via the `cta.fromPrice` translation key with `{price}` interpolation.

---

## 2026-04-06 - Spec sync: tilde price format, remove inquiry observer AC, fix detail CTA link (4f784d4)

Post-commit spec review found three stale references after commit 4f784d4.

### Requirements updated
- **REQ-SF-7** (Sticky Mobile CTA): (1) Price label AC updated from "From €100/night" to "~ €100/night" — matches tilde prefix in all 4 locale translation keys (`cta.fromPrice`). (2) Removed stale "Disappears when inquiry form is in viewport" AC — the inquiry section IntersectionObserver was deleted in 4f784d4; CTA visibility is now controlled by the hero sentinel only. (3) Added explicit AC documenting hero-only observer behavior.
- **REQ-AP-3** (Apartment Detail Page): Sidebar price card CTA link description updated from "linking to listing page inquiry section" to "linking to contact page (`/{locale}/kontakt`, REQ-BK-8)" — matches actual implementation since b81b047.

---

## 2026-04-06 - Sticky CTA hardcoded price + kontakt link (b81b047)

Commit b81b047 simplified the sticky mobile CTA: price is now a static €100/night (always displayed), and the link target changed from `#inquiry` anchor to `/{locale}/kontakt` (contact page). The `lowestPrice` prop was removed from both `StickyMobileCTA` and `Page` components — no dynamic pricing is passed through.

### Requirements updated
- **REQ-SF-7** (Sticky Mobile CTA): Three AC changes. (1) Price is now a static placeholder (€100/night), always rendered — removed "Price pulled from lowest active seasonal rate" criterion. (2) Link target changed from `#inquiry` anchor back to `/{locale}/kontakt` (REQ-BK-8), aligning with the existing REQ-BK-8 criterion that all site CTAs link to the contact page. (3) Removed failure-mode criterion (conditional DOM omission when no lowestPrice) — the price span is now unconditional.

---

## 2026-04-06 - Sticky CTA conditional price rendering + link target correction (0dd5631)

Commit 0dd5631 fixed duplicated "Check Availability" text in the sticky mobile CTA when no price was available. The price span is now conditionally rendered only when lowestPrice is provided, preventing the doubled text.

### Requirements updated
- **REQ-SF-7** (Sticky Mobile CTA): Two AC corrections. (1) Link target updated from `/{locale}/kontakt` to `#inquiry` anchor on the current page — matches actual implementation since the CTA was wired. (2) Failure mode rewritten: price span is conditionally omitted from DOM (not just hidden or empty) when no lowestPrice is provided, leaving only the action text.

---

## 2026-04-06 - Family origin story corrected — Črešnjevo (Zagorje), not the island (81992f5)

Parents are from Črešnjevo in Zagorje, not born on Pašman island. They fell in love with the island decades ago and made it their second home. The About page and homepage apartments section have been rewritten in all 4 locales to reflect this true story. The parallel between green hills (Zagorje) and the sea (Ždrelac) — that they chose this place, just as tourists do — is the emotional core of the narrative.

### Requirements updated
- **REQ-ED-5** (About Your Hosts): Tone example corrected — family chose Pašman, they were not born there. "Our family has been on this island for generations" replaced with the accurate framing. CMS content (ec_about, 4 locales) and hardcoded homepage apartments fallback updated to match.
- **REQ-SF-5** (Why Pasman + Zdrelac Section): Apartments preview body text updated — now uses personal family narrative (chose Pasman as second home) instead of generic comfort description. Heading DE register corrected: "Ihr Zuhause" to "Euer Zuhause" (REQ-I18N-6 continuation).
- **REQ-I18N-6** (Cultural Content Adaptation): One more DE formal "Sie" holdout resolved — homepage apartments heading "Ihr Zuhause" changed to "Euer Zuhause". Remaining formal holdouts reduced from two to one (404.astro only).

---

## 2026-04-05 - Deep translation polish: FAQ fallbacks + CMS editorial content (c53ef69)

Commit c53ef69 polished all FAQ fallback strings (DE informal, EN conversational, SL native) and 27 D1 CMS entries across aktivnosti, hrana, dolazak in DE/EN/SL. Croatianisms removed, tone aligned per REQ-I18N-6.

### Requirements updated
- **REQ-I18N-6** (Cultural Content Adaptation): Status updated — FAQ fallback DE "Sie" holdout in `faq.astro` resolved; remaining formal "Sie" holdouts reduced from three to two (index.astro CMS fallback, 404.astro). SL and EN descriptions refined.
- **REQ-ED-7** (FAQ): Status expanded — fallback FAQ entries now culturally adapted per locale (DE informal "ihr", EN warm conversational, SL native phrasing). Transport answers cross-reference Getting Here page. Verification criterion added for locale tone.
- **REQ-CMS-6** (Preloaded Content & Media): Status updated — DE/SL/EN CMS entries now present and polished for `aktivnosti`, `hrana`, and `dolazak` collections. Remaining gaps narrowed to `vodic`, `plaze`, `about`.

---

## 2026-04-05 - Docs: route rename documentation + DE register consistency (eb5def7, be77a1d, 2c0f53a)

Three commits fixing stale route references in documentation and aligning German register guidance between spec and content guide.

### Documentation updated
- **documentation/configuration.md** (MEDIA binding, eb5def7): Updated route reference from `/media/:key` to `/api/img/[key]` and noted the old route has been removed.
- **documentation/security.md** (Media Path Validation, be77a1d): Updated route reference from `GET /media/[...key]` to `GET /api/img/[key]`, noted old route removal, and clarified that path traversal validation logic moved with the route to `src/pages/api/img/[key].ts`.
- **documentation/content-guide.md** (German register, 2c0f53a): Added missing Privacy Policy formal "Sie" exception to align with REQ-I18N-6 acceptance criteria (which had added the exception in the 3e409a4 spec pass). Content guide previously said "throughout" with no exception.

### Requirements updated
- **REQ-I18N-6** (Cultural Content Adaptation): No change — spec was already updated in 3e409a4. These commits only synced documentation to match.

---

## 2026-04-05 - Spec review: DE informal register migration scope update (3e409a4)

Commit 3e409a4 completed the DE informal register migration -- 12 keys in `de.json` changed from formal "Sie/Ihre/Ihnen" to informal "ihr/euch/euer" covering booking forms, error messages, CTAs, homepage sections, and footer. Also fixed HR ellipsis to Unicode in kontakt.astro.

### Requirements updated
- **REQ-I18N-6** (Cultural Content Adaptation): Acceptance criteria expanded -- informal "ihr/euch" scope now explicitly covers all visitor-facing UI strings, booking forms, error messages, CTAs, and editorial content (not just "editorial pages"). Added Privacy Policy formal "Sie" exception (legal convention per CON-LEGAL). Status updated to reflect `de.json` is now fully migrated to informal register. Noted three remaining formal "Sie" holdouts in hardcoded `.astro` fallback strings (index.astro CMS fallback, faq.astro pets answer, 404.astro page text).

### Quality note
The previous changelog entry (1f2caa0) flagged 404 page formal "Sie" as potentially outside REQ-I18N-6 scope. With this commit broadening the informal convention beyond editorial pages, the 404 and FAQ holdouts are now in-scope gaps to address in a future code pass.

---

## 2026-04-05 - Spec review: stale nav references fixed (5c9c89f)

Commit 5c9c89f was a docs cleanup (cross-refs, stale page removals from documentation/seo.md and documentation/api-reference.md, REQ-I18N-6 status promotion). The SDD changes in that commit were accurate. Phase 2/3 review found two stale references in storefront.md.

### Requirements updated
- **REQ-SF-3** (Navigation): Nav items list still referenced "Ždrelac (village page, REQ-ED-6)" — page deprecated in Revision 70, link removed from navigation code. Updated nav list to: Apartments, Gallery, Getting Here, Local Guide, About. Also corrected admin link location: was described as "in navigation header and mobile menu" but is actually in footer only.
- **REQ-SF-8** (Gallery Page): Navigation position described as "between Ždrelac and Getting Here" — updated to "between Apartments and Getting Here" since Ždrelac nav item no longer exists.

---

## 2026-04-05 - Spec review: fix stale kontakt info criterion (1f2caa0)

Phase 3 clean pass. REQ-BK-8 acceptance criterion "Contact info section displays email and location" was stale -- the kontakt page info section has been a heading + description paragraph with 2-hour response promise since the content polish, not an email/location display. Updated to match actual implementation.

### Requirements updated
- **REQ-BK-8** (Contact Inquiry Page): Last acceptance criterion updated from "displays email and location" to "displays heading and description paragraph with 2-hour response promise."

### Quality note
404 page German text still uses formal "Sie" register while REQ-I18N-6 documents informal "ihr/euch" as the convention. REQ-I18N-6 scopes this to "editorial pages" so the error page is not in violation, but a future code pass may want to align 404 DE copy with the informal convention for consistency.

---

## 2026-04-05 - Spec review: voice rules documented in content guide (4a818ed)

Commit 4a818ed added page-level voice rules and LLM verification step to `documentation/content-guide.md`. The spec already captured love-letter tone for REQ-ED-8 (hrana) and REQ-ED-9 (aktivnosti) in the previous changelog entry, and informal German addressing in REQ-I18N-6. Gallery intro tone was missing from REQ-SF-8 -- added now for consistency.

### Requirements updated
- **REQ-SF-8** (Gallery Page): Intro sentence description updated to specify poetic tone (brief, evocative, open-ended statement) matching the page-level voice rule documented in content-guide.md.
- **REQ-I18N-6** (Cultural Content Adaptation): Status changed from Planned to Implemented. All acceptance criteria are met in code: German uses "Ferienwohnung," detailed specs, informal "ihr/euch" on editorial pages; Croatian/Slovenian warm tone; English benefit-led; CMS supports per-locale descriptions.

---

## 2026-04-05 - Spec review: complete content polish (b178eff)

Commit b178eff polished all remaining page intros and form labels to love-letter tone. Aktivnosti and hrana hero intros rewritten from descriptive to emotional/sensory. Galerija intro polished in DE/SL/EN. Kontakt form labels updated (dates field, success/error messages, response-time promise in success toast). German text across kontakt page switched from formal "Sie" to informal "ihr/euch" addressing. Hero tagline updated in HR/DE/SL. 404 page copy polished (em-dashes, shortened button labels, natural DE/SL phrasing).

### Requirements updated
- **REQ-ED-8** (Food & Drink): Intro paragraph description updated to note love-letter tone.
- **REQ-ED-9** (Nature & Activities): Intro paragraph description updated to note love-letter tone.
- **REQ-I18N-6** (Cultural Content Adaptation): German addressing convention documented -- informal "ihr/euch" (not formal "Sie").

### No status changes
All affected requirements remain at their current status. REQ-BK-8 (Contact Inquiry Page), REQ-CMS-8 (Error Pages), REQ-SF-1 (Hero Section), and REQ-SF-8 (Gallery Page) were not updated because their acceptance criteria describe structure, not specific copy text -- the changes are editorial polish within existing spec boundaries.

---

## 2026-04-05 - Spec review: love-letter content rewrite (7bdfa5f)

Commit 7bdfa5f rebranded the guide page and homepage guide card from informational to love-letter tone. Guide page title changed from "Vodič po Pašmanu" / "Pašman Local Guide" to "Otok našim očima" / "The Island Through Our Eyes" in all 4 locales. Homepage guide card subtitle changed from geographic listing ("Ždrelac, Pašman, Ugljan and surroundings") to poetic ("Pašman, Ugljan, and that small stretch of sea between them"). Beaches page intro rewritten from short Ždrelac-focused sentence to longer love-letter covering both Pašman and Ugljan.

### Requirements updated
- **REQ-SF-5** (Why Pašman + Ždrelac Section): Guide card subtitle updated from "Ždrelac, Pašman, Ugljan and surroundings" to poetic description evoking the two islands and the sea between them.
- **REQ-ED-4** (Local Guide): Added page title rebrand note -- from informational to love-letter tone across all 4 locales.
- **REQ-ED-10** (Beaches Detail Page): Updated intro paragraph description to note love-letter tone covering both Pašman and Ugljan, not just Ždrelac.

### No status changes
All affected requirements remain Implemented.

---

## 2026-04-05 - Spec review: fix stale mobile subtitle criterion, stale commit hash

Spec reviewer pass after 0756148. Two fixes: (1) REQ-SF-1 mobile criterion said "subtitle uses smaller font size" but the mobile font-size override was removed in f51df85 (subtitle is now 11px at all breakpoints) -- updated to reflect this. (2) Changelog entry for gallery bottom padding referenced non-existent commit 92655fb -- corrected to f51df85.

### Requirements updated
- **REQ-SF-1** (Hero Section): Mobile criterion updated from "subtitle uses smaller font size" to "subtitle remains 11px at all breakpoints."

### Changelog fixed
- Gallery bottom padding entry: commit hash corrected from 92655fb to f51df85.

---

## 2026-04-05 - Fix gallery bottom padding after footer-clear removal (f51df85)

After removing `.section--footer-clear` from the gallery page (d7ebc94), the gallery collage container lacked bottom padding, allowing the footer wave to clip photo captions. Added explicit bottom padding to the gallery container to restore spacing. Commit also removed a redundant mobile media query override for `.hero-subtitle` (was setting the same value as the base rule). No spec requirement changes needed for gallery padding -- REQ-SF-8 acceptance criteria and REQ-VD-9 footer-clear bullet already correctly describe the gallery as using standard section padding.

### No requirements changed

---

## 2026-04-05 - Fix nav CTA button, language picker chevron, hero subtitle styling (150b594)

Three CSS bug fixes: (1) nav INQUIRE button was invisible when scrolled (navy text on navy background) -- fixed to white text on navy background, restoring the "always visible" CTA criterion; (2) language picker chevron barely visible over hero -- increased stroke-width and added explicit opacity; (3) hero subtitle styling aligned with `.text-label` pattern (11px, 600 weight, 0.2em tracking, rgba opacity) for visual consistency with the location label above it.

### Requirements updated
- **REQ-SF-1** (Hero Section): Updated tagline acceptance criterion from "uppercase sans-serif at 0.7 opacity" to `.text-label`-style description matching the new font-size, weight, and letter-spacing values. Opacity preserved via rgba color.

### No status changes
All affected requirements remain Implemented. REQ-SF-3 (Navigation) already specifies CTA "always visible" -- the bug fix restores that behavior without needing AC changes. REQ-SF-4 (Language Switcher) unaffected at spec level (chevron stroke-width is implementation detail).

---

## 2026-04-05 - Scope footer-clear to CTA pages only (d7ebc94)

Removed `.section--footer-clear` from 9 editorial/content pages (vodic, hrana, aktivnosti, plaze, galerija, faq, privatnost, o-nama, apartment detail). Class now applied only to 4 pages with CTA/interactive elements near the footer wave: homepage, apartments listing, kontakt, dolazak. Editorial pages use standard section padding -- the footer wave transitions naturally within the existing padding zone.

### Requirements updated
- **REQ-VD-9** (Wave Section Dividers): Updated `.section--footer-clear` acceptance criterion from "applied universally to every page" to selective application on CTA pages only. Listed the 4 pages that retain the class and the 9 pages that no longer use it.

### Glossary updated
- **section--footer-clear**: Updated definition from "applied to the last content section on every page" to "applied to pages where a CTA or interactive element sits near the footer wave."

### No status changes
All affected requirements remain Implemented.

---

## 2026-04-05 - Remove deleted photo from gallery (b14ea06)

Removed photo UUID `358acbfa-b8d1-4925-9d10-a0ac4f7f5b58` from gallery array. Gallery now has 137 photos instead of 138. Strip layout unchanged (14 strips); last strip has 7 photos instead of 8.

### Requirements updated
- **REQ-SF-8** (Gallery Page): Photo count updated from 138 to 137 in acceptance criteria and status. Last strip size updated from 8 to 7.
- **REQ-VD-14** (Unique Imagery Per Page): Photo count updated from "138+ photos total" to "137+ photos total" in status.
- **REQ-VD-15** (Exterior Photo Collage): Gallery page photo count updated from 138 to 137 in the MiniCollage consumer description.

---

## 2026-04-05 - Centralize footer wave clearance with .section--footer-clear class (d26caba)

New `.section--footer-clear` CSS utility class in `global.css` replaces all per-page inline `padding-bottom` overrides for footer wave clearance. Applied to the last content section on every page (13 pages total). Same `padding-bottom: calc(var(--space-section) + clamp(50px, 8vw, 100px))` value that was previously duplicated as inline styles. Follows the same pattern as `.section--wave-in` (top-edge wave clearance) but for the bottom edge.

### AC updated
- **REQ-VD-9** (Wave Section Dividers): Added `.section--footer-clear` bullet documenting the CSS utility class, its padding formula, its relationship to REQ-SF-6 (footer wave), and its universal application across all pages.

### Glossary updated
- **section--footer-clear**: New term documenting the CSS utility class for footer wave bottom-edge clearance.

### No status changes
All affected requirements remain Implemented.

---

## 2026-04-05 - Footer wave clearance on apartments listing and about pages (1e17bc9)

Added `padding-bottom: calc(var(--space-section) + clamp(50px, 8vw, 100px))` to the last section on `/apartmani/` (listing page) and `/o-nama` (about page), matching the existing pattern on `/kontakt`, `/dolazak`, and homepage. Prevents the footer top-edge wave SVG from overlapping page content. Same CSS-level spacing fix previously classified as no spec impact (see 5e301cd below).

### No AC updated
No spec changes required. Footer wave clearance padding is an implementation-level CSS concern, not a new feature or behavior change. The footer wave (REQ-SF-6) and wave height (REQ-VD-9) are already fully documented.

### No status changes
All affected requirements remain Implemented.

## 2026-04-05 - CSS polish: wave gap fix, spacing, nav visited color (5e301cd)

Six CSS bug fixes from feedback round 8. The only spec-relevant change: `.section--wave-in` margin-top increased from -1px to -2px to fully close a subpixel rendering gap between wave SVGs and adjacent sections. Remaining fixes (apartment detail spacing reduction, contact/dolazak footer wave clearance padding, mobile nav visited link color) are implementation-level CSS adjustments with no spec impact.

### AC updated
- **REQ-VD-9** (Wave Section Dividers): `.section--wave-in` margin-top updated from `-1px` to `-2px`.

### Glossary updated
- **section--wave-in**: margin-top value updated from `-1px` to `-2px`.

### No status changes
- All affected requirements remain Implemented.

---

## 2026-04-05 - Remove duplicate gallery photo (24d86df)

Removed duplicate photo UUID from gallery array (two UUIDs pointing to identical image file). Gallery now has 138 photos instead of 139. Strip layout unchanged (14 strips); last strip has 8 photos instead of 9.

### Requirements updated
- **REQ-SF-8** (Gallery Page): Photo count updated from 139 to 138 in acceptance criteria and status. Last strip size updated from 9 to 8.
- **REQ-VD-14** (Unique Imagery Per Page): Photo count updated from "139+ photos total" to "138+ photos total" in status.
- **REQ-VD-15** (Exterior Photo Collage): Gallery page photo count updated from 139 to 138 in the MiniCollage consumer description.

---

## 2026-04-05 - Unified wave section spacing via .section--wave-in class (86e237b)

The `--space-section` CSS custom property was halved from `clamp(5rem, 12vw, 10rem)` to `clamp(2.5rem, 6vw, 5rem)`, tightening vertical rhythm across all sections. A new `.section--wave-in` CSS utility class was introduced to replace all per-section inline style overrides (`position: relative`, `padding-top: clamp(80px, 12vw, ...)`, `margin-top: -1px`) on sections that receive a wave SVG at their top edge. The class computes padding as `calc(var(--space-section) + clamp(50px, 8vw, 100px))`, combining standard section spacing with wave height. Applied to: homepage apartments section (dark), homepage sunset CTA section, Getting Here dark address section, and apartment listing CTA section (conditionally). Additionally, inline padding overrides on the homepage "Why Pasman" section and experience section were removed, and grid gaps on the homepage split-section and apartment detail page were changed from `--space-lg` to `--space-xl`.

### Requirements updated
- **REQ-VD-9** (Wave Section Dividers): Added `.section--wave-in` documentation as a new bullet describing the CSS utility class and its usage across pages. Updated homepage waves description to note that wave-receiving sections use `.section--wave-in` instead of inline styles. Updated editorial section waves to note `.section--wave-in` usage on the dolazak dark section.
- **REQ-AP-2** (Apartment Listing Page): Replaced inline `clamp(80px, 12vw, 120px)` padding reference with `.section--wave-in` class for the conditional wave CTA section.
- **REQ-ED-2** (Getting Here): Added `.section--wave-in` class note to the dark address section description.

### Glossary updated
- **section--wave-in**: New term documenting the CSS utility class for wave-receiving sections.

### No status changes
- REQ-VD-9, REQ-AP-2, REQ-ED-2 remain Implemented (refactor of inline styles to reusable CSS class).

---

## 2026-04-05 - MiniCollage single-image fallback: edge-to-edge (c497e32)

MiniCollage single-image fallback (`.mini-collage--single`) changed from rounded contained image to edge-to-edge full-width. Removed `border-radius: 16px` and `max-width: 700px` so a single image spans the full container width with no rounding, matching the visual weight of multi-image collage strips. Hover zoom (`scale(1.03)` transition) also removed from single-image fallback.

### AC updated
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): Added single-image fallback acceptance criterion documenting the edge-to-edge behavior (no border-radius, no max-width, no hover zoom, static 4:3 image). Clarified that 16px border-radius applies to multi-image strips only.

### No status changes
- REQ-VD-15 remains Implemented (visual refinement of single-image edge case).

---

## 2026-04-05 - Subpixel gap fixes, spacing reductions, dolazak wave (63c07db)

Wave SVG transition added to the Getting Here (dolazak) page's dark "address" section, creating an organic light-to-dark transition matching the wave pattern used elsewhere on the site. Homepage spacing reduced (tighter gaps between sections). Subpixel gap fixes (margin-top: -1px) on homepage CTA and dolazak dark section.

### AC updated
- **REQ-ED-2:** Added wave SVG divider documentation to the address section acceptance criterion.
- **REQ-VD-9:** Added "Editorial section waves" bullet documenting the dolazak page wave placement.

### No status changes
- REQ-ED-2, REQ-VD-9 remain Implemented (visual refinement and new wave placement).

---

## 2026-04-05 - Add horizontal padding to all collage strips (505b26f)

All collage and image strip containers (homepage collage, apartments listing collage, gallery strips, editorial strips in global CSS) gain responsive horizontal padding `clamp(1.25rem, 4vw, 3rem)`. This ensures 16px rounded-corner images have breathing room from viewport edges instead of touching the screen sides.

### AC updated
- **REQ-VD-15:** Added acceptance criterion documenting the responsive horizontal padding on all collage/strip containers.

### No status changes
- REQ-VD-15 remains Implemented (visual refinement only).

---

## 2026-04-05 - Equalize border-radius to 16px (9d69bd1)

All image container border-radius values normalized to a consistent 16px across the site. Previously mixed: apartment cards (12px), feature image desktop (24px), apt-meta/apt-amenities (12px), breath-card (22px). Collage, triptych, and guide card were already 16px.

### AC updated
- **REQ-VD-6:** Homepage photo system range changed from "16-24px" to consistent "16px". Feature image no longer has separate desktop/mobile radius (was 24px desktop / 16px mobile, now 16px everywhere).
- **REQ-VD-10:** Breathing image card border-radius updated from 22px to 16px.
- **REQ-AP-2:** Apartment detail meta grid border-radius updated from 12px to 16px.

### No status changes
- REQ-VD-6, REQ-VD-10, REQ-AP-2 remain Implemented (visual refinement only).

## 2026-04-05 - Fix stale fallback mention in REQ-AP-2

REQ-AP-2 "Current implementation" still referenced "(with hardcoded fallback data when CMS is not yet seeded)" which contradicted the "No fallback" criterion below it. Updated to "(no fallback -- CMS-only)" to match actual code and the existing No fallback criterion.

### Requirements updated
- **REQ-AP-2** (Apartment Listing Page): Removed stale "hardcoded fallback" parenthetical from current implementation description.

---

## 2026-04-05 - Apartment CTA wave conditional on collage presence

The apartment listing page inquiry CTA section wave divider and extra top padding are now conditional on collage photos being present. When the collage strip renders (CMS editorial entry exists with photos), the navy wave SVG and `clamp(80px, 12vw, 120px)` top padding appear as before. When no collage photos are available, both are omitted and the CTA section renders with default styling. Dead CSS class `.collage-strip__wave--bottom` removed (was already unused since wave relocation to CTA section).

### Requirements updated
- **REQ-AP-2** (Apartment Listing Page): Updated wave/CTA description to reflect conditional rendering — wave and extra padding only present when collage photos exist.

---

## 2026-04-05 - Gallery caption styling updated to base font size

MiniCollage caption overlay styling changed from extra-small font (`font-size-xs`) to base font size (`font-size-base`) to match the gallery intro text. Padding increased from `space-sm/space-md` to `space-md/space-lg`. Letter-spacing (0.02em) removed in favor of `line-height: 1.6`. Gradient overlay opacity increased from 0.45 to 0.5 for slightly better contrast.

### Requirements updated
- **REQ-VD-15** (Exterior Photo Collage): `showCaptions` acceptance criterion updated — caption font size changed from "extra-small" to "base font size", letter-spacing replaced with line-height 1.6, padding specified as `var(--space-md) var(--space-lg)`, gradient background opacity updated from 0.45 to 0.5.

---

## 2026-04-05 - Move apartment listing wave from collage bottom to CTA section top

The apartment listing page (`/[locale]/apartmani/`) wave divider between the exterior photo collage and the inquiry CTA section was relocated. Previously an SVG at the bottom of the collage strip, it is now an inline SVG positioned absolute at the top of the CTA `<section>`. Fill remains navy (`var(--color-navy)`) with `scaleY(-1)` flip. The CTA section gains `position: relative` and `padding-top: clamp(80px, 12vw, 120px)` to accommodate the wave.

### Requirements updated
- **REQ-AP-2** (Apartment Listing Page): Updated wave description — wave moved from collage bottom to CTA section top as an inline SVG with absolute positioning, scaleY(-1) flip, and navy fill. CTA section gains relative positioning and extra top padding.

---

## 2026-04-05 - Restore cream wave between triptych and sunset CTA

The inline SVG wave divider between the experience triptych and sunset CTA section on the homepage was restored. The wave uses `fill="var(--color-bg)"` (cream) with `scaleY(-1)` vertical flip, positioned absolute at the top of the CTA section. The CTA section also regains `position: relative` and extra `padding-top` to accommodate the wave.

### Requirements updated
- **REQ-VD-9** (Wave Section Dividers): Homepage waves restored from 2 placements back to 3. Placement (3) "cream-to-sunset-gradient at top of sunset CTA section" re-added as an inline SVG in the CTA section markup (not a WaveDivider component).

---

## 2026-04-05 - Remove gradient-warm from homepage experience section

Homepage experience triptych section (`index.astro`) switched from `.section.gradient-warm` to plain `.section`. The warm gradient is now unused on the homepage.

### Requirements updated
- **REQ-SF-5** (Why Pašman + Ždrelac Section): Experience triptych description updated — "Wrapped in warm gradient background section" replaced with "Plain cream section background (`.section`) — warm gradient background removed".
- **REQ-VD-8** (Gradient Utility System): Warm gradient description updated — "for experience/editorial sections" changed to "for editorial sections (no longer used on the homepage experience triptych)".
- **REQ-VD-9** (Wave Section Dividers): Updated stale reference from "warm gradient section" to "experience triptych section" in the removed-wave note, since the triptych no longer uses `.gradient-warm`.

---

## 2026-04-05 - Gallery caption styling changed from italic to sans-serif normal

MiniCollage caption overlay styling updated: font changed from italic (browser default serif/inherited) to explicit sans-serif (`var(--font-sans)`) with `font-weight: 400`, `font-style: normal`, and `letter-spacing: 0.02em`. Text opacity increased from 85% to 90%. Gradient background lightened from `rgba(0,0,0,0.5)` to `rgba(0,0,0,0.45)`.

### Requirements updated
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): `showCaptions` caption styling description updated from "italic, extra-small font, white text at 85% opacity, gradient rgba(0,0,0,0.5)" to "sans-serif, extra-small font, normal weight 400, letter-spacing 0.02em, white text at 90% opacity, gradient rgba(0,0,0,0.45)".
- **REQ-SF-8** (Gallery Page): Caption description updated from "italic white text" to "sans-serif white text (normal weight, 90% opacity)". Status line updated accordingly.

### Glossary updated
- **Poetic Captions**: Updated rendering description from "italic white text" to "sans-serif white text, normal weight, 90% opacity".

---

## 2026-04-05 - Spec cleanup: remove stale zdrelac.astro reference from REQ-VD-9

**REQ-VD-9** (Wave Section Dividers): Removed `zdrelac.astro` from the list of pages with custom hero markup. The Zdrelac page was deleted and merged into `vodic.astro` (which uses `HeroSimple`, not custom hero markup) in Revision 70. The reference was stale.

---

## 2026-04-05 - Re-add showCaptions as photo overlay; remove triptych-to-CTA wave

`showCaptions` prop re-added to `MiniCollage` with a different rendering approach. Previously (Revision 83), captions were rendered as text below each photo (outside the image frame). They are now rendered as an absolute-positioned overlay at the bottom of each photo — italic white text at 85% opacity over a bottom-up dark gradient (`rgba(0,0,0,0.5)` to transparent), `pointer-events: none`. The `.mini-collage__item` container gains `position: relative` to enable the overlay. The gallery page passes `showCaptions` to all strips so the 50 poetic Croatian captions are again visible to sighted visitors, while also serving as alt text.

The inline SVG wave divider between the experience triptych section and the sunset CTA section on the homepage was removed. The CTA section now transitions directly from the warm gradient section without a wave. The `position: relative` and extra `padding-top` on the CTA `<section>` were also removed.

### Requirements updated
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): `showCaptions` prop re-added to acceptance criteria with overlay positioning details (absolute bottom, gradient background, pointer-events none).
- **REQ-SF-8** (Gallery Page): Current implementation updated — captions now rendered as visible overlay text via `showCaptions` (not alt-text-only).
- **REQ-VD-9** (Wave Section Dividers): Homepage waves reduced from 3 placements to 2. Removed placement (3) "cream-to-dark before sunset CTA section" — wave no longer exists in code.

### Glossary updated
- **Poetic Captions**: Updated to reflect overlay rendering (italic white text over bottom-edge gradient).
- **MiniCollage**: Added `showCaptions` to prop list with overlay description.

---

## 2026-04-05 - Revert showCaptions and navy gradient CTA

The `showCaptions` prop added in Revision 83 has been reverted. The prop, caption rendering template, and `.mini-collage__caption` CSS were all removed from the MiniCollage component. Gallery page no longer passes `showCaptions`. Poetic Croatian captions remain in the gallery page source and are still assigned as alt text, but are no longer rendered as visible text below photos.

The apartment listing page inquiry CTA section was reverted from a navy-to-cream gradient back to the standard `section--alt` cream background.

### Requirements updated
- **REQ-SF-8** (Gallery Page): Removed references to `showCaptions` prop and visible caption rendering. Captions are now alt-text-only.
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): Removed `showCaptions` prop from acceptance criteria -- the prop no longer exists in the component.
- **REQ-AP-2** (Apartment Listing Page): Inquiry CTA section reverted from navy gradient (`linear-gradient` from navy to cream with `clamp(80px, 10vw, 120px)` top padding) to standard `section--alt` cream background. Wave color matching note removed.

### Glossary updated
- **Poetic Captions**: Reverted to alt-text-only definition (visible rendering removed).

---

## 2026-04-05 - Revision 84: Gallery scroll speed fixed at 80s; strip gap tightened

Gallery page MiniCollage strips changed from variable speed (`max(35, photoCount * 8)`) to a fixed 80-second duration per strip, giving uniform scroll pacing across all 14 strips regardless of photo count. Strip vertical gap reduced from `space-lg` to `space-sm` for a denser collage feel.

### Requirements updated
- **REQ-SF-8** (Gallery Page): Status updated -- scroll speed is now fixed 80s per strip (was variable formula)
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): Acceptance criteria updated -- gallery page uses fixed 80s speed; other pages retain 35s default. Also fixed stale text in hrana placement: "sandwiching the description text" corrected to "stacked below the description text" (layout changed in Revision 78, spec not updated then).

## 2026-04-05 - Revision 83: MiniCollage showCaptions prop; gallery captions now visible

MiniCollage component gains a `showCaptions` prop that renders each photo's alt text as a visible italic caption below the image. Gallery page enables this prop so the 50 poetic Croatian captions are now displayed as visible text, not just used as alt text.

### Requirements updated
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): Added `showCaptions` prop to acceptance criteria -- optional visible italic caption rendered below each photo, currently enabled only on the gallery page.
- **REQ-SF-8** (Gallery Page): Clarified that poetic captions are rendered as visible text via `showCaptions` prop (previously spec only mentioned caption assignment, not visible rendering). Status updated accordingly.

### Glossary updated
- **Poetic Captions**: Updated definition to reflect that captions are now rendered as visible italic text (via `showCaptions`), not just used as alt text.

---

## 2026-04-05 - Revision 82: Gallery page rewritten as 139-photo scrolling collage strips

Gallery page (`galerija`) completely rewritten from an 18-photo static masonry grid to 139 photos (124 original + 15 added) displayed as horizontally scrolling MiniCollage strips with alternating directions (14 strips: 13 of 10 photos + 1 of 9). Photos are deterministically shuffled per locale so each language sees a different arrangement. 50 poetic Croatian captions rotate across photos as alt text. HeroSimple now accepts an `intro` prop for introductory text below the title, first used on the gallery page.

### Requirements updated
- **REQ-SF-8** (Gallery Page): Acceptance criteria rewritten to reflect new implementation -- scrolling collage strips replacing static masonry grid. Dependencies updated from None to REQ-VD-15, REQ-VD-12. Status updated to reflect 139 photos, poetic captions, deterministic shuffle, and speed formula.
- **REQ-VD-12** (Subpage Hero Pattern): Added `intro` prop to acceptance criteria -- optional introductory paragraph rendered below the title.
- **REQ-VD-14** (Unique Imagery Per Page): Photo count updated from "68 photos total" to "139+ photos total" reflecting the expanded gallery.
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): Added gallery page (galerija) as consumer #5 in the "Placed on" list.

### Glossary updated
- **Masonry Grid**: Marked as superseded on the gallery page.
- **Deterministic Shuffle**: New term -- locale-seeded hash sort for stable per-language photo order.
- **Poetic Captions**: New term -- 50 Croatian evocative phrases used as gallery alt text.

---

## 2026-04-05 - Revision 81: Beaches hero fixed to Galovac aerial, triptych image updated, spacing tightened

Beaches page (`plaze`) hero and OG image changed from dynamic CMS-first-section-with-fallback to a fixed R2 photo (Galovac aerial — turquoise sea around Ugljan island), decoupling the hero from CMS entry order. Same pattern as Nature & Activities (Revision 79). Homepage triptych beaches card updated to use the same Galovac aerial photo, establishing visual continuity between the preview card and the destination page. Homepage spacing refined: tighter padding on the CTA button area and exterior photo collage wrapper, added bottom padding to the experience section.

### Requirements updated
- **REQ-ED-10** (Beaches Detail Page): Added fixed hero image detail — hero and OG image now use a fixed R2 photo (Galovac aerial), not derived from CMS entry order.
- **REQ-VD-14** (Unique Imagery Per Page): Added triptych-to-page continuity clarification — homepage triptych preview images may intentionally match their target page's hero image for visual continuity.
- **REQ-ED-8** (Food & Drink Detail Page): Spec reviewer fix — added fixed hero image detail to match code and align with REQ-ED-9/REQ-ED-10 pattern. Hero and OG image use a fixed R2 photo, not derived from CMS.

---

## 2026-04-05 - Revision 80: Editorial section layout reordered to title-text-collage

All 4 editorial detail pages (aktivnosti, dolazak, plaze, vodic) changed section rendering order from title -> MiniCollage -> text to title -> text -> MiniCollage. Visitors now read the descriptive text before seeing the photo collage, improving reading flow across all editorial pages. This matches the description-first pattern already established on the Food & Drink page (REQ-ED-8, Revision 78).

### Requirements updated
- **REQ-ED-2** (Getting Here): Stale acceptance criteria fixed. Was still describing alternating image-left/text-right row layout from a prior implementation. Updated to reflect actual editorial section model: title, then body text (HTML), then optional MiniCollage strip. Added alternating backgrounds and scroll-triggered reveal details.
- **REQ-ED-4** (Local Guide): Clarified section rendering order to explicitly state title, then body text, then optional MiniCollage photo strip.
- **REQ-ED-9** (Nature & Activities): Layout description updated from "title, MiniCollage photo strip, and body text" to "title, then body text, then MiniCollage photo strip below the text."
- **REQ-ED-10** (Beaches): Same layout order update as REQ-ED-9.

---

## 2026-04-05 - Revision 79: Aktivnosti restructured to Land + Sea, fixed hero image

Nature & Activities page (`aktivnosti`) restructured from 3 mismatched CMS sections (hiking / cycling / water with wrong photos) to 2 love-letter sections: Land (hiking trails, viewpoints, cycling) and Sea (Adriatic embrace, coves, Kornati, water sports). Content rewritten as island rhythm, not an activity list. 10 new biking photos added. Hero and OG image changed from dynamic CMS-first-section image to a fixed UUID (`0afa5c7a-6108-454d-b309-80eccc3b8f6b` — cyclist on island path), decoupling the visual identity of the hero from CMS entry order.

### Requirements updated
- **REQ-ED-9** (Nature & Activities): Acceptance criteria rewritten — 4-section content model replaced by 2-section Land + Sea model. Section descriptions updated to match new love-letter tone. Fixed hero image detail added to acceptance criteria (was in changelog but missing from AC text).
- **REQ-CMS-6** (Preloaded Content): `aktivnosti` seeding count updated from "4 sections" to "2 sections — Land + Sea".

### Editorial key concepts updated
- **Editorial density**: Range updated from "3-4" to "2-4" sections per page. Nature & Activities added as a named exception (2 sections with love-letter tone), alongside the existing Food & Drink exception.

### Documentation updated
- **documentation/seo.md**: `/aktivnosti` OG image subject updated to reflect fixed UUID and new cyclist-on-path photo.

---

## 2026-04-05 - Revision 78: Food page collages moved below description

Food & Drink page layout changed from collage-description-collage sandwich to description-first layout. Both MiniCollage strips now render below the text section (stacked together with a small gap and bottom padding before footer), instead of sandwiching the description. Reading flow improved: visitor reads the love-letter text first, then sees the photo collages.

### Requirements updated
- **REQ-ED-8** (Food & Drink Detail Page): Layout description changed from "first collage above description, second below" to "description first, then both collages stacked below." Verification criterion added for description-before-collages order.

### Editorial key concepts updated
- **Editorial density**: Exception wording updated to reflect description-then-collages layout.

---

## 2026-04-05 - Revision 77: Food page unified section with two-direction collages

Food & Drink page (`hrana`) restructured from 4 multi-section CMS entries (sorted by `sort_order`, alternating text/image rows) to a single unified section. One CMS entry provides title, body, and a gallery of all photos. Photos are split into two halves rendered as MiniCollage strips scrolling in opposite directions (left above, right below), sandwiching the description text. MiniCollage component gains a `reverse` prop for right-to-left scrolling.

### Requirements updated
- **REQ-ED-8** (Food & Drink Detail Page): Acceptance criteria rewritten — single CMS entry replaces multi-entry `sort_order` model; alternating row layout replaced by collage-description-collage sandwich; two-direction MiniCollage strips replace per-section images; added REQ-VD-15 dependency.
- **REQ-VD-15** (Exterior Photo Collage / MiniCollage): Added `reverse` prop documentation — `animation-direction: reverse` for right-to-left scrolling, used on Food & Drink page.
- **REQ-CMS-6** (Preloaded Content): Fixed stale seeding description — `hrana` collection changed from "4 sections" to "1 entry per locale" to match the restructured single-entry content model.

### Glossary updated
- **MiniCollage**: Added `reverse` direction capability.

### Stale references fixed
- **REQ-ED-9** (Nature & Activities): Replaced "Same alternating row layout ... as REQ-ED-8" with self-contained description of the multi-section alternating layout, since REQ-ED-8 no longer uses that pattern.
- **REQ-ED-10** (Beaches): Same stale reference fix as REQ-ED-9.

### Editorial key concepts updated
- **Editorial density**: Added exception noting Food & Drink uses single unified section.

---

## 2026-04-05 - Revision 76: Listing page inquiry section navy-to-cream gradient

Apartment listing page inquiry CTA section replaced `section--alt` (flat stone background) with a vertical linear gradient from navy to cream. The collage bottom wave fill updated from stone to navy to seamlessly flow into the gradient's navy top. Creates a more dramatic visual transition from the exterior photo collage into the inquiry CTA.

### Requirements updated
- **REQ-AP-2** (Apartment Listing Page): Inquiry section background changed from `section--alt` to navy-to-cream linear gradient. Wave fill updated from stone to navy. Added top padding documentation.
- **REQ-VD-9** (Wave Section Dividers): Wave color matching rules expanded to cover gradient sections — wave fill must match the gradient's starting color at the top edge.

---

## 2026-04-05 - Revision 75: Detail page back-link removed, listing wave color fix

Apartment detail page no longer has a "Back to apartments" CTA section at the bottom — redundant given breadcrumbs and browser navigation. On the apartment listing page, the collage bottom wave fill corrected from navy to stone to match the inquiry `section--alt` section below per wave color matching rules (REQ-VD-9). Seamless margin-top fix on inquiry section to eliminate gap.

### Requirements updated
- **REQ-AP-3** (Apartment Detail Page): Acceptance criterion #8 struck through — back-to-apartments CTA removed as redundant navigation.
- **REQ-AP-2** (Apartment Listing Page): Added documentation that collage bottom wave uses stone fill to match the `section--alt` inquiry section below, per REQ-VD-9 color matching rules.

---

## 2026-04-05 - Revision 74: Uniform MiniCollage scroll speed (35s)

All MiniCollage instances across the site now use a uniform 35s loop duration. Previously, editorial pages used variable speed per section (`18 + i * 4` = 18s, 22s, 26s, 30s) and the apartment detail page used 25s. Standardized to 35s for consistent visual rhythm.

### Requirements updated
- **REQ-VD-15** (Exterior Photo Collage): Removed "faster 25s speed" for apartment detail page. All placements now documented as uniform 35s. Added editorial pages (aktivnosti, dolazak, hrana, plaze, vodic) as MiniCollage usage sites.
- **REQ-AP-3** (Apartment Detail Page): Interior photo collage speed updated from 25 to 35s.

---

## 2026-04-05 - Revision 73: Triptych reduced to 3 items, layout polish

Experience triptych reduced from 4 to 3 items — Local Guide card removed since it duplicates the guide feature card already present above. Grid changed from 4-column to 3-column on desktop. Apartment detail description section no longer uses scroll-triggered reveal animation. CTA button repositioned into standalone container. Collage padding increased.

### Requirements updated
- **REQ-SF-5** (Why Pasman + Zdrelac Section): Triptych changed from 4-item to 3-item grid (food, activities, beaches). Local Guide removed — already represented by the guide feature card above. Desktop grid changed from `repeat(4, 1fr)` to `repeat(3, 1fr)`. REQ-ED-4 reference removed from triptych description (guide link handled by feature card, not triptych).
- **REQ-VD-6** (Photo Frame Treatments): Triptych item count updated from 4 to 3.
- **REQ-ED-4** (Local Guide): Stale reference fixed — acceptance criteria said guide was linked as "4th card" in triptych. Updated to reflect guide is linked from feature card above the triptych, not from within it.

---

## 2026-04-05 - Revision 72: Homepage simplification (duo-image removed, guide card renamed)

Homepage apartments section simplified from split-section with duo-image photo grid to centered text-only layout. "Vodic" CTA button removed from Why Pasman section. Zdrelac village card renamed to Guide card with localized label and regional subtitle.

### Requirements updated
- **REQ-SF-5** (Why Pasman + Zdrelac Section): Three acceptance criteria changes: (1) Removed Vodic CTA button from Why Pasman selling section — editorial navigation now handled solely by triptych and guide card. (2) Apartments preview changed from split-section + duo-image grid to centered text-only layout with ghost CTA. (3) Zdrelac village card renamed to Guide card — overlay label changed from hardcoded "Zdrelac" to localized "Guide" (hr: Vodic, de: Reisefuhrer, sl: Vodnik, en: Guide), subtitle changed from CMS-sourced zdrelac section title to hardcoded regional coverage description ("Zdrelac, Pasman, Ugljan and surroundings").
- **REQ-VD-6** (Photo Frame Treatments): Duo-image treatment struck through — no longer used on homepage after apartments preview simplification.

---

## 2026-04-05 - Revision 71: Stale spec cleanup (dead translation keys + seed notes)

Synced spec with cleanup commit removing dead `nav.zdrelac` and `zdrelac.title` translation keys, deleting stale seed notes (`content-encyclopedia.md`, `missed-requirements.md`, `session-summary-2026-04-03.md`), and fixing o-nama page entry lookup robustness.

### Stale content removed
- **REQ-SEO-4** (Sitemap): Acceptance criteria page list still included `zdrelac` and `zasto-pasman` despite both pages being deleted in revision 70. Removed.
- **REQ-VD-12** (Subpage Heroes): Hero image page list still included `zdrelac`. Removed. Also removed `why Pasman` (page deprecated in revision 70).
- **REQ-CMS-6** (Preloaded Content): Acceptance criteria still referenced `seed/seed.json` and `POST /api/admin/seed` endpoint, both deleted in earlier commits. Updated to reflect D1 SQL migration seeding model. Verification criteria updated accordingly. Status note about stale seed.json removed.

## 2026-04-05 - Revision 70: Content consolidation + CMS collection restructure

Severe content overlap resolved: Ždrelac village page merged into Local Guide (vodic) as first 4 sections. Why Pašman standalone page deprecated (homepage section sufficient). Kornati/Telašćica shortened to teaser in aktivnosti (full content in vodic/izleti). CMS restructured from single overloaded `ec_editorial` collection to dedicated collections per page (vodic, hrana, aktivnosti, plaze, dolazak, about). Dead collections deleted (guide, posts, pages). Navigation reduced from 6 to 5 items.

### Requirements updated
- **REQ-ED-1** (Why Pašman): Deprecated — absorbed into homepage.
- **REQ-ED-4** (Local Guide): Expanded from 4 to 8 sections (Ždrelac content merged as sections 1-4). Dedicated `ec_vodic` collection.
- **REQ-ED-6** (About Ždrelac): Deprecated — merged into REQ-ED-4.
- **REQ-ED-8** (Food & Drink): CMS wiring updated — dedicated `ec_hrana` collection.
- **REQ-ED-9** (Nature & Activities): CMS wiring updated — dedicated `ec_aktivnosti` collection.
- **REQ-ED-10** (Beaches): CMS wiring updated — dedicated `ec_plaze` collection.
- **REQ-CMS-1** (Emdash Integration): Collections list updated — editorial pages now use dedicated collections per page instead of single `ec_editorial` with page_key filter. Dead collections removed.

### Navigation updated
- Removed Ždrelac nav item. Desktop and mobile nav now have 5 items.

### Sitemap updated
- Removed `/zdrelac` and `/zasto-pasman` from sitemap pages array.

### Pages deleted
- `src/pages/[locale]/zdrelac.astro`
- `src/pages/[locale]/zasto-pasman.astro`

### Spec fixes (post-commit review)
- **REQ-ED-5** (About Your Hosts): Status was copy-pasted from REQ-ED-4 (referenced vodic collection, 8 sections). Corrected to reference dedicated `about` CMS collection.
- **REQ-ED-4** (Local Guide): Acceptance criteria listed only 4 sections but status said 8. Expanded section list to enumerate all 8 (sections 1-4 from Ždrelac merger, sections 5-8 original guide). Updated CMS wiring from `editorial` with `page_key` filter to dedicated `vodic` collection.
- **REQ-ED-2** (Getting Here): Acceptance criteria still referenced `editorial` collection with `page_key === "dolazak"` filter. Updated to dedicated `dolazak` collection.
- **REQ-CMS-6** (Preloaded Content): Seed data and editorial seeding descriptions still referenced old `editorial` page_key model and listed `zdrelac` as separate page_key. Updated to reflect dedicated collections and vodic's 8-section count.
- **REQ-SF-5** (Why Pasman + Zdrelac Section): Zdrelac card link updated from `/{locale}/zdrelac` to `/{locale}/vodic`. Dependencies updated: removed deprecated REQ-ED-1 and REQ-ED-6.
- **REQ-SEO-5** (Keyword Strategy): Removed "Why Pasman" from internal linking description. Removed REQ-ED-1 from dependencies.
- **README.md**: Editorial domain description updated to reflect current pages (removed "Why Pasman", "A Day on Pasman"; added food and drink, activities, beaches).

---

## 2026-04-04 - Revision 69: Editorial restructure, hero carousel expansion, apartment detail page redesign

Editorial content consolidated from 5-6 sections to 3-4 per page across all 6 editorial pages (hrana, aktivnosti, plaze, zdrelac, dolazak, vodic) for stronger narrative density. Vodic (local guide) page switched from hybrid guide-collection + editorial model to editorial-only (guide collection removed). Zadar city guide section added as a new vodic entry. Hero carousel expanded from 4 to 7 real island photos. HeroSimple component height increased from 280px minimum to 50vh. Apartment detail page redesigned to use HeroSimple + MiniCollage components (replacing custom hero markup + ScrollCollage).

### Requirements updated
- **REQ-SF-1** (Hero Section): Carousel expanded from 4 to 7 slides.
- **REQ-VD-12** (Subpage Hero Pattern): Minimum height updated from 280px to 50vh (50svh on mobile).
- **REQ-ED-2** (Getting Here): Content sections consolidated from 5+ to 3 focused sections.
- **REQ-ED-4** (Local Guide): Major restructure -- guide CMS collection removed, editorial-only content model. Card-overlay grid layout replaced with editorial section layout + MiniCollage photo strips. 4 sections: Pasman villages, Ugljan villages, Zadar city guide (new), day trips.
- **REQ-ED-6** (About Zdrelac): Content sections documented -- 4 sections covering the bridge, the village, the fishermen, olive groves and trails.
- **REQ-ED-8** (Food & Drink): Sections consolidated from 5 to 4 with updated named locations.
- **REQ-ED-9** (Nature & Activities): Sections consolidated from 6 to 4 with updated details.
- **REQ-ED-10** (Beaches): Sections consolidated from 5 to 4 with named beaches and distances.
- **REQ-AP-3** (Apartment Detail Page): Hero changed from custom 60vh markup to HeroSimple component. Interior photo collage changed from ScrollCollage to MiniCollage.
- **REQ-VD-6** (Photo Frame Treatments): Guide page cards marked as superseded -- vodic now uses editorial sections with MiniCollage strips.

### Key concepts updated
- **Editorial domain**: Added "editorial density" concept -- 3-4 focused sections per page.

### Glossary updated
- **MiniCollage**: New term added -- compact horizontal scroll photo strip used in editorial sections and apartment detail pages.
- **HeroSimple**: Updated to reflect 50vh minimum height and use on apartment detail pages.

---

## 2026-04-04 - Revision 68: Standardize all R2 image keys to UUID format

### Requirements updated
- **REQ-CMS-2** (Media Library): Object key description updated from "descriptive slugs or opaque UUIDs" to "UUIDs" only.
- **REQ-CMS-6** (Preloaded Content): Image key description updated from "descriptive keys" to "UUID keys."
- **REQ-PERF-1** (Image Serving Pipeline): Acceptance criteria and status updated — object keys now described as "UUIDs" only, removing descriptive slug examples. Status updated from "descriptive keys" to "UUID keys."
- **REQ-VD-12** (Subpage Hero Pattern): Status updated — "descriptive slugs" replaced with "UUID keys."
- **REQ-VD-14** (Unique Imagery Per Page): Status updated — "descriptive keys" replaced with "UUID keys."
- **REQ-SF-8** (Gallery Page): Acceptance criteria and status updated — "descriptive slug keys" replaced with "UUID keys," removed example slug names.

### Constraints updated
- **CON-STACK**: R2 object key description updated from "descriptive slugs or opaque UUIDs" to "UUIDs."
- **CON-PERF**: Image key description updated from "descriptive slug or UUID keys" to "UUID keys."

### Glossary updated
- **Image Resizing**: Route key description updated from "descriptive slug or UUID" to "UUID."

### Cross-cutting
- All R2 image keys standardized to UUID format, matching Emdash's native upload format. Previously there was a mix of descriptive slugs (e.g., `island-hiking-trail`) and UUIDs. Now everything uses UUIDs consistently.

---

## 2026-04-04 - Revision 67: Real photos replace all stock imagery, R2 descriptive keys, Zadar guide

### Requirements updated
- **REQ-PERF-1** (Image Serving Pipeline): Photo count updated to 68. R2 object key naming updated from "opaque UUIDs" to "descriptive slugs or UUIDs" reflecting new naming convention (e.g., `island-hiking-trail`, `food-seafood-platter`). `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` added as Worker secrets.
- **REQ-CMS-6** (Preloaded Content): Status updated -- all 48 Pexels stock photo URLs replaced with real R2 photos in live D1 data. Zero stock photos remain in production. Added warning that `seed/seed.json` is out of sync with live D1 (still contains Pexels URLs). Photo count updated from 50+ to 68.
- **REQ-CMS-2** (Media Library): Object key description updated from "opaque UUIDs" to "descriptive slugs or UUIDs."
- **REQ-SF-8** (Gallery Page): Status updated -- 12 real island photos with descriptive R2 keys and zero stock photos.
- **REQ-VD-12** (Subpage Hero Pattern): Status updated -- descriptive slug keys noted (e.g., `island-hiking-trail`, `food-seafood-platter`).
- **REQ-VD-14** (Unique Imagery Per Page): Status updated -- 68 total photos, zero stock, descriptive keys.
- **REQ-ED-4** (Local Guide): Status updated -- Zadar guide section added to CMS in all 4 locales.

### Constraints updated
- **CON-STACK**: `CLOUDFLARE_ACCOUNT_ID` added to plaintext vars list (needed for R2 presigned upload URLs). `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` added to secrets list. Image route reference updated from `{uuid}` to `{key}` with descriptive slug explanation.
- **CON-PERF**: Image key description updated from "UUID keys" to "descriptive slug or UUID keys."

### Glossary updated
- **Image Resizing**: Route reference updated from `/api/img/{uuid}` to `/api/img/{key}`.

### Cross-cutting
- All hardcoded Pexels stock photo URLs in page files replaced with real R2 image keys using descriptive naming convention.
- Homepage duo images, triptych images, and all subpage hero images now use descriptive R2 keys.
- Gallery page: all 12 images switched from UUID keys to descriptive keys with updated alt text.
- `CLOUDFLARE_ACCOUNT_ID` added to `wrangler.jsonc` vars block.

---

## 2026-04-04 - Revision 66: ScrollCollage replaces horizontal scroll gallery on detail page, added to listing

### Requirements updated
- **REQ-AP-3** (Apartment Detail Page): Visual hierarchy item 2 updated -- "horizontal-scroll interior photo gallery" replaced with "`ScrollCollage` infinite-scroll collage." Matches current implementation item 2 which already described the ScrollCollage.
- **REQ-VD-15** (Exterior Photo Collage): Placement expanded -- collage is no longer homepage-only. Now also used on apartment listing page (exterior photos from same CMS editorial entry, default 35s speed) and apartment detail page (interior photos from `gallery` CMS field, faster 25s speed).

### Cross-cutting
- REQ-AP-2 (Apartment Listing Page) and REQ-AP-3 status line were already updated in a prior edit to reflect ScrollCollage usage. This revision corrects the remaining stale references.

---

## 2026-04-04 - Revision 65: Emdash cursor pagination -- D1 collage hack removed

### Requirements updated
- **REQ-CMS-1** (Emdash Integration): Content abstraction layer description updated -- `getLocalizedCollection` now uses cursor-based pagination (100 entries per page) to retrieve all entries from Emdash collections. This replaces the previous single unpaginated call that silently truncated large collections. File path reference (`src/lib/content.ts`) removed from spec per "no HOW" rule.

### Cross-cutting
- D1 direct-query fallback for homepage collage removed from `index.astro`. The collage previously bypassed the CMS API and read revision data directly from D1 when the unpaginated Emdash collection call didn't return the collage entry. With proper pagination, all entries (including collage) are retrieved through the standard CMS abstraction layer, eliminating the need for D1 SQL workarounds.

---

## 2026-04-04 - Revision 64: R2 media migration -- all images served via /api/img/{uuid}

### Requirements updated
- **REQ-PERF-1** (Image Serving Pipeline): Route changed from `/media/{key}` (rest parameter) to `/api/img/{key}` (simple param, UUID keys only). Implementation now uses Emdash storage abstraction with direct R2 bucket fallback. Status remains Partial (Image Resizing `cf: { image }` not yet applied). All 50+ site images migrated from local `/photos/` to R2.
- **REQ-VD-12** (Subpage Hero Pattern): Image source updated from local `/photos/` directory to R2 via `/api/img/{uuid}`. Status remains Implemented.
- **REQ-VD-14** (Unique Imagery Per Page): Image source updated from `/photos/` directory to R2 via `/api/img/{uuid}`. "When R2 pipeline is ready" migration note removed (migration complete). Status remains Implemented.
- **REQ-SF-1** (Hero Section): Image source updated from `/photos/` to R2 via `/api/img/{uuid}`. "Will move to R2" migration note removed (migration complete). Status remains Implemented.
- **REQ-SF-8** (Gallery Page): Image source updated from `/photos/` to R2 via `/api/img/{uuid}`. Status remains Implemented.
- **REQ-CMS-2** (Media Library): Worker route updated from `/media/{key}` to `/api/img/{key}`. Status unchanged.
- **REQ-CMS-6** (Preloaded Content): Photo references updated from `/photos/` directory to R2 via `/api/img/{uuid}`. Photo count updated to 50+.
- **REQ-AP-3** (Apartment Detail Page): `gallery_json` paths updated from `/photos/` to `/api/img/{uuid}`.
- **CON-STACK**: Image serving path updated from `/cdn-cgi/image/` to Worker route `/api/img/{uuid}` with `cf: { image }`.
- **CON-PERF**: Worker route updated from `/media/{key}` to `/api/img/{key}`.
- **CON-MEDIA**: Implicit -- photos now in R2, no local `/photos/` directory.

### Glossary updated
- **Image Resizing**: Updated from `/cdn-cgi/image/` reference to `cf: { image }` on Worker fetch via `/api/img/{uuid}`.

### Cross-cutting
- `public/photos/` directory removed entirely (50 image files). All images now stored in R2 with opaque UUID keys.
- `/api/ping` health check route removed (no spec coverage, no impact).
- All `.astro` page files updated from `/photos/*.jpg` paths to `/api/img/{uuid}` paths.
- Unit tests updated to use `/api/img/{uuid}` paths.

---

## 2026-04-04 - Revision 63: 404 page redesign, Schema.org homepage, image guards, status promotions

### Requirements updated
- **REQ-CMS-8** (Error Pages): Acceptance criteria and status updated -- 404 page redesigned with immersive photo-backed layout (full-bleed background, dark overlay, translucent "404" display text, ghost-style CTA buttons). Inline localized messages in all 4 locales replace `t()` for core content. Status changed from Partial to Implemented.
- **REQ-SEO-1** (Schema.org Structured Data): Acceptance criteria updated -- `LodgingBusiness` JSON-LD added to homepage with property name, locale-aware description, address (Fratarsko 5, Zdrelac), geo coordinates, numberOfRooms (2), amenityFeature (Wi-Fi, Parking, AC, BBQ). Verification criteria updated to include homepage LodgingBusiness. Status remains Partial (BreadcrumbList still missing on non-apartment pages).
- **REQ-ED-6** (About Zdrelac): Status changed from Partial to Implemented. Image guard added for conditional rendering. CMS editorial entries seeded for HR locale.
- **REQ-ED-9** (Nature & Activities): Image guard added for conditional rendering (only renders image div when CMS entry has `image` field). Status confirmed Implemented.
- **REQ-ED-10** (Beaches): Image guard added for conditional rendering. Status confirmed Implemented.
- **REQ-TC-2** (Privacy Policy): Status changed from Partial to Implemented. Page functional in all 4 locales with CMS override. Processor list and retention periods enhanceable via CMS seeding.
- **REQ-CMS-6** (Preloaded Content): Status detail updated -- zdrelac (6+) added to seeded editorial page_keys count, total 27+ HR entries.
- **REQ-CMS-9** (Cloudflare Access Auth): Status changed from Partial to Implemented.
- **REQ-ED-1** (Why Pasman), **REQ-ED-2** (Getting Here), **REQ-ED-5** (About Hosts), **REQ-ED-7** (FAQ), **REQ-ED-8** (Food & Drink): Status changed from Partial to Implemented.

### Cross-cutting
- All 6 editorial pages (zdrelac, aktivnosti, plaze, hrana, dolazak, zasto-pasman) now have consistent image guards -- image div only rendered when CMS entry has non-empty `image` field.

---

## 2026-04-04 - Revision 62: Gallery alt text rewrite + OG images per page

### Requirements updated
- **REQ-SF-8** (Gallery Page): Status detail updated -- gallery images expanded to 12 with accurate per-locale alt text and captions via inline `t4()` helper; each alt describes the actual photo content.
- **REQ-SEO-2** (Open Graph & Social): Status changed from Planned to Partial -- per-page OG images set on 10 subpages; default fallback for remaining pages; Twitter Card meta tags and per-apartment hero OG images still missing.

### Quality fixes
- **REQ-SEO-1**: Corrected premature Implemented status back to Partial (BreadcrumbList only on apartment detail pages, not all pages per AC; Google Rich Results Test validation pending).
- **REQ-SEO-2**: Corrected premature Implemented status to Partial (Twitter Card tags absent, per-apartment OG image not implemented).

---

## 2026-04-04 - Revision 61: Path traversal guard + collage JSON validation

### Requirements updated
- **REQ-PERF-1** (Image Serving Pipeline): Acceptance criteria updated -- media route now rejects keys containing `..` or leading `/` with 400 (path traversal prevention).
- **REQ-VD-15** (Exterior Photo Collage): Acceptance criteria updated -- collage JSON validated at render time; non-array values discarded, items without string `src`/`alt` filtered out.

---

## 2026-04-04 - Revision 60: Media route rest parameter fix + REQ-PERF-1 status update

### Requirements updated
- **REQ-PERF-1** (Image Serving Pipeline): Status changed from Planned to Partial -- R2 serving route exists and works with rest parameter `[...key]` for dotted filenames, long-lived cache headers, error handling. Image Resizing not yet applied. Route description updated from `/media/:key` to `/media/{key}` (rest parameter). Acceptance criteria updated to note rest parameter support.
- **CON-PERF**: Worker route description updated from `/media/:key` to `/media/{key}` reflecting rest parameter for dotted keys.
- **REQ-CMS-2** (Media Library): Route description updated from `/media/:key` to `/media/{key}` for consistency.
- **REQ-VD-15** (Exterior Photo Collage): Acceptance criteria corrected -- CMS field is `body` (not `gallery`), matching the actual implementation that parses JSON from the editorial entry body field.

---

## 2026-04-04 - Revision 59: Exterior photo collage + interior gallery separation

### Requirements added
- **REQ-VD-15** (Exterior Photo Collage): New requirement for infinite CSS horizontal scroll band of exterior photos on homepage. Status set to Partial -- component implemented, CMS not yet seeded.

### Requirements updated
- **REQ-VD-15**: Status corrected from Planned to Partial -- ScrollCollage component fully implemented and integrated into homepage, but CMS `collage` section_key entry not yet seeded.
- **REQ-AP-3** (Apartment Detail Page): Current implementation updated -- interior photo gallery added as horizontal snap-scroll strip below hero, sourced from `gallery_json` CMS field. Exterior photos explicitly separated to homepage collage (REQ-VD-15). Numbering in current implementation adjusted.
- **REQ-SF-5** (Why Pasman + Zdrelac Section): Apartments preview section updated -- exterior photo collage (REQ-VD-15) now placed after apartment cards within the dark section.

### Glossary
- Added **Scroll Collage** term.

---

## 2026-04-04 - Revision 58: Local Guide card-overlay redesign + Getting Here restructured

### Requirements updated
- **REQ-ED-4** (Local Guide): Acceptance criteria updated -- page layout changed from alternating content-row (image+text rows) to card-overlay grid. Each entry is now a visual card with full-bleed image background and gradient overlay (title + description). Responsive grid: 1-col mobile, 2-col 640px+, 3-col 1024px+. Cards have 16px border-radius, 4:3 aspect, hover zoom 1.06x.
- **REQ-ED-2** (Getting Here): Acceptance criteria and status updated -- page restructured from single CMS entry with `sections_json` (bespoke ferry/alt-route/airport sections) to individual `editorial` entries by `page_key === "dolazak"` (same pattern as all other editorial pages). New address + map links section at bottom with dark background, property address, Google Maps and Apple Maps deep-link buttons. Translation key `gettingHere.ourAddress` added in all 4 locales. CMS entries for `dolazak` not yet seeded.

### Translation keys added
- `gettingHere.ourAddress` in all 4 locales (hr, de, sl, en)

---

## 2026-04-04 - Revision 57: Local Guide card added to homepage triptych

### Requirements updated
- **REQ-SF-5** (Why Pasman + Zdrelac Section): Experience triptych expanded from 3 items to 4 -- added Local Guide card linking to `/{locale}/vodic` (REQ-ED-4). Grid changed from 3-column to responsive 2-column mobile / 4-column desktop (768px+ breakpoint). Updated card list and layout description.
- **REQ-VD-6** (Photo Frame Treatments): Triptych description updated from "3-col" to "4 items".
- **REQ-ED-4** (Local Guide): Added note that guide page is linked from homepage triptych as 4th card.

### Translation keys added
- `homepage.triptych.guideSubtitle` in all 4 locales (hr, de, sl, en)

---

## 2026-04-04 - Revision 56: 21 HR editorial entries seeded + why-pasman content model restructured

### Requirements updated
- **REQ-ED-1** (Why Pasman): Status updated -- content model restructured from single entry with `sections_json` to individual editorial entries (each entry = one content row with `title`, `body`, `image` fields, sorted by `sort_order`). Now consistent with REQ-ED-8/ED-9/ED-10 pattern. HR locale seeded with 4 sections.
- **REQ-ED-5** (About Your Hosts): Status updated -- HR locale seeded with host story entry.
- **REQ-ED-8** (Food & Drink): Status updated -- HR locale seeded with 5 sections.
- **REQ-ED-9** (Nature & Activities): Status updated -- HR locale seeded with 6 sections.
- **REQ-ED-10** (Beaches): Status updated -- HR locale seeded with 5 sections.
- **REQ-CMS-6** (Preloaded Content): Status updated -- 21 HR editorial entries now seeded via D1 SQL. Editorial seeding covers hrana, aktivnosti, plaze, why-pasman, about. DE/SL/EN editorial entries still missing.

---

## 2026-04-04 - Revision 55: Footer redesign and About Us CTA removal

### Requirements updated
- **REQ-SF-6** (Footer): Removed "Book direct -- no platform fees" trust message from AC (translation key `footer.bookDirect` deleted from all 4 locales). Added: physical address below tagline, SVG wave at top edge of footer, gradient background, gradient divider in bottom bar, inquiry/contact link in legal section. Added REQ-VD-9 dependency (wave pattern). Updated intent from "trust signals" to "property identity".
- **REQ-ED-5** (About Your Hosts): Status updated -- CTA linking to apartments page removed from bottom of About Us page per owner decision.

---

## 2026-04-04 - Revision 54: Cross-reference cleanup after deprecations

### Requirements updated
- **REQ-AP-3** (Apartment Detail Page): Dependencies updated — removed REQ-AP-4, REQ-AP-5, REQ-AP-6, REQ-BK-1 (all deprecated). Visual hierarchy AC items referencing deprecated features marked with strikethrough. Pricing table line removed from AC.
- **REQ-SF-7** (Sticky Mobile CTA): Dependencies updated — REQ-BK-1 and REQ-AP-4 replaced with REQ-BK-8. AC removed reference to future booking widget.
- **REQ-SF-6** (Footer): Removed "accessibility statement" from footer links in AC (page removed, REQ-TC-7 deprecated).
- **REQ-VD-12** (Subpage Hero): Removed "accessibility statement" from subpage list in AC.
- **REQ-SEO-4** (Multilingual Sitemap): Removed `pristupacnost` from public page list (page removed, REQ-TC-7 deprecated).
- **REQ-SEO-6** (Local SEO): Dependency on REQ-TC-3 (Impressum, deprecated) removed.
- **REQ-SEO-8** (Content Freshness): Dependency on REQ-CMS-4 (deprecated) replaced with REQ-CMS-9.

### Constraints updated
- **CON-A11Y**: Accessibility statement reference marked as deprecated (REQ-TC-7).
- **CON-LEGAL**: Accessibility statement reference removed.

### Structural note
19 requirements are deprecated across CMS, Booking, and Apartments domains. Many non-deprecated requirements (editorial, i18n, performance, SEO) still list REQ-CMS-1/CMS-2/CMS-5 as dependencies. These references remain valid because the Emdash CMS platform still exists and functions — the deprecation was about specific admin UX features (section toggles, mobile admin dashboard, media library requirements), not the CMS infrastructure itself. REQ-CMS-9 (Cloudflare Access) is the active CMS auth requirement.

---

## 2026-04-04 - Revision 53: User decisions - finalize partial requirements

### Requirements implemented (9)
- **REQ-SF-3** (Navigation): transparent-to-solid, hamburger, admin in footer
- **REQ-SF-4** (Language Switcher): all 4 locales always active, no filtering needed
- **REQ-SF-5** (Why Pašman + Ždrelac Section): cards + CMS content
- **REQ-SF-6** (Footer): complete, impressum removed
- **REQ-SF-7** (Sticky Mobile CTA): keep as is
- **REQ-SP-1** (Testimonials): homepage grid is enough
- **REQ-VD-9** (Wave Dividers): working, minor gap acceptable
- **REQ-BK-8** (Contact Page): form + Turnstile + Resend working
- **REQ-I18N-1** (Locale Routing): working

### Requirements deprecated (3)
- **REQ-AP-4** (Seasonal Pricing): no pricing on site, guests ask via inquiry
- **REQ-BK-6** (Booking Business Rules): current inquiry flow sufficient
- **REQ-TC-7** (Accessibility Statement): not needed for vacation rental

---


## 2026-04-03 - Revision 52: Real island photos, Impressum cleanup, fallback removal completion

### Requirements updated
- **REQ-VD-14** (Unique Imagery): Status Planned -> Implemented. Zero Pexels URLs remain in codebase. All pages use real island photos from `/photos/` directory. No non-Croatian imagery.
- **REQ-VD-12** (Subpage Hero): Status Partial -> Implemented. Pexels CDN workaround note removed. All subpage heroes use real Croatian photos.
- **REQ-SF-1** (Hero Section): Status Partial -> Implemented. Pexels CDN workaround removed. Hero carousel uses real island photos from `/photos/`.
- **REQ-SF-8** (Gallery Page): Acceptance criteria updated — images now from `/photos/` not Pexels CDN.
- **REQ-AP-2** (Apartment Listing): Fallback behavior updated — hardcoded Lavanda/Tramuntana examples removed; CMS-only.
- **REQ-ED-10** (Beaches): Status updated — Santorini hero replaced with real Croatian beach photo.
- **REQ-CMS-6** (Preloaded Content): Removed `impressum` from editorial seeding list (page deprecated). Updated stock media references to real photos.
- **REQ-CMS-7** (Content Safeguards): Removed Impressum from singleton pages list.

### Constraints updated
- **CON-LEGAL**: Impressum requirement struck (REQ-TC-3 deprecated).
- **CON-I18N**: Impressum German-always-available exception struck.

### Glossary updated
- **Impressum**: Marked as deprecated, referencing REQ-TC-3.

### Quality fixes
- README vision and domain table: "stock photography" -> "real island photography"; Impressum removed from Trust & Compliance description.
- Trust-compliance domain description: removed Impressum reference.
- CMS REQ-CMS-5 always-visible list: removed Impressum.
- TC-2 (Privacy Policy): removed stale "same exception as Impressum" cross-reference.

### Note
- Sitemap generator (`src/pages/sitemap.xml.ts`) still references `/impressum` route — dead link, needs code fix.

---

## 2026-04-03 - Revision 51: CMS-only content model — all hardcoded fallbacks removed

### Requirements updated
- **REQ-ED-1** (Why Pasman): Status updated — hardcoded selling points removed, now CMS-only via `editorial` collection. Empty content if unseeded.
- **REQ-ED-2** (Getting Here): Status updated — hardcoded transport sections removed, now CMS-only with empty-string defaults.
- **REQ-ED-4** (Local Guide): Acceptance criteria updated — guide categories and CMS editorial entries now rendered in one unified alternating content-row layout (previously separate sections).
- **REQ-ED-5** (About Hosts): Status updated — hardcoded host story removed, now CMS-only.
- **REQ-ED-6** (Zdrelac): Acceptance criteria and status updated — hardcoded Croatian/DE/SL/EN fallback sections removed. CMS-only.
- **REQ-ED-8** (Food & Drink): Acceptance criteria and status updated — now queries `editorial` collection by `page_key === "hrana"`. No hardcoded content.
- **REQ-ED-9** (Activities): Acceptance criteria updated — hardcoded fallback removed. CMS-only.
- **REQ-ED-10** (Beaches): Acceptance criteria updated — hardcoded fallback removed. CMS-only.
- **REQ-CMS-6** (Preloaded Content): Acceptance criteria updated — editorial seeding list expanded to include `why-pasman` and `dolazak` page_keys. Status updated to flag risk: incomplete seeding now produces visibly empty pages.

### Architectural change
- **CMS-only content model:** All editorial pages (`zasto-pasman`, `dolazak`, `o-nama`, `hrana`, `aktivnosti`, `plaze`, `zdrelac`, `vodic`) now render exclusively from CMS data. No hardcoded per-locale fallback content remains. Pages render empty sections when CMS entries are missing. This makes complete CMS seeding a hard prerequisite for a functional visitor-facing site. Only `faq`, `privatnost`, and `index` (homepage) retain some hardcoded fallbacks.

## 2026-04-04 - Revision 50: User decisions - deprecate skipped features, finalize target state

### Requirements deprecated
- **REQ-AP-5** (Availability Calendar): Deprecated. Availability handled through inquiry form.
- **REQ-AP-6** (Photo Gallery Lightbox): Deprecated. Horizontal scroll gallery is sufficient.
- **REQ-AP-7** (ICS Calendar Sync): Deprecated. Not needed for MVP.
- **REQ-BK-1** (Request-to-Book Widget): Deprecated. Simple contact form is the booking entry point.
- **REQ-BK-3** (WhatsApp Button): Deprecated. Only inquiry via contact form.
- **REQ-BK-4** (Click-to-Call): Deprecated. Contact form only.
- **REQ-BK-7** (Inquiry Lifecycle): Deprecated. Email-based workflow sufficient.
- **REQ-CMS-5** (Section Toggles): Deprecated. All sections always visible.
- **REQ-SF-7** (Sticky Mobile CTA): Keep as is - "Check availability" linking to contact.

### Requirements updated
- **REQ-AP-4** (Seasonal Pricing): If no pricing data in CMS, hide pricing entirely. Customers ask via inquiry.
- **REQ-TC-3** (Impressum): Deprecated. Not legally required in Croatia. Page removed.
- **REQ-TC-5** (GDPR): Consent text must link to Privacy Policy page.
- **REQ-SEO-2** (OG Images): Promoted to do now - set og:image per page using hero photos.
- **REQ-SEO-3** (Analytics): CF Web Analytics - enabled in dashboard, auto-injected.
- **REQ-BK-2** (Inquiry Pipeline): Email retry cron removed from scope. Single send attempt sufficient.

### Decisions
- Root URL keeps browser language detection (not forced to /hr/)
- Admin link stays in footer only
- Dead components removed: WhatsAppButton, AmenityGrid, PhotoGallery, PricingTable, WaveDivider
- All content managed via Emdash CMS, minimize hardcoded fallbacks
- Real island photos sourced and wired via CMS

---


## 2026-04-03 — Revision 49: Full Spec Audit — Status Corrections and Gap Identification

Comprehensive audit of all 87 requirements against actual codebase. Found 15 status inaccuracies where implementation state did not match spec status. No new requirements added; no requirements deprecated. All 87 IDs confirmed unique, all cross-references resolve, all CON-* references valid.

### Status corrections (Implemented to Partial) — 4 requirements
- **REQ-SEO-3** (Analytics): CF Web Analytics beacon not present in Base.astro -- pageview analytics not collected. Custom events via `/api/track` work.
- **REQ-TC-5** (GDPR Consent): Checkbox exists and works, but consent text does NOT hyperlink to Privacy Policy page.
- **REQ-AP-4** (Seasonal Pricing): PricingTable component and pricing.ts module exist, but PricingTable is not rendered on any page (dead component). Owner cannot manage seasons via CMS.
- **REQ-BK-6** (Booking Business Rules): Server-side pricing/availability logic works in API. CMS-facing features (owner-configurable settings, season validation) not built.

### Status corrections (Planned to Partial) — 7 requirements
- **REQ-SF-3** (Navigation): Transparent-to-solid transition, hamburger menu, mobile overlay, language picker all implemented. Admin link missing from nav (only in footer).
- **REQ-SF-4** (Language Switcher): LanguageSwitcher dropdown component works, mobile inline picker works. Locale activation filtering and cookie preference not implemented.
- **REQ-BK-3** (WhatsApp Button): WhatsAppButton component implemented with fixed-position floating button, 3s animation, pre-filled localized messages. CMS-managed number not yet implemented.
- **REQ-SP-1** (Testimonials): Homepage 3-column grid implemented, loads from CMS with Croatian fallback. Missing carousel, apartment detail placement, "most loved for" tags.
- **REQ-TC-7** (Accessibility Statement): Page exists at `/{locale}/pristupacnost` with content in all 4 locales, linked from footer. Not CMS-managed, missing contact info and known limitations.
- **REQ-TC-2** (Privacy Policy): Page exists at `/{locale}/privatnost` with content in all 4 locales plus CMS override. Missing data retention, processor list, WhatsApp disclosure.
- **REQ-TC-3** (Impressum): Page exists at `/{locale}/impressum` with template content plus CMS override. Contains placeholder values. German-always-available exception not enforced.
- **REQ-ED-1** (Why Pasman): Page exists at `/{locale}/zasto-pasman` with HeroSimple and hardcoded selling points in all 4 locales, CMS override. Missing: scroll-driven pinned sections, full-bleed photos.
- **REQ-ED-2** (Getting Here): Page exists at `/{locale}/dolazak` with hardcoded transport info in all 4 locales, CMS override. Missing: visual journey timeline, map, airport sections.
- **REQ-ED-5** (About Hosts): Page exists at `/{locale}/o-nama` with hardcoded host story in all 4 locales, CMS override. Missing: host photo, response badge, WhatsApp link.
- **REQ-ED-7** (FAQ): Page exists at `/{locale}/faq` with accordion UI, FAQPage schema, CMS override. Missing: category filtering, contextual placement.

### Status text corrections (no status level change)
- **REQ-SEO-1** (Schema.org): Updated status text -- FAQPage schema IS implemented on the FAQ page (was incorrectly listed as "Still missing"). BreadcrumbList on non-apartment pages remains the only gap.

### Gaps identified (no spec change, flagged for implementation)
- **REQ-BK-2**: `buildGuestEmail()` function exists but is never called -- guest auto-reply is dead code. Added to status text.
- **REQ-BK-2**: Cron Trigger for email retry not implemented (outbox pattern incomplete).
- **REQ-SF-3**: Admin link (`/_emdash/admin/`) present in Footer but missing from Navigation component per AC.
- **REQ-TC-5**: GDPR consent text lacks hyperlink to `/{locale}/privatnost`.
- **REQ-AP-4**: PricingTable.astro is dead code -- exists but never imported.

### Validation results (all passed)
- All 87 requirement IDs unique across 12 domain files
- All cross-references in Dependencies fields resolve
- All Status values are valid (Implemented, Partial, Planned, Deprecated)
- All requirements have all 9 required fields
- All CON-* references resolve to constraints.md definitions
- All 9 CON-* IDs are referenced by at least one requirement
- README domain table matches 12 domain files on disk
- Glossary terms are all used in at least one domain file

---

## 2026-04-03 — Revision 48: Unified Card Overlay Typography

Homepage card overlays (Zdrelac feature image and experience triptych) consolidated from separate CSS classes into a single `.card-overlay` system with shared gradient, label, and title styles.

### AC updated
- **REQ-VD-4:** Triptych label slide-in removed — overlays are now always-visible with unified gradient background, static label + title. No translateY animation.
- **REQ-SF-5:** Status updated from "links broken or not clickable" to "links functional with unified card overlay." CMS toggle still pending.

## 2026-04-03 — Revision 47: i18n Ternary Cleanup + Detail Page Fallbacks + Hero Wave Fix

Synced spec with commit replacing inline locale ternaries with `t()` calls across homepage, listing page, apartment detail page, and zdrelac page. ~20 new translation keys added to all 4 locale JSON files. Apartment detail page now has fallback data (Lavanda, Tramuntana) when CMS not seeded. Hero wave clipping bug fixed by moving `overflow:hidden` from `.hero` to `.hero__slide`. i18n completeness test added.

### Requirements updated
- **REQ-I18N-3** (UI String Translations): Status updated — inline ternaries replaced with t() calls; mixed-language bug on homepage CTA section addressed; ~20 new keys in all locale files; completeness test added. Remains Partial pending live verification.
- **REQ-AP-3** (Apartment Detail Page): Status updated — fallback apartment data added for CMS-not-seeded case; locale-aware labels now use t() calls. Remains Partial pending live verification.
- **REQ-SF-1** (Hero Section): Status updated — wave clipping fix noted. Remains Partial.

### No status promotions
All 3 requirements remain Partial — live site verification required before promotion.

---

## 2026-04-03 — Revision 46: Documentation Additions

Three missing documentation files created (`cms-guide.md`, `content-guide.md`, `troubleshooting.md`) and `authentication.md` updated with Cloudflare Access details. All files listed in `sdd/README.md` Documentation section now exist. No requirement status changes — no REQ-* entries were gated on documentation file existence.

## 2026-04-03 — Revision 45: Apartment Detail Enhancements + 404 Localization

Synced spec with commits 447c227 (apartment detail: Schema.org VacationRental, breadcrumbs, wave, lowestPrice) and a4db0c5 (localize 404 page). All statuses remain Partial pending live verification.

### Requirements updated
- **REQ-AP-3** (Apartment Detail Page): Status updated — Breadcrumbs component now renders visible breadcrumb UI + BreadcrumbList schema; VacationRental JSON-LD applied; inline SVG wave at hero bottom; lowestPrice passed to layout for sticky CTA. Still missing: lightbox, PricingTable.
- **REQ-SEO-1** (Schema.org Structured Data): Status updated — VacationRental JSON-LD on apartment detail pages with full property data; BreadcrumbList on apartment detail pages. Still missing: FAQPage schema, BreadcrumbList on non-apartment pages.
- **REQ-CMS-8** (Error Pages): Status updated — 404 now detects locale from URL prefix, renders localized message and CTAs via translation keys, links to locale-appropriate pages. Still missing: 500 hardcoded fallback shell.
- **REQ-SF-7** (Sticky Mobile CTA): Status promoted from Planned to Partial — lowestPrice now wired from apartment detail page through Page layout to StickyMobileCTA component. Still missing: listing page integration, disappear-on-viewport logic.

### No status promotions to Implemented
All 4 requirements remain Partial — live site verification required before promotion.

---

## 2026-04-03 — Revision 44: REQ-I18N-1 Hreflang Status Update

Updated REQ-I18N-1 status to reflect that `<link rel="alternate" hreflang>` tags are now rendered in the HTML `<head>` via the base layout (commit 001b2aa). Status remains Partial because disabled-locale 404 behavior and content fallback policy have not been verified live.

### Requirements updated
- **REQ-I18N-1** (Locale-Prefixed Routing): Status text updated — hreflang tags no longer missing from HTML head; remaining gaps are disabled-locale 404s and fallback policy verification.

---

## 2026-04-03 — Revision 43: Inline SVG Wave Spec Sync

Synced spec with code change replacing CSS `::after` mask-image waves with inline SVG waves on homepage hero and 4 editorial page heroes (hrana, aktivnosti, plaze, zdrelac). All statuses remain Partial pending live site verification.

### Requirements updated (acceptance criteria / status text)
- **REQ-VD-9** (Wave Section Dividers): Removed "CSS `::after` pseudo-element" as wave approach for custom hero pages; now specifies inline SVG exclusively. Updated status text to reflect waves added to homepage hero and all 4 custom hero pages.
- **REQ-VD-12** (Subpage Hero Pattern): Updated status text — waves now present on hrana/aktivnosti/plaze via inline SVG; Santorini imagery still flagged.
- **REQ-SF-1** (Hero Section): Updated status text — inline SVG wave now added at bottom of hero.
- **REQ-ED-6** (About Zdrelac): Updated wave description from "CSS `::after` with SVG mask-image" to "inline SVG with organic bezier path".
- **REQ-ED-8** (Food & Drink): Updated status text — inline SVG wave present in custom hero markup.
- **REQ-ED-9** (Activities): Updated status text — inline SVG wave present in custom hero markup.
- **REQ-ED-10** (Beaches): Updated status text — inline SVG wave present in custom hero markup; Santorini hero image still flagged.

### No status promotions
All 6 requirements remain Partial — status will change to Implemented only after live site verification confirms waves render correctly with no gaps or color mismatches.

---

## 2026-04-03 — Revision 42: Changelog Accuracy Fix

Spec reviewer audit of revision 41 changelog. Fixed 6 inaccuracies:

### Changelog corrections
- **REQ-SF-4** removed from "Implemented → Partial" list — was already Planned, no change was made in revision 41
- **REQ-SF-5, REQ-CMS-6, REQ-CMS-8, REQ-I18N-1** moved from "Implemented → Partial" to new "Planned → Partial" section (prior status was Planned, not Implemented)
- **REQ-SF-6** added to changelog — status changed Planned → Partial but was omitted from revision 41 entry

### Validation results (all passed)
- All 87 requirement IDs are unique across 12 domain files
- All cross-references in Dependencies fields resolve to existing requirements
- All Status values are valid (Implemented, Partial, Planned, Deprecated)
- All requirements have all 9 required fields
- All CON-* references resolve to constraints.md definitions
- No orphaned constraints (all 9 CON-* IDs are referenced)
- README domain table matches domain files (12 domains, 12 files)

---

## 2026-04-03 — Revision 41: Implementation Audit — Status Corrections and Missing AC

Comprehensive audit of all 12 domains against the live site. Corrected 16 statuses to "Partial" (11 from "Implemented", 5 from "Planned") where acceptance criteria are not fully met. Added missing acceptance criteria discovered during visual testing. REQ-SF-4 was listed in error in the original changelog (was already Planned, no change applied). REQ-SF-6 status correction was applied but omitted from the original changelog.

### Status corrections (Implemented → Partial) — 11 requirements
- **REQ-SF-1** (Hero Section): Wave at bottom missing, some non-Croatian stock photos
- **REQ-VD-9** (Wave Dividers): Waves missing from homepage hero and several subpage heroes; color transitions broken on homepage
- **REQ-VD-12** (Subpage Hero): Waves missing on hrana/aktivnosti/plaze; non-Croatian imagery (Santorini)
- **REQ-AP-3** (Apartment Detail): Lightbox, PricingTable, Breadcrumbs, Schema.org VacationRental not applied
- **REQ-BK-2** (Inquiry Pipeline): Email delivery via Resend unverified end-to-end
- **REQ-BK-8** (Contact Page): Never tested with real submission on live site
- **REQ-CMS-9** (CF Access Auth): Google login succeeds but Emdash admin shows "Authentication failed"
- **REQ-I18N-3** (UI Strings): Mixed languages on homepage CTA section
- **REQ-SEO-1** (Schema.org): VacationRental, BreadcrumbList, FAQPage not applied
- **REQ-ED-8** (Food & Drink): Hero uses custom markup without wave
- **REQ-ED-9** (Activities): Hero uses custom markup without wave
- **REQ-ED-10** (Beaches): Hero uses custom markup without wave; hero image is Santorini

### Status corrections (Planned → Partial) — 5 requirements
- **REQ-SF-5** (Why Pašman + Triptych): Triptych and village card links not clickable
- **REQ-SF-6** (Footer): Desktop works, mobile language picker not verified
- **REQ-CMS-6** (Preloaded Content): DE/SL locales largely missing; editorial page_keys not fully seeded
- **REQ-CMS-8** (Error Pages): 404 shows English regardless of URL locale
- **REQ-I18N-1** (Locale Routing): hreflang tags in sitemap only, missing from HTML `<head>`

### Removed (no actual change made)
- **REQ-SF-4** (Language Switcher): Listed in error — was already Planned, no status change applied

### New requirements
- **REQ-VD-13** (Icon System): MDI icons via `@mdi/js` — P1, Planned
- **REQ-VD-14** (Unique Imagery): No duplicate stock photos, no non-Croatian imagery — P1, Planned

### AC additions
- **REQ-SF-1:** Wave at hero bottom, imagery authenticity rules
- **REQ-SF-5:** Explicit clickability requirement for triptych cards and village card
- **REQ-VD-9:** Detailed wave color matching rules, explicit per-page wave requirement
- **REQ-VD-12:** Imagery authenticity, complete subpage list including editorial detail pages
- **REQ-AP-3:** Explicit PricingTable, Breadcrumbs, VacationRental schema requirements
- **REQ-BK-2:** Email delivery must be verified with real test submission
- **REQ-CMS-9:** Post-login redirect behavior, debugging checklist
- **REQ-CMS-6:** Editorial collection seeding for all page_keys, DE/SL completeness
- **REQ-CMS-8:** 404 localization per URL locale prefix
- **REQ-I18N-1:** hreflang explicitly in HTML `<head>`, not just sitemap
- **REQ-I18N-3:** No mixed languages on any page — explicit rule
- **REQ-ED-8/9/10:** Must use HeroSimple component; hero image authenticity per page topic

---

## 2026-04-03 — Revision 40: CMS Wiring for Activities/Beaches, Hero Overlay, Organic Images

Activities (`aktivnosti`) and Beaches (`plaze`) pages now query the `editorial` CMS collection (filtered by `page_key`, sorted by `sort_order`), falling back to hardcoded content when no CMS entries exist. This matches the pattern already established by the Zdrelac page (REQ-ED-6). Hero overlay gradient tuned to reduce bottom opacity (0.8 to 0.5) for better photo visibility. Food & Drink page images switched to organic asymmetric border-radius with box-shadow. Contact form gets mobile-responsive grid fix.

### AC updated
- **REQ-SF-1:** Hero overlay description updated from single linear gradient to dual-layer radial + linear overlay with reduced bottom opacity (50% instead of 70%).
- **REQ-ED-9:** Added CMS wiring acceptance criterion (editorial collection, page_key "aktivnosti", sort_order, hardcoded fallback).
- **REQ-ED-10:** Added CMS wiring acceptance criterion (editorial collection, page_key "plaze", sort_order, hardcoded fallback).
- **REQ-ED-8:** Image border-radius updated from 16px to organic asymmetric (`20px 4px 20px 4px`) with box-shadow.

---

## 2026-04-03 — Revision 39: Cloudflare Access Replaces Magic Link Auth

Admin authentication switched from Emdash magic link (Resend email plugin) to Cloudflare Access zero-trust proxy. The `access()` plugin from `@emdash-cms/cloudflare` is configured in Astro config with team domain, AUD env var, and auto-provisioning. The custom login page (`admin-login.astro`) and Resend email delivery plugin for auth are removed. Resend remains for inquiry notifications and guest auto-replies.

### Requirements added
- **REQ-CMS-9: Cloudflare Access Authentication** — P0, Status: Implemented. Covers Access plugin config, auto-provisioning, JWT validation via `CF_ACCESS_AUDIENCE`, failure modes, and revocation.

### Requirements deprecated
- **REQ-CMS-3: Magic Link Authentication** — Status: Deprecated. Replaced by REQ-CMS-9. Resend-based magic link proved unreliable due to Vite build-time limitations.

### Constraints updated
- **CON-SEC:** "Magic Link authentication via Resend" replaced with "Cloudflare Access authentication (zero-trust, JWT validation)".
- **CON-STACK:** Added `CF_ACCESS_AUDIENCE` secret. Removed "magic link codes" from email sender domain description. Noted admin auth handled by Cloudflare Access.

### Glossary updated
- **Magic Link:** Marked as deprecated, references REQ-CMS-9.
- **Cloudflare Access:** New term added.

---

## 2026-04-03 — Revision 38: Sitemap Completeness Fix + Requirements Audit

Sitemap (`src/pages/sitemap.xml.ts`) updated to include 4 missing public pages: `/hrana`, `/aktivnosti`, `/plaze`, `/kontakt`. All 16 public routes are now in the sitemap with per-locale alternates. A 260-line missed requirements audit (`seed/missed-requirements.md`) was added documenting 20 gaps between user requests and current implementation. The audit confirms the spec is accurate in its status markings -- most flagged gaps correspond to requirements already marked `Status: Planned`.

### Status updated
- **REQ-SEO-4:** `Planned` -> `Implemented`. Acceptance criteria updated with full page list, response headers, and planned enhancements (dynamic apartment URLs, locale filtering from site-settings).

### Audit alignment notes (no spec changes needed)
- Items #6 (content via CMS), #7 (detail pages), #11 (section toggles), #12 (preloaded content) are covered by existing Planned requirements: REQ-CMS-1, REQ-CMS-5, REQ-CMS-6, REQ-AP-3
- Items #3 (Emdash auth) addressed in Revision 37 (REQ-CMS-3 AC updated)
- Items #10 (admin nav link) covered by REQ-SF-3 AC (Status: Planned)
- Item #2 (calendar date picker) covered by REQ-BK-1 (Status: Planned); interim contact page (REQ-BK-8) uses native date inputs
- Item #4 (photo lightbox) covered by REQ-AP-6 (Status: Planned)
- Items #5, #14, #19, #20 (visual polish: animations, hero fade, organic images, color transitions) relate to REQ-VD-3, REQ-VD-6, REQ-VD-9 implementation refinements
- Item #15 (panoramic video) covered by REQ-SF-2 (Status: Planned, P2)
- Item #17 (sitemap) resolved in this commit

## 2026-04-03 — Revision 37: Resend Email Plugin for Emdash Magic Link Auth

Custom Emdash plugin (`resend-email`) registered in Astro config to handle `email:deliver` hook. Sends magic link codes via Resend API. API key stored in Emdash plugin KV store (key: `resend_api_key`) to work around the Vite build-time limitation where `cloudflare:workers` bindings are unavailable. Key is cached in-memory after first fetch. This replaces the previous "login bypass mode" — Emdash admin panel now has a working email delivery gate.

### AC updated
- **REQ-CMS-3:** Replaced "login bypass mode" description with working Resend plugin details (KV-stored API key, `email:deliver` hook, recipient validation, error handling).

### Constraints updated
- **CON-STACK:** `RESEND_API_KEY` moved from `wrangler secret put` to Emdash plugin KV store. Vite build limitation workaround documented.

### Glossary updated
- **Resend:** Updated to include CMS authentication use case.
- **Plugin KV:** New term — Emdash's key-value store for plugin configuration.

## 2026-04-03 — Revision 36: Wave Divider Sizing and Positioning Fix

WaveDivider component updated: responsive height increased from `clamp(40px, 6vw, 80px)` to `clamp(50px, 8vw, 100px)` for more prominent wave transitions. Negative margin (`-1px`) eliminates subpixel seam gaps between wave and adjacent sections. Added `position: relative` and `z-index: 2` to ensure wave layers above section backgrounds. Style scope changed to global for consistent application. Homepage Zdrelac feature image no longer constrained by `.container` class, enabling true full-width display.

### AC updated
- **REQ-VD-9:** Responsive height updated from `clamp(40px, 6vw, 80px)` to `clamp(50px, 8vw, 100px)`.
- **REQ-VD-7:** Same height value updated in wave divider description.
- **REQ-VD-12:** Same height value updated in subpage hero wave description.

## 2026-04-03 — Revision 35: Contact Form Date Picker Inputs

The contact inquiry page (`/{locale}/kontakt`) now uses two native `type="date"` inputs (check-in and check-out) instead of a single freeform text field for preferred dates. Labels are localized across all 4 locales (Dolazak/Odlazak, Anreise/Abreise, Prihod/Odhod, Check-in/Check-out). The dates row uses a 3-column grid layout (check-in, check-out, guests). On submission, the date range and guest count are appended to the message body so the owner sees complete details in the email. Added `@mdi/js` dependency.

### AC updated
- **REQ-BK-8:** "preferred dates (freeform text)" replaced with "check-in date and check-out date (native date inputs)". Added detail on date concatenation into message body for API payload.

## 2026-04-03 — Revision 34: Wave Dividers on Food & Drink and Zdrelac Hero Sections

Food & Drink (`hrana`) and Zdrelac pages now have wavy line dividers at the bottom of their hero sections, matching the wave transition pattern established in REQ-VD-9. These pages use custom hero markup (`.page-hero`, `.village-hero`) rather than the shared `HeroSimple` component, so the wave is implemented via CSS `::after` pseudo-element with SVG `mask-image` instead of inline SVG. Same wave path, same cream fill (`#F8F5EF`), same responsive height. Activities and Beaches pages use the same hero class but do not yet have the wave divider.

### AC updated
- **REQ-VD-9:** Documented the CSS `::after` + mask-image alternative for pages with custom hero markup (not using HeroSimple).
- **REQ-ED-8:** Added wave divider to hrana page hero description.
- **REQ-ED-6:** Added wave divider to zdrelac page hero description.

## 2026-04-03 — Revision 33: Apartment Listing CTA and CSP connect-src for Turnstile

Apartment listing page CTA now links to `/{locale}/kontakt` instead of `mailto:`, aligning with REQ-BK-8 which requires all site CTAs to route through the contact inquiry page. CSP `connect-src` directive updated to allow `https://challenges.cloudflare.com` for Turnstile widget verification callbacks.

### AC updated
- **REQ-AP-2:** Inquiry section CTA description changed from "email CTA" to kontakt page link, referencing REQ-BK-8.
- **REQ-TC-6:** `connect-src` acceptance criterion updated from `'self'` to `'self' https://challenges.cloudflare.com` to reflect Turnstile's runtime network requirements.

## 2026-04-03 — Revision 32: Zdrelac Page CMS Wiring and Encyclopedic Content

The Zdrelac village page now queries the CMS `editorial` collection (filtered by `page_key === "zdrelac"`, sorted by `sort_order`) with graceful fallback to hardcoded content. Croatian fallback content expanded from 4 generic sections to 6 encyclopedic sections covering the bridge, Veliki Bokolj peak, Benedictine monastery Cokovac, olive groves, St. Michael's Fortress, and Galovac islet with caves. DE/SL/EN fallback content retained at 4 sections. The `editorial` collection is now queried by multiple pages (homepage, zdrelac, and others) but is not yet present in seed data.

### AC updated
- **REQ-ED-6:** Updated to document CMS wiring via editorial collection with page_key filter, expanded Croatian fallback content (6 encyclopedic sections), and CMS-override behavior (suppresses intro paragraph). Added REQ-CMS-1 dependency.
- **REQ-CMS-1:** Added `editorial` to collection list as a queried-but-not-yet-seeded collection.

## 2026-04-03 — Revision 31: Subpage Hero Images and Wave Dividers

All 11 subpages now display full-width background photography in their hero sections via the enhanced `HeroSimple` component. The component accepts an optional `image` prop, rendering a photo with dark gradient overlay, subtle Ken Burns animation (20s, 1.06x scale), and a bottom wave SVG divider that bridges into page content. When no image is provided, the original gradient fallback is preserved. Stock photos from Pexels CDN used as temporary placeholders.

### Requirements added
- **REQ-VD-12:** Subpage Hero Pattern — documents the enhanced HeroSimple component with image support, overlay, Ken Burns animation, and inline wave divider across all non-homepage pages.

### AC updated
- **REQ-VD-9:** Added subpage hero wave dividers as a second placement context (in addition to homepage section transitions).
- **REQ-SF-8:** Gallery page now references REQ-VD-12 for its photo-backed hero.
- **REQ-ED-4:** Local guide page now references REQ-VD-12 for its photo-backed hero.
- **REQ-AP-2:** Apartment listing page now references REQ-VD-12 for its photo-backed hero.
- **REQ-BK-8:** Contact inquiry page now references REQ-VD-12 for its photo-backed hero.

### Glossary
- Added "HeroSimple" term.

## 2026-04-03 — Revision 30: Global CloudflareBindings Interface

Env type declaration moved from module augmentation (`declare module "cloudflare:workers"` with `CloudflareEnv` interface in `src/lib/env.ts`) to a global ambient declaration (`declare global { interface CloudflareBindings }` in `src/env.d.ts`). The `CloudflareBindings` interface is the standard Cloudflare pattern for typing the `env` export from `cloudflare:workers`. All side-effect imports (`import "~/lib/env"`) removed from API routes — the global declaration applies project-wide without explicit imports.

### Constraints updated
- **CON-STACK:** Env access pattern updated to document global `CloudflareBindings` interface in `src/env.d.ts` (replaces `CloudflareEnv` module augmentation via shared side-effect import).

## 2026-04-03 — Revision 29: Astro v6 Env Migration, Email Sender Domain

All API routes migrated from `getEnv(locals)` helper (extracting env from `locals.runtime.env`) to direct `import { env } from "cloudflare:workers"` module import (Astro v6 pattern). The `getEnv()` function is removed. Non-secret config (`ADMIN_EMAILS`, `TURNSTILE_SITE_KEY`) moved to `wrangler.jsonc` `vars` block. Email sender address changed from `noreply@apartmani.hr` to `noreply@graymatter.ch` across all transactional emails (inquiry notifications, magic link codes, guest auto-replies). New bindings declared in env types: `SESSION` (KVNamespace), `IMAGES`, `ASSETS` (Fetcher). R2 presigned URL auth credentials (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) removed from env interface.

### Constraints updated
- **CON-STACK:** Documented Astro v6 env access pattern (`cloudflare:workers` module import), non-secret vs secret config split, and email sender domain (`noreply@graymatter.ch`).

### AC updated
- **REQ-BK-2:** Added sender address (`noreply@graymatter.ch`) to owner notification and guest auto-reply email criteria.
- **REQ-CMS-3:** Added sender address to magic link email delivery criterion.

### Glossary
- **Caustics:** Marked as superseded (no longer rendered, replaced by Wave Divider).

## 2026-04-03 — Revision 28: WaveDivider Component, Apartment Detail Fix

Reusable `WaveDivider` component replaces the `.water-flow` CSS utility class approach for section transitions. Three wave dividers added to homepage: cream-to-dark before apartments, dark-to-cream after apartments, cream-to-dark before sunset CTA. The component uses inline SVG with organic bezier curves, configurable fill color, optional vertical flip, and responsive height. Apartment detail page data loading fixed — switched from broken `getLocalizedEntry` wrapper to direct `getEmDashEntry` call with proper data unwrapping.

### AC updated
- **REQ-VD-9:** Rewritten from water-flow CSS utility (mask-image wave + caustics shimmer on apartments section) to standalone WaveDivider component approach. Previous water-flow class marked as superseded. Now describes reusable SVG component with fill/flip props and 3 homepage placements.
- **REQ-VD-7:** Wave separator reference updated to cite REQ-VD-9 and reflect new responsive height.
- **REQ-VD-4:** Section divider micro-interaction updated — now always-visible WaveDivider, no longer scroll-triggered reveal.

### Glossary
- Added "Wave Divider" term.

### Stale content cleaned
- **REQ-VD-3:** Removed "caustics drift" from reduced-motion effects list — caustics are no longer rendered (water-flow class superseded by WaveDivider).

### Bug fixes (no spec change)
- Apartment detail page (`/{locale}/apartmani/{slug}`) data loading fixed. Was using `getLocalizedEntry` (undefined/broken), now uses `getEmDashEntry` directly. REQ-AP-3 acceptance criteria unchanged — the fix makes behavior match the existing spec.

## 2026-04-03 — Revision 27: Remove Resend Plugin, Continuous Hero Zoom

Removed Emdash Resend email plugin (`resendEmailPlugin`) from Astro config due to Vite build incompatibility — `cloudflare:workers` module cannot be resolved at build time. Emdash admin panel reverts to login bypass mode. The custom Magic Link auth flow (`/admin/api/login` + `/admin/api/verify`) is unaffected as it uses Resend directly via fetch. Hero carousel Ken Burns effect upgraded from a one-shot 8s CSS transition (scale 1 to 1.08) to a continuous 12s keyframe animation (scale 1 to 1.1 with translate3d drift, infinite alternate), ensuring the hero image is never static.

### AC updated
- **REQ-SF-1:** Ken Burns AC updated — now uses `@keyframes heroZoom` (12s ease-in-out infinite alternate, scale 1.0 to 1.1 with drift) instead of 8s one-shot transition. Animation paused by default, plays on `.is-active`.
- **REQ-VD-3:** Ken Burns AC updated to match new continuous keyframe animation behavior.
- **REQ-CMS-3:** Added note that Emdash admin panel operates in login bypass mode due to Resend plugin removal. Custom auth flow unaffected.

### Constraints updated
- **CON-STACK:** Added Vite build limitation note — `cloudflare:workers` cannot be imported at build time, preventing Emdash plugins from accessing Worker env bindings.

## 2026-04-03 — Revision 26: Contact Page with Inquiry Form

Standalone contact page at `/{locale}/kontakt` implementing the Quick Question path from the booking domain. Simplified inquiry form with name, email, phone, dates (freeform text), guests, and message — localized labels in all 4 locales. Turnstile CAPTCHA (invisible mode), honeypot field, GDPR consent checkbox. Submits to `/api/inquiry` as JSON. All site CTA links (navigation, homepage, apartment detail) updated from anchor-based `#inquiry` targets to the dedicated `/kontakt` page. This is an interim implementation ahead of the full two-tab request-to-book widget (REQ-BK-1).

### Requirements added
- **REQ-BK-8:** Contact inquiry page — standalone `/kontakt` route with simplified inquiry form as interim booking entry point.

### AC updated
- **REQ-BK-1:** Status remains Planned; added note that the interim contact page (REQ-BK-8) serves as the primary inquiry path until the full widget is built.
- **REQ-SF-3:** CTA destination updated from `#inquiry` anchor to `/kontakt` page.

### Quality issues noted
- GDPR consent checkbox text does not link to Privacy Policy page (required by REQ-TC-5 AC and REQ-BK-1 AC). Flagged for follow-up fix.

## 2026-04-03 — Revision 25: Premium CSS Effects (Sunset Gradient, Water-Flow Divider, Breathing Cards, Animated Links)

Homepage upgraded with four premium CSS-only effects: animated sunset gradient on CTA section (18s color-shifting cycle with haze overlay), water-flow liquid divider on apartments section (SVG wave mask + caustics shimmer), breathing image card component (7.5s scale/drift cycle with glassmorphism caption), and animated link underline utility. All effects include dedicated `prefers-reduced-motion` handling. CTA section button changed from primary to ghost variant for contrast on gradient background.

### Requirements added
- **REQ-VD-9:** Water-flow section divider — SVG mask wave + caustics shimmer animation utility class.
- **REQ-VD-10:** Breathing image cards — subtle scale/drift animation with warm overlay and glassmorphism caption.
- **REQ-VD-11:** Animated link underline — background-size hover transition utility class.

### AC updated
- **REQ-VD-8:** Sunset gradient redefined from subtle static cream-to-sand blend to dramatic animated multi-color gradient (navy/azure/gold/terracotta/purple, 18s cycle, haze overlay). Added reduced-motion constraint.
- **REQ-VD-3:** Reduced-motion AC expanded to reference new premium effects (sunset, haze, caustics, breathing) with dedicated disable block.
- **REQ-VD-4:** Ghost button variant noted as preferred on dark/gradient backgrounds (sunset CTA).

### Glossary
- Added "Caustics" and "Glassmorphism" terms.

## 2026-04-03 — Revision 24: Content Detail Pages (Food, Activities, Beaches) + Triptych Links

Three local guide categories expanded from summary entries on `/vodic` to standalone detail pages with full-screen heroes, real Croatian island content (named restaurants, beaches, parks with distances from Zdrelac), and 4-locale translations. Homepage experience triptych items converted from static divs to clickable links pointing to these detail pages.

### Requirements added
- **REQ-ED-8:** "Food & Drink" detail page at `/{locale}/hrana` — konobas, restaurants, specialties, local products, markets with distances.
- **REQ-ED-9:** "Nature & Activities" detail page at `/{locale}/aktivnosti` — walks, cycling, Kornati, Telascica, water sports, history.
- **REQ-ED-10:** "Beaches" detail page at `/{locale}/plaze` — Zdrelac coves, Pasman beaches, Ugljan beaches, hidden coves, practical tips.

### AC updated
- **REQ-ED-4:** Added note that three guide categories now have standalone detail pages (REQ-ED-8, REQ-ED-9, REQ-ED-10).
- **REQ-SF-5:** Triptych items updated from static `<div>` to clickable `<a>` elements linking to food, activities, and beaches detail pages.

### Glossary
- Added "Maestral" term.

## 2026-04-03 — Revision 23: Gallery Page, Ždrelac Village Page, Navigation Restructuring

Gallery page added with masonry-like grid layout and hover effects. Ždrelac village gets a full standalone page with aerial hero and alternating content rows. Navigation restructured: "Why Pašman" and FAQ removed from primary nav, replaced with Ždrelac and Gallery links.

### Requirements added
- **REQ-SF-8:** Gallery Page — standalone photo gallery at `/{locale}/galerija` with masonry grid, hover effects, per-locale captions.

### AC updated
- **REQ-ED-6:** Upgraded from short homepage section to full standalone page with 70vh hero, 4 alternating content sections, CTA. Route: `/{locale}/zdrelac`.
- **REQ-SF-3:** Added current nav item order (Apartments, Ždrelac, Gallery, Getting Here, Local Guide, About). Documented removal of "Why Pašman" and FAQ from primary nav.

### Status changes
- **REQ-ED-6:** Planned -> Implemented (standalone village page with hardcoded 4-locale content).

### No status changes
- REQ-SF-3 remains Planned (focus trapping, IntersectionObserver scroll transition still missing).
- REQ-SF-8 is new, Status: Implemented.

### Glossary
- Added "Masonry Grid" term.

## 2026-04-03 — Revision 22: Hero Carousel, Apartment Detail Page, Navigation Fix

Hero section upgraded from single static image with CSS Ken Burns to a 4-image crossfade carousel with progress dots, auto-advance (6s), and per-slide Ken Burns zoom. Apartment detail page route added (`/{locale}/apartmani/{slug}`) with hero image, meta grid, price card, amenities, and description. Apartment listing cards now link to detail pages. Navigation scripts converted to `is:inline` to fix hamburger menu bundling issue. Photo strip removed from homepage (images consolidated into hero carousel).

### AC updated
- **REQ-SF-1:** Replaced single-image Ken Burns with crossfade carousel (4 slides, 1.8s fade, 6s interval, progress dots, pause-on-hover). Updated "Future enhancement" to reference CMS-managed image selection instead of carousel itself (carousel is now implemented).
- **REQ-SF-5:** Photo strip between hero and "Why Pasman" removed. Images consolidated into hero carousel. Wave separators between hero and first section also removed.
- **REQ-AP-2:** Cards now wrapped in full-card `<a>` link to apartment detail page.
- **REQ-AP-3:** Added "Current implementation" section documenting route, hero, meta grid, price card, amenities sidebar, and responsive layout. Full target hierarchy retained for tracking remaining work.
- **REQ-VD-3:** Ken Burns updated from CSS `@keyframes` infinite animation to CSS `transition` per active carousel slide (8s ease-out, scale 1.08).
- **REQ-VD-6:** Photo strip treatment marked as removed (images moved to hero carousel).

### Status changes
- **REQ-AP-3:** Planned -> Implemented (partial — hero, meta, price card, amenities, description, back link. Gallery, availability, inquiry widget, trust strip, bed config, house rules, floor plan, FAQs still planned).

### No status changes
- REQ-SF-1 remains Implemented (carousel replaces static image — enhancement, not regression).
- REQ-SF-5 remains Planned (CMS toggles, editorial content, triptych still not wired).
- REQ-AP-2 remains Implemented (card links are an enhancement).
- REQ-VD-3 remains Implemented (Ken Burns mechanism changed, effect preserved).
- REQ-VD-6 remains Implemented (photo strip removed, other treatments unchanged).

### Glossary
- Added "Crossfade Carousel" term.

## 2026-04-02 — Revision 21: Organic Visual Polish (e437ff7)

Homepage visual system overhauled from edge-to-edge flat imagery to organic curved containers. All homepage photo treatments now use rounded corners (16-24px), gaps, shadows, and hover interactions. Wavy SVG section dividers replace straight lines. Triptych labels slide in on hover. Gradient utility classes added. Mobile navigation gains inline language picker. New favicon.

### AC updated
- **REQ-VD-3:** Added breathing/floating keyframes (breathe, float, slowZoom) and utility classes. Updated section divider animation from line-extend to wavy SVG fade-in.
- **REQ-VD-4:** Added triptych label slide-in, testimonial card lift, tag pill hover fill, image hover zoom ranges. Updated section divider micro-interaction.
- **REQ-VD-6:** Rewrote homepage photo system from edge-to-edge/no-radius to organic curved containers (16-24px radius, gaps, shadows, hover zoom). Photo strip, feature image, duo-image, and triptych all updated.
- **REQ-VD-7:** Section dividers changed from 120px straight line at 0.6 opacity to wavy SVG mask at 0.3 opacity plus full-width wave separators between sections.
- **REQ-SF-3:** Mobile hamburger menu now includes inline language picker with active locale highlighting.
- **REQ-SF-5:** Photo strip, Zdrelac feature image, duo images, triptych, and tags all updated from edge-to-edge flat to contained organic style. Wave separators added between sections. Triptych wrapped in gradient background section.

### Requirements added
- **REQ-VD-8:** Gradient Utility System — warm, azure, and sunset gradient utility classes for section backgrounds.

### Status changes
- **REQ-VD-6:** Planned -> Implemented (homepage photo treatments now fully built with organic curved style).

### No status changes
- REQ-VD-3 remains Implemented (keyframe additions).
- REQ-VD-4 remains Implemented (new hover effects added).
- REQ-VD-7 remains Implemented (divider style updated).
- REQ-SF-3 remains Planned (focus trapping still missing).
- REQ-SF-5 remains Planned (CMS toggle, full editorial content not yet wired).

## 2026-04-02 — Revision 20: Emdash CMS Wiring, Seed Data, Design Polish (f4485a5)

All pages wired to Emdash CMS with locale-aware queries and Croatian fallback. Comprehensive seed data (6 collections in 4 locales). Apartment listing page redesigned from "coming soon" to real card grid. Testimonials rendered on homepage. Ken Burns hero animation. Font swap to DM Serif Display. Admin nav link. Custom domain configured. Alt text on all images.

### AC updated
- **REQ-SF-1:** Added Ken Burns CSS animation on hero background (scale 1 to 1.08, 20s alternating). Updated future enhancement note to clarify single-photo Ken Burns is the current state, multi-image slideshow is planned.
- **REQ-SF-3:** Added admin link AC. Navigation now includes `/_emdash/admin/` link in both desktop and mobile menus. Fixed stale AC: hamburger button now uses CSS class `.nav__hamburger` (not inline styles as previously stated).
- **REQ-VD-2:** Font swap from Cormorant Garamond to DM Serif Display (transitional serif, 400 weight). Inter changed to variable font (100-900 weight range). Both self-hosted as woff2 with preload.
- **REQ-VD-3:** Added Ken Burns keyframe documentation.
- **REQ-AP-2:** Replaced "coming soon" lifestyle layout AC with card grid implementation. Cards show hero photo (3:2), name, tagline, meta row, "Best for" badge, price, and inquiry CTA. Added fallback behavior (two hardcoded example apartments when CMS is empty).
- **REQ-CMS-1:** Updated content query mechanism from "Astro Live Collections" to Emdash content loader with locale-aware abstraction layer. Updated collection list to reflect current seed state.
- **REQ-CMS-6:** Added seed API endpoint (`POST /api/admin/seed`) and comprehensive seed data documentation (6 collections, 4 locales).
- **REQ-SP-1:** Added homepage testimonials implementation: 3-column grid, blockquote cards, locale-filtered with Croatian fallback, hidden when empty.
- **CON-STACK:** Added custom domain `apartmani.novoselec.ch`.

### Status changes
- **REQ-AP-2:** Remains Implemented (AC updated from coming-soon to card grid).
- **REQ-SF-3:** Remains Planned (focus trapping still missing).

### No status changes
- REQ-CMS-1 remains Planned (full admin walkthrough, Magic Link auth, failure modes not yet verified).
- REQ-CMS-6 remains Planned (placeholder marking, dashboard checklist, stock media files not yet delivered).
- REQ-SP-1 remains Planned (carousel, contextual placement on apartment detail pages, "most loved for" tags not yet implemented).
- REQ-VD-2 remains Implemented (font swap is a design refinement, not a regression).
- REQ-VD-3 remains Implemented (Ken Burns keyframe is an addition to existing animation system).

### Glossary
- Added "DM Serif Display" term.

## 2026-04-02 — Revision 19: Switch i18n to Manual Routing (980f49c)

Astro i18n routing changed from `prefixDefaultLocale: true` to manual mode. This prevents Astro's built-in i18n middleware from intercepting non-locale paths (e.g., `/_emdash/`) as locale params, which was the root cause of the Emdash admin 404 fixed in Revisions 17-18. With manual routing, the underscore-prefix guards added in Revision 18 and the `_emdash` catch-all page added in Revision 17 are no longer needed and were removed.

### No AC changes
- **REQ-I18N-1:** No acceptance criteria change. The observable routing behavior (locale-prefixed URLs, invalid-locale redirect to `/hr/`) is unchanged. The routing mode is an implementation detail not captured in the spec.
- **REQ-CMS-1:** No change. The admin panel at `/_emdash/admin/` continues to work; the conflict between locale routing and CMS paths is resolved at the framework level rather than with route guards.

### No status changes
- REQ-I18N-1 remains Planned.
- REQ-CMS-1 remains Planned.

## 2026-04-02 — Revision 18: Fix Emdash Admin 404 (16a445e)

Trailing-slash redirect middleware was stripping slashes from `/_emdash/` paths, causing the admin panel to return 404. Middleware now excludes `/_emdash/` paths from slash normalization. Additionally, all `[locale]` dynamic routes now early-return 404 for underscore-prefixed params (e.g., `_emdash`) so Astro does not treat CMS paths as locale routes.

### AC clarified
- **REQ-CMS-1:** No change to acceptance criteria or status. The admin panel route `/_emdash/admin/` was already specified; this fix ensures middleware and locale routing do not interfere with it. REQ-CMS-1 remains Planned because the full CMS integration (D1, R2, collections, authentication) is not yet implemented.
- **REQ-I18N-1:** No AC change needed. The locale validation already implies non-locale prefixes return 404. The route guards are an implementation detail ensuring `[locale]` catch-all routes do not intercept reserved CMS paths.

### No status changes
- REQ-CMS-1 remains Planned.
- REQ-I18N-1 remains Planned.

## 2026-04-02 — Revision 17: Local Guide & Apartment Listing Redesign (52627b7)

Local guide page redesigned from emoji icon category cards to alternating image+text layout with per-locale descriptions. Apartment listing page redesigned from placeholder card grid to lifestyle "coming soon" layout with duo images and inquiry CTA.

### AC updated
- **REQ-ED-4:** Added "Pre-CMS state (current)" AC documenting the alternating image+text layout with 4 categories (Beaches, Food & Drink, Activities, Day Trips), 3:2 landscape photos, and per-locale text. "Restaurants & Konobas" deferred to CMS phase. Status changed from Planned to Implemented.
- **REQ-AP-2:** Added "Pre-CMS state (current)" AC documenting the lifestyle coming-soon layout with duo-image grid (3:4, 4px gap), localized teaser text, heading, and inquiry CTA. Old card grid AC preserved under "With CMS (planned)". Zero-apartment handling updated to reference new layout.

### Status changes
- **REQ-ED-4:** Planned -> Implemented (pre-CMS static guide page is live with content)

## 2026-04-02 — Revision 16: Uniform Photo System & Hamburger Inline Styles (f5d0069)

Homepage photo treatment redesigned with a uniform edge-to-edge system. All homepage images now use no border-radius, no gaps (except duo-image 4px), and bleed to viewport edges. Hamburger button hardened with inline styles to prevent CSS cascade issues.

### AC updated
- **REQ-SF-5:** Photo strip changed from 16:9 with 4px gap and hover zoom to 3:2 edge-to-edge with no gaps and no hover zoom. Why Pasman selling points changed from icon+text grid to uppercase bordered tag pills in a tag row. Zdrelac section changed from fixed-height (60vh) to aspect-ratio-based full-bleed image (21:9 desktop, 16:9 mobile). Apartments preview changed from asymmetric image grid (1.2fr/0.8fr with border-radius) to uniform duo-image (1fr/1fr, no border-radius). Experience teaser renamed to "triptych" — edge-to-edge, no border-radius, hover zoom retained at 1.03x.
- **REQ-SF-3:** Hamburger button AC updated. Now uses inline styles on button and span elements for bulletproof rendering independent of CSS cascade. Selected via `#hamburger-btn` ID instead of `.nav__hamburger` class.
- **REQ-VD-6:** Added "Homepage photos (uniform system)" AC item. All homepage photo treatments are edge-to-edge with no border-radius. Padding/shadow note scoped to non-homepage contexts. Mobile note updated for single-column stacking with adjusted aspect ratios.

### No status changes
- REQ-SF-5 remains Planned (CMS integration, section toggles still missing).
- REQ-SF-3 remains Planned (focus trapping still missing).
- REQ-VD-6 remains Planned (CMS-managed frame styles, arch clip-path not yet implemented).

## 2026-04-02 — Revision 15: Pexels CDN Workaround for Stock Photos (3c72571)

Stock photo `src` attributes switched from `/media/:key` Worker route (which returns 404 due to R2 routing bug) to direct Pexels CDN URLs as a temporary workaround. All 9 homepage images now hotlinked from `images.pexels.com` with `?auto=compress&w=` query params for basic size optimization. This is a stopgap — images will move back to R2 + Image Resizing once the `/media/` route bug is resolved.

### AC updated
- **REQ-SF-1:** Added temporary workaround note: stock photos served from Pexels CDN pending `/media/` route fix.

### No status changes
- REQ-PERF-1 and REQ-CMS-2 (the `/media/:key` pipeline) remain Status: Planned and unaffected — the Pexels workaround does not change the target architecture, only the current delivery path.

## 2026-04-02 — Revision 14: Stock Photography, Rich Homepage Content, Hamburger Fix (7efb9cd)

Spec synced with commit adding stock photos to hero and homepage sections, redesigned homepage layout with photo strip, Zdrelac village section, food/experience teaser grid, apartments preview with images, and hamburger menu CSS fix.

### AC updated
- **REQ-SF-1:** Hero background changed from layered gradient to stock photograph with semi-transparent gradient overlay. Future enhancement note updated: single-photo hero is now intermediate step between gradient fallback and Ken Burns slideshow.
- **REQ-SF-3:** Hamburger button AC expanded with implementation details: explicit z-index 101, position relative, three span elements with CSS transform morph to X on `.is-open` state.
- **REQ-SF-5:** AC expanded significantly. Added: photo strip section (3-image grid between hero and Why Pasman), apartments preview layout (side-by-side text + asymmetric image grid), food & experience teaser grid (3-column with overlay labels). Added dependencies on REQ-ED-4 and REQ-ED-6.

### Implementation progress noted (statuses remain unchanged)
- **REQ-SF-1:** Hero now uses stock photo background instead of gradient-only. Ken Burns slideshow still deferred to CMS integration. Status remains Implemented (AC updated to match).
- **REQ-SF-3:** Hamburger menu CSS improved with proper span sizing, z-index layering, and `.is-open` transform animations. Still missing: focus trapping in fullscreen menu. Status remains Planned.
- **REQ-SF-5:** Major homepage content additions — photo strip, Zdrelac image section, apartments preview with images, experience teaser grid. Still missing: CMS integration, section toggle, links to editorial pages. Status remains Planned.
- **REQ-ED-6:** Zdrelac village section now appears on homepage as full-width image with text overlay between Why Pasman and apartments sections. Localized to all 4 locales. Still missing: CMS integration, section toggle, appearance on Why Pasman page. Status remains Planned.
- **REQ-ED-4:** Food/experience teaser visible on homepage (grilled fish, olive oil, beaches). Preview only — full guide page with entries, filtering, and CMS not yet implemented. Status remains Planned.
- **REQ-CMS-6:** 9 stock photos now deployed on homepage (hero-turquoise-sea, hero-pine-sea, hero-stone-village, hero-sunset-islands, editorial-pebble-beach, editorial-grilled-fish, editorial-olive-grove, apt-terrace-view, apt-living-room). Progress toward "30-40 curated stock photos" AC. Status remains Planned.

## 2026-04-02 — Revision 13: WCAG AA Contrast Fix & Hero Localization (a8fa3a1)

Spec synced with contrast accessibility fix. Opacity values raised across hero and homepage dark sections to meet WCAG AA contrast ratios. Dead `heroImageUrl` prop removed. Hero location label localized to all 4 locales.

### AC updated
- **REQ-SF-1:** Hero label opacity corrected from 0.5 to 0.7. Tagline opacity corrected from 0.5 to 0.7. Location label changed from hardcoded English to locale-aware string (Croatian, German, Slovenian, English).
- **REQ-A11Y-4:** AC expanded from vague "contrast guaranteed via overlay" to specify minimum alpha thresholds: 0.65 for large text (56px+, where WCAG AA requires only 3:1), 0.7 for normal text on dark backgrounds. The 0.65 large-text threshold aligns with REQ-SF-1 hero title accent line.

## 2026-04-02 — Revision 12: Visual Design Refinement (2a49348)

Spec synced with visual design overhaul commit. Color palette refined, typography redone with dramatic scale, scroll animations upgraded with progressive enhancement gate, new button variants, stone grain texture implemented, hero completely redesigned.

### Status changes: Planned -> Implemented
- **REQ-VD-7:** Stone grain SVG noise texture implemented as `.texture-stone` utility class and hero overlay. Section dividers use sand color. Remaining planned items: olive branch silhouettes, Galesnjak brand element.
- **REQ-SF-1:** Hero section implemented. Redesigned from photo slideshow concept to layered gradient hero with two-line title, location label, ghost CTA, and scroll indicator. Ken Burns photo slideshow deferred as future enhancement when CMS hero photos are available.

### AC updated
- **REQ-VD-1:** Color hex values updated to match refined palette. Azure `#1B6B93` -> `#1A6B8F`, stone `#F5F0E8` -> `#EDE8DE`, navy `#0C2D48` -> `#0A1F33`, olive `#6B7F3B` -> `#5C6E3B`, terracotta `#C67B5C` -> `#C2714E`, cream `#FAF7F2` -> `#F8F5EF`, warm gray `#4A4A4A` -> `#3D3D3D`. Added sand accent `#D4C9B8`, black `#111111`, and semantic color tokens.
- **REQ-VD-2:** Typography AC revised. Letter-spacing changed from "generous" to negative (-0.02em headings, -0.03em display). Font size scale changed from "48-80px" to dramatic clamp scale. Body size 15px (was 16-18px), line-height 1.7 (was 1.6), max-width 60ch (was 65ch). Added `.text-lead` and `.text-label` utility class descriptions.
- **REQ-VD-3:** Added progressive enhancement gate mechanism (`.reveal-ready` class). Added `data-reveal`, `data-reveal-clip`, `data-reveal-stagger` attribute descriptions. Added section divider line-extend animation. Removed `will-change` AC (not used in implementation). Stagger increments corrected from "80-120ms" to "100ms".
- **REQ-VD-4:** Button variants expanded: default outline with scaleX fill-sweep, `--primary` solid fill, `--ghost` for dark backgrounds. Image hover timing specified (0.6s). Form focus mechanism specified (`.focus-line` element). Hamburger morph mechanism specified (three spans with transform). Focus states specified (`:focus-visible` with 2px accent outline).
- **REQ-SF-1:** Completely rewritten. Changed from "Hero Photo Slideshow" to "Hero Section" with layered gradient background, two-line title, text-label, ghost CTA. Ken Burns slideshow noted as future enhancement. Dependencies simplified (no CMS dependency for current implementation).
- **REQ-A11Y-1:** Updated to reflect progressive enhancement model. Content visibility now guaranteed in three scenarios (reduced motion, JS disabled, JS load failure) via `.reveal-ready` class gate. Ken Burns reference replaced with gradient hero. Verification expanded to include JS-disabled testing.

### AC deviations noted
- **REQ-SF-1:** Original spec envisioned a Ken Burns photo slideshow as the primary hero. Implementation delivers a gradient-based hero instead. This is an intentional design decision — the gradient hero works without CMS/photo dependencies and serves as the foundation for future photo integration.
- **REQ-VD-2:** Spec previously said "generous letter-spacing" for headings. Implementation uses tight/negative letter-spacing for a more contemporary editorial feel. This is an intentional design refinement.

## 2026-04-02 — Revision 11: Phase 7 Content Seed Data & Accessibility Statement (3b56701)

Spec synced with Phase 7 commit (seed data for apartments, seasons, testimonials, site-settings, stock media plan, accessibility statement page).

### Implementation progress noted (all statuses remain Planned)

- **REQ-CMS-6:** Significant seed data added. Delivered: 2 apartments (Lavanda 4-pax, Tramuntana 6-pax) with full structured data (amenities, bed config, distances, SEO fields) in all 4 locales, `placeholder: true`; 3 seasonal pricing entries per apartment (off-peak/peak/shoulder with realistic EUR prices and min-stay); 3 testimonials with structured metadata (country, travel type, rating, mostLovedFor tags, apartment link) in all 4 locales, `placeholder: true`; site-settings singleton (property name, email, check-in/out times, tourist tax rate 1.35 EUR, section toggles all enabled, activeLocales defaults to `["hr"]`); stock media source plan in `seed/media/README.md` listing 21-28 royalty-free photos across 4 categories (hero, interiors, editorial, local guide). Missing from AC: hero slideshow photos (heroPhotoKeys empty), editorial page content as seedable JSON (exists hardcoded from Phase 6 but not in seed format), local guide 12-15 entries, 10-15 FAQ entries in seed format (5 hardcoded from Phase 6), host story template in seed format, legal page templates in seed format, actual stock media files (plan only), dashboard placeholder checklist, optional hero video. Status remains Planned.
- **REQ-TC-7:** Accessibility statement page at `/{locale}/pristupacnost` in all 4 locales. Footer link present in all locales. Content states WCAG 2.1 AA target. Contact method references email (no explicit address -- relies on site contact info). Missing from AC: CMS integration (hardcoded with same pattern as Phase 6 pages), explicit list of known limitations. Status remains Planned.

### AC deviations noted
- **REQ-CMS-6:** Spec AC says "2-3 example apartments"; implementation delivers 2 (within range). Spec says "3-5 example testimonials"; implementation delivers 3 (within range). Both are at the lower bound.
- **REQ-CMS-6:** `site-settings.json` has `phone` and `whatsappNumber` as empty strings and `heroPhotoKeys` as empty array. These are expected placeholders for owner to fill in, but the seed script should document that these must be populated before the site is visitor-ready.
- **REQ-CMS-6:** Spec AC includes "social links" in site-settings; implementation does not include social links field in `site-settings.json`.
- **REQ-TC-7:** Spec AC says "at least in English and German"; implementation provides all 4 locales (exceeds requirement). Content says "contact us by email" without specifying an actual address -- depends on site-settings email being discoverable elsewhere on the page/footer.

## 2026-04-02 — Revision 10: Phase 6 Editorial, Legal, SEO Pages (3f30f66)

Spec synced with Phase 6 commit (editorial pages, legal pages, sitemap, robots.txt, local guide stub).

### Implementation progress noted (all statuses remain Planned)

All editorial pages use hardcoded static content with TODO comments for Emdash CMS integration. CMS-managed content and section toggles are core AC items for each requirement, so none qualify for Implemented status yet. Progress is documented per requirement below.

- **REQ-ED-1:** "Why Pasman" page at `/{locale}/zasto-pasman`. Implements: 4 sections (crystal-clear sea, island tranquility, 25 min from mainland, authentic Dalmatia) with poetic headlines and 2-3 sentence descriptions in all 4 locales, scroll reveal animations. Missing from AC: full-bleed photos, scroll-driven storytelling with pinned sections, olive groves + cycling/walking sections, links to guide entries, CMS integration, section toggle.
- **REQ-ED-2:** "Getting Here" page at `/{locale}/dolazak`. Implements: ferry info (Biograd-Tkon, 25 min, Jadrolinija link, peak season advice), alternative route via Zdrelac bridge from Ugljan, Zadar Airport (ZAD) section, Google Maps + Apple Maps deep links, airport transfer offer text. Missing from AC: visual journey timeline, "without car" section, Split Airport section, parking info, ferry cost/frequency, WhatsApp link on transfer offer, German cost breakdowns, CMS integration, section toggle.
- **REQ-ED-4:** Local guide stub at `/{locale}/vodic`. Shows 5 category cards (Beaches, Food & Drink, Restaurants, Activities, Day Trips) with "coming soon" message. Minimal implementation — no entries, no filtering, no descriptions. Status remains Planned.
- **REQ-ED-5:** "About Hosts" page at `/{locale}/o-nama`. Implements: standalone page with warm personal story in all 4 locales ("Our family has been on this island for generations"), response time badge. Missing from AC: host photos with Dalmatian arch clip-path mask, WhatsApp link, homepage condensed version, CMS integration, section toggle.
- **REQ-ED-7:** FAQ page at `/{locale}/faq`. Implements: accordion UI with `<details>/<summary>`, Schema.org FAQPage JSON-LD markup via SchemaOrg component, 5 preloaded FAQ items across 3 categories (getting-there, apartment, booking) in all 4 locales. Missing from AC: Emdash CMS collection, category filtering UI, contextual display on other pages (apartment/transport), owner phone management, section toggle.
- **REQ-TC-2:** Privacy Policy page at `/{locale}/privatnost`. Implements: standalone page in all 4 locales with template content covering all required GDPR items (data controller, legal basis Art. 6(1)(b), data collected, D1 storage in EU, Resend + Cloudflare processors, 2-year retention, data subject rights, Cloudflare Web Analytics note, WhatsApp third-country transfer note, no third-party data sales). Missing from AC: CMS integration (hardcoded with TODO), verification that German version is available when DE locale is disabled (CON-LEGAL exception).
- **REQ-TC-3:** Impressum page at `/{locale}/impressum`. Implements: standalone page in all 4 locales with template content (address, email, phone placeholders). Code comment acknowledges CON-LEGAL German availability requirement. Missing from AC: CMS integration, actual owner data (placeholder template), verification of 1-click footer access and DE-disabled availability.
- **REQ-SEO-4:** Multilingual sitemap at `/sitemap.xml`. Implements: XML sitemap with all page paths, `xhtml:link` alternates for all locales per URL, `x-default` pointing to Croatian, proper XML content type. Missing from AC: filtering by active locales only (TODO in code), dynamic apartment page inclusion from D1/Emdash, auto-regeneration on content changes, noindex enforcement on disabled locale pages.
- **REQ-SEO-7:** robots.txt at `/robots.txt`. Implements: dynamic robots.txt blocking `/admin/`, `/_emdash/`, `/media/`, `/api/` from indexing, Sitemap directive pointing to `/sitemap.xml`. Combined with existing trailing slash redirects and canonical URLs from Phase 3, this closes the robots.txt and media URL noindex AC items. Remaining gaps: www redirect (DNS-level), noindex on disabled locale pages and draft preview URLs, slug change redirects (REQ-CMS-7).

### AC deviations noted
- **REQ-ED-1:** Implementation has 4 sections; spec AC lists 6 topics (crystal-clear sea, quiet island rhythm, easy ferry access, authentic Dalmatia, olive groves, cycling/walking). Missing: olive groves and cycling/walking as standalone sections.
- **REQ-ED-2:** Transfer offer text uses `t(typedLocale, "gettingHere.transfer")` but no WhatsApp link — spec requires WhatsApp link for transfer arrangement.

## 2026-04-02 — Revision 9: Confirm Atomicity Fix (eba28ad)

### AC updated
- **REQ-BK-7:** "Confirm + Block Dates" AC revised. Previous wording: "inquiry status updated to `confirmed` in same batch." Implementation now splits into two sequential steps: (1) atomic INSERT...WHERE NOT EXISTS runs alone; (2) UPDATE inquiry status runs only if INSERT affected rows. This prevents false confirmations where the status changed to `confirmed` even when no availability block was created due to a date conflict. The overlap check + insert remains atomic; the change is that the status UPDATE is now conditional on INSERT success rather than unconditional in the same batch.

### Implementation progress noted (REQ-BK-7, status remains Planned)
- JWT_SECRET now validated for presence before use — returns 500 if missing instead of silently verifying against an empty string. Unused `stripHtml` import removed.
- Remaining gaps from Revision 7 still apply: no CSRF token validation, no signed single-use URL token, no decline/spam actions, no admin inquiry list UI, no unread count badge.

## 2026-04-02 — Revision 8: Spec Sync for e5dfff9 Bugfix Commit

### AC updated
- **REQ-CMS-2:** Supported formats updated from "JPEG, PNG, HEIC, WebP" to "JPEG, PNG, HEIC, HEIF, WebP, AVIF" — matches server-side extension allowlist added in upload endpoint.
- **REQ-CMS-3:** Resend failure mode AC updated. Previous wording implied client-visible error ("Code not received? Try again"). Implementation returns success on Resend failure to prevent admin email enumeration via timing differences. AC now specifies identical success response regardless of send outcome, with server-side logging.

## 2026-04-02 — Revision 7: Security & Atomicity Fixes (4ea1d35)

### AC updated
- **REQ-BK-7:** "Confirm + Block Dates" AC updated from "D1 transaction: 1) verify no date overlap, 2) insert availability block, 3) update inquiry status" to "D1 batch (atomic): overlap check and availability block insertion happen in a single statement to prevent race conditions (TOCTOU)." Previous wording implied 3 sequential steps; implementation correctly uses INSERT...WHERE NOT EXISTS for atomic overlap prevention.
- **REQ-BK-2:** Input sanitization AC broadened from "no HTML in message" to "all user-supplied fields stripped of HTML before rendering in email output." Commit adds `stripHtml()` to apartmentId and petNote in owner notification email, not just the message field.

### Implementation progress noted (REQ-BK-7, status remains Planned)
- JWT authentication now wired into confirm endpoint (was comment-only in Phase 5). Verifies `auth_token` cookie via `verifyJWT`. Returns 401 for missing or invalid tokens.
- Remaining gaps from Revision 6 still apply: no CSRF token validation, no signed single-use URL token, no decline/spam actions, no admin inquiry list UI, no unread count badge.

### Previous gap partially resolved
- Revision 6 noted "authentication middleware not wired (comment-only)" for REQ-BK-7. JWT auth is now implemented. CSRF token remains unimplemented.

## 2026-04-02 — Revision 6: Phase 5 Implementation Sync

Spec synced with Phase 5 commit (inquiry server pipeline, confirm+block dates, email delivery, GDPR consent, analytics events).

### Status changes: Planned -> Implemented
- **REQ-BK-2:** Inquiry server pipeline — POST /api/inquiry with full pipeline: Zod validation (discriminated union for booking vs quick-question), Turnstile server-side verification, honeypot bot detection, input sanitization (HTML stripped, email header injection prevented, URL stripping), server-side availability revalidation (half-open interval overlap query), D1 persist before email attempt (data never lost), outbox pattern with retry (email_status pending->sent/retry, retry_at set on failure), owner notification + guest auto-reply via Resend (4-locale guest emails with explicit "not a confirmed booking" disclaimer), correct API response contract (200/202/400/403/409), server-side analytics event tracking (inquiry_submit/question_submit to D1 events table).
- **REQ-BK-6:** Booking business rules — server-side integration now complete. Cross-season pricing computed via `computeStayPrice` with season data from D1. Tourist tax with child exemption (under-12 exempt). Availability revalidated at submit time. Capacity validated by Zod schema. Previously only pure functions existed; now wired into the inquiry pipeline.
- **REQ-TC-5:** GDPR consent on forms — `gdprConsent: z.literal(true)` in Zod schema rejects submissions without consent. Consent timestamp stored as `gdpr_consent_at` in D1. Per-locale label text in all 4 translation files with Privacy Policy link placeholder.

### Implementation progress noted (status remains Planned)
- **REQ-BK-1:** Server-side pipeline (REQ-BK-2) fully consumes the Zod schema matching REQ-BK-1 field structure. Client-side form widget (date picker, capacity selector, tabs, UI validation feedback) not yet built. Status remains Planned.
- **REQ-BK-7:** Confirm + block dates endpoint implemented at POST /admin/api/inquiries/:id/confirm using D1 batch (overlap check, insert availability_block, update inquiry status). Missing from AC: authentication middleware not wired (comment-only), no CSRF token validation, no signed single-use URL token, no decline/spam actions, no admin inquiry list UI, no unread count badge. Status remains Planned.

### AC deviations noted (implementation gaps within Implemented requirements)
- **REQ-BK-2 AC gap — error message localization:** All error responses are in English only. Spec AC states "All error messages localized per active locale." Implementation returns English strings regardless of locale parameter.
- **REQ-BK-2 AC gap — logging:** Spec AC requires logging "timestamp, locale, apartment, source, referrer." Implementation tracks events to D1 events table but does not log referrer.
- **REQ-BK-6 AC gap — tourist tax rate:** Hardcoded to 1.35 EUR with a TODO comment. Spec requires "Rate configurable in CMS." Cleaning fee hardcoded to 0 with a TODO comment. Spec requires "configurable per apartment."
- **REQ-BK-6 AC gap — check-in/out times:** Not included in confirmation emails yet. Spec AC requires "Displayed on apartment pages and in confirmation emails."

### Previous gap resolved
- Revision 4 noted "Inquiry Zod schema exists but no server endpoint consumes it yet." This is now resolved — POST /api/inquiry fully consumes the schema.

## 2026-04-02 — Revision 5: Phase 4 Implementation Sync

Spec synced with Phase 4 commit (apartment pages, availability API, D1 schema, analytics, SEO components).

### Status changes: Planned -> Implemented
- **REQ-AP-2:** Apartment listing page — card grid with hero photo, name, capacity, beach distance, price, sea view badge, "Best for" label. Zero-apartment "Coming soon" state. Single-apartment redirect to detail. 2-column desktop / 1-column mobile. Image hover zoom. Staggered fade-up entry.
- **REQ-AP-4:** Seasonal pricing table — season name, date range, price/night, min stay columns sorted chronologically. Cleaning fee + tourist tax as separate items. "Price on request" fallback for empty seasons. Locale-aware formatting via `Intl.NumberFormat`. Disclaimer text. PAngV `showTotalPrice` prop accepted (rendering deferred to detail page integration).
- **REQ-SEO-1:** Schema.org structured data — generic SchemaOrg component supporting VacationRental, FAQPage, BreadcrumbList types. Breadcrumbs component emitting BreadcrumbList JSON-LD with correct ListItem schema.
- **REQ-SEO-3:** Analytics and conversion events — POST /api/track endpoint writing to D1 events table. All 8 event types defined (inquiry_submit, question_submit, whatsapp_click, call_click, apartment_view, gallery_open, language_switch, calendar_select). Cookieless, no PII.

### Implementation progress noted (status remains Planned)
- **REQ-AP-5:** Availability API backend implemented (GET /api/apartments/:id/availability with half-open interval query, uncached). Visual calendar component not yet built.
- **REQ-AP-6:** Photo gallery grid layout implemented (asymmetric 2fr/1fr desktop, horizontal scroll-snap mobile, "View all X photos" button, lightbox data injection). Missing: blurhash placeholder rendering, responsive srcset, clip-path animation, lightbox keyboard nav, focus trapping, image load error handling.
- **REQ-AP-3:** Amenity grid component implemented (grouped by category with icon + label). Breadcrumbs component implemented. Remaining detail page sections (hero, description, inquiry widget, trust strip, bed config, house rules, floor plan, FAQs) not yet built.

### D1 schema implemented (supporting future requirements)
- `availability_blocks` table: half-open interval `[check_in, check_out)`, source tracking (manual/ics/inquiry), apartment_id + date indexes. Supports REQ-BK-6 availability data model.
- `inquiries` table: full booking pipeline with type (booking/question), guest fields (adults, children age buckets, pets), status lifecycle (new/read/responded/confirmed/declined/spam), email outbox pattern (pending/sent/retry/failed with retry_at and attempt count), GDPR consent timestamp, Turnstile verification flag, price estimate. Supports REQ-BK-1, REQ-BK-2, REQ-BK-7.
- `events` table: analytics events with type, apartment_slug, locale, page_path. Supports REQ-SEO-3.
- `redirects` table: slug history with locale, entity type, old/current slug. Supports REQ-CMS-7, REQ-SEO-7.

### Minor AC gaps noted (no status impact)
- REQ-AP-2: `valueProp` field exists in data type but is not rendered on listing cards. AC specifies "one-line value proposition" on cards.
- REQ-AP-4: PAngV total price display (AC for German locale) has the `showTotalPrice` prop wired but no conditional total price row rendered yet.
- REQ-SEO-3: Cloudflare Web Analytics beacon (pageview analytics portion) not yet integrated into page layout. Server-side custom event tracking is complete.

## 2026-04-02 — Revision 4: Post-Implementation Sync (Phases 1-3)

Spec synced with implementation from last 3 commits (Phase 1: data foundation, Phase 2: visitor shell, Phase 3: auth + uploads + schema).

### Status changes: Planned -> Implemented
- **REQ-I18N-3:** UI string translations — all 4 locale JSON files, `t()` with Croatian fallback and interpolation
- **REQ-I18N-5:** Locale-aware formatting — `Intl.DateTimeFormat` and `Intl.NumberFormat` per locale
- **REQ-VD-1:** Color system — all CSS custom properties on `:root` matching spec palette
- **REQ-VD-2:** Typography system — Cormorant Garamond serif + Inter sans, German hyphenation, `font-display: swap`, 65ch body max-width
- **REQ-VD-3:** Scroll animation system — CSS-first with IntersectionObserver (fade-up, clip-path, staggered entry), reduced motion fully respected, no GSAP
- **REQ-VD-4:** Micro-interactions — button fill-sweep, image hover zoom, form focus animation, nav transition, hamburger morph to X
- **REQ-A11Y-1:** Reduced motion — `prefers-reduced-motion: reduce` disables all animations, content immediately visible
- **REQ-TC-6:** Security headers — CSP (with Turnstile, font-src, object-src none, base-uri self), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy. Relaxed CSP for admin routes.

### Implementation progress noted (status remains Planned)
These requirements have significant code in place but do not yet satisfy all acceptance criteria:
- **REQ-I18N-1:** Root redirect via Accept-Language implemented. Missing: locale cookie check at root, hreflang tags, sitemap integration, disabled locale 404 behavior, legal page DE exception.
- **REQ-SF-1:** Hero renders with gradient overlay + tagline fade-up. Missing: Ken Burns slideshow crossfade, multiple images, blurhash placeholder on load failure.
- **REQ-SF-3:** Transparent-to-solid nav with IntersectionObserver, hamburger menu, staggered mobile links, Escape to close. Missing: focus trapping in fullscreen menu.
- **REQ-SF-4:** Language switcher dropdown with ARIA. Missing: filter by active locales only, cookie persistence on switch, legal page DE exception.
- **REQ-SF-7:** Sticky mobile CTA with IntersectionObserver visibility logic. Missing: integration with real pricing data.
- **REQ-BK-3:** WhatsApp button with localized pre-filled messages and 3s delay. Missing: CMS-driven number, apartment context with dates.
- **REQ-BK-6:** Cross-season pricing, tourist tax child exemption, min stay by check-in season all implemented as pure functions. Missing: server-side integration, CMS-driven season data.
- **REQ-CMS-3:** Magic Link auth fully implemented — 6-digit code via Resend, SHA-256 hashed storage, JWT (1h) + refresh token (30d) in HttpOnly/Secure/SameSite=Lax cookies, brute force protection (5/hour), D1 schema. Missing: session list in admin settings, session expiry mid-edit recovery.
- **REQ-CMS-2:** Presigned R2 upload URL generation implemented. Media serving route `/media/:key` exists. Missing: actual Cloudflare Image Resizing transform application (params parsed but not passed to `cf: { image }` yet), blurhash computation, focal point, gallery reordering.
- **REQ-PERF-1:** `/media/:key` route serves from private R2 with immutable cache headers. `buildSrcset` utility generates responsive widths [400, 800, 1200, 1920]. Missing: Image Resizing `cf: { image }` transform on response, blurhash-to-sharp transition, format negotiation.
- **REQ-CMS-8:** 404 page exists with branded design and locale links. Missing: 500 page as hardcoded minimal fallback shell.
- **REQ-SEO-7:** Trailing slash 301 redirect middleware. Canonical URL on all pages. Missing: noindex on disabled locales/draft previews, robots.txt, media URL noindex.
- **REQ-A11Y-2:** Skip-to-content link, focus-visible outlines, Escape closes overlays. Missing: focus trapping in mobile menu/lightbox, accordion keyboard nav.

### Spec accuracy corrections
- **REQ-TC-6 AC detail:** Implementation adds `font-src 'self'`, `object-src 'none'`, and `base-uri 'self'` beyond what the spec listed. These are stricter than spec and correct for the self-hosted font setup. Updated spec AC to match.

### Quality fixes
- REQ-VD-7: Fixed "Galesnjak" typo to "Galešnjak" (matching glossary entry)

### Gaps identified (no spec change needed yet)
- Root redirect (`src/pages/index.astro`) does not check locale cookie before Accept-Language — violates the cookie-first priority in REQ-I18N-1 and REQ-SF-4. Implementation should add cookie check.
- Language switcher shows all 4 locales unconditionally — should filter by active locales per REQ-SF-4.
- Inquiry Zod schema (`schemas/inquiry.ts`) exists with discriminated union (booking vs quick-question) matching REQ-BK-1 structure, but no server endpoint consumes it yet.

## 2026-04-02 — Revision 3: Spec Quality Validation

Full 14-point spec quality audit.

### Failure modes added to P0 requirements
- REQ-AP-5: Added failure modes for availability data fetch failure and stale data (JS disabled)
- REQ-AP-6: Added failure mode for image load errors in gallery/lightbox
- REQ-SF-1: Added failure modes for hero image load error and no hero photos configured
- REQ-SF-7: Added failure mode for when no pricing is available

### Contradictions fixed
- CON-SEC: Rate limit corrected from "5 per IP per hour" to "5 per IP per 10 minutes via WAF" (aligning with REQ-BK-2)
- CON-SEC + CON-MEDIA: EXIF GPS wording corrected from "stripped from uploads" to "not exposed to visitors" (originals in R2 retain EXIF; Image Resizing strips from served derivatives) — aligning with REQ-CMS-2

### Clarifications
- REQ-AP-1: "capacity (max adults)" clarified to "max occupancy (total adults + children)" to align with REQ-BK-6 capacity rule

### Glossary additions
- Added: Astro, GSAP, WCAG (each used across 4-5 domain files)

## 2026-04-02 — Revision 2: LLM Review Feedback

Applied recommendations from Gemini and GPT review of the full spec:

### Architecture changes
- **AD1:** Image processing moved from Worker-side to Cloudflare Image Resizing (Worker memory/CPU limits)
- **AD2:** Switched from Google OAuth to Magic Link auth via Resend (simpler for single user)
- **AD3:** CSS-first animation system, GSAP optional for max 1 signature moment (was: 3 GSAP ScrollTrigger per page)
- **AD4:** Removed PWA (unnecessary complexity for this scale)
- **AD5:** Structured fields preferred over rich text for most content types
- **AD6:** Inquiry lifecycle via email-first, D1 as backup log (was: full admin inbox UI)

### New requirements added
- REQ-BK-4: Click-to-call
- REQ-BK-6: Booking business rules (timezone, min stay, capacity, cross-season pricing, availability revalidation)
- REQ-BK-7: Inquiry lifecycle (statuses, confirm+block dates, conflict warnings)
- REQ-CMS-7: Content safeguards (field validation, locale completion, duplicate-from-Croatian, slug redirects, autosave, placeholder warnings)
- REQ-CMS-8: Branded error pages (404/500)
- REQ-TC-4: House rules & booking terms
- REQ-TC-5: GDPR consent checkbox on forms
- REQ-TC-7: Accessibility statement
- REQ-SEO-5: Keyword strategy per locale
- REQ-SEO-6: Local SEO (GBP, NAP, geocoordinates)
- REQ-SEO-7: URL policy & indexation controls (no www, no trailing slashes, noindex rules)
- REQ-SEO-8: Content freshness reminders

### Significantly updated requirements
- REQ-BK-1: Added "Quick Question" tab, children/pets fields, min stay enforcement, cross-season pricing breakdown, GDPR checkbox, stale availability handling, non-binding disclaimer
- REQ-BK-2: Added timezone, server-side availability revalidation, honeypot, input sanitization, retry logic, CGNAT-aware rate limiting, inquiry-not-booking disclaimer
- REQ-AP-1: Expanded with German-precision fields (beach type, AC scope, parking type, stairs, kitchen/bathroom equipment, mattress sizes, WiFi, distances, house rules, "Best for" labels, value proposition)
- REQ-AP-3: Restructured with explicit visual hierarchy, trust info near CTA, contextual objection handling
- REQ-AP-4: Added cleaning fee, tourist tax details, PAngV compliance, German total-price display
- REQ-CMS-2: Switched to Cloudflare Image Resizing, added EXIF GPS stripping, crop preview, resolution warnings, aspect ratio warnings
- REQ-CMS-3: Changed from Google OAuth to Magic Link auth (renamed)
- REQ-CMS-4: Reorganized as task-based dashboard, structured editing emphasis, locale completion indicators, destructive action confirmations
- REQ-CMS-5: Split into toggleable (optional) vs always-visible (core) sections, added dependency warnings
- REQ-CMS-6: Added placeholder marking system, content checklist dashboard
- REQ-TC-1: Simplified cookie consent (no optional cookies at launch = no banner needed)
- REQ-TC-2: Expanded privacy policy with legal basis, retention periods, processor list, WhatsApp note
- REQ-TC-3: Impressum always available in German even if DE locale disabled
- REQ-VD-3: CSS-first, no parallax, GSAP optional (<20KB gate), art direction rules
- REQ-VD-6: Restricted masks to editorial photos, standard aspect ratios for apartment galleries
- REQ-SP-1: Added contextual placement near inquiry, manual "most loved for" tags, source attribution, structured fields

### Resolved contradictions
- i18n fallback policy: 404 for disabled locales / unpublished pages, Croatian fallback for partial missing content within published active-locale pages

### Documentation structure defined
- `documentation/` folder with architecture, config, deployment, CMS guide, content guide, security, SEO, troubleshooting, ADRs
- 6 initial Architecture Decision Records

## 2026-04-02 — Initial Specification

- Created full product specification with 12 domains
- Defined 7 design principles
- Established 9 constraints
- Documented 45+ requirements across all domains
- Key decisions: Astro 6 + Emdash CMS on Cloudflare Workers, photo-first design, 4 locales (owner-activated), mobile-first CMS, section toggles, preloaded content, request-to-book, Turnstile + Resend
