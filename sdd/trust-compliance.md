# Trust & Compliance

GDPR, privacy policy, house rules, cancellation policy, security headers, and accessibility statement.

## Key Concepts

- **GDPR**: EU General Data Protection Regulation governing personal data processing
- **Impressum**: Legal notice page with operator identity, photo credits, Gray Matter attribution, external link disclaimer, and copyright notice. Not strictly required for Croatian-based sites, but provided for DACH visitor trust and transparency.
- **PAngV**: German pricing transparency regulation requiring total price display
- **Cookie consent**: EU requirement for explicit consent before setting non-essential cookies
- **Data retention**: Maximum period personal data (inquiries) is stored before deletion

## Requirements

### REQ-TC-1: GDPR Cookie Consent

- **Intent:** EU legal compliance
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Cloudflare Web Analytics is cookieless — exempt from consent
  - Only functional cookie: locale preference (necessary, no consent required)
  - **Simplified approach:** No cookie banner needed at launch since no optional tracking cookies exist. Instead: clear privacy notice in footer linking to privacy policy.
  - If optional cookies added in future (e.g., analytics with cookies, marketing pixels): implement full Accept/Reject/Settings banner at that point.
  - "Cookie & Privacy Settings" link in footer for transparency
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-I18N-3
- **Verification:** Verify no non-essential cookies set, verify privacy link works
- **Status:** Deprecated - CF Web Analytics is cookieless, no consent banner needed

### REQ-TC-2: Privacy Policy

- **Intent:** GDPR-compliant data processing disclosure
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page, CMS-managed per locale
  - Content covers:
    - Website identification (novoselec.hr named explicitly)
    - Data controller identity: owner of Apartmani Novoselec, Zdrelac, Pasman, Croatia
    - Purpose of data collection: respond to inquiry, provide availability info, arrange potential booking
    - Legal basis for inquiry processing (Art. 6(1)(b) GDPR — pre-contractual measures)
    - What data is collected: first and last name, email address, phone number, and message content via inquiry form
    - How data is stored: Cloudflare D1 database on servers within the European Union
    - Third-party sharing: data not sold, rented, or shared; only disclosed to technical service providers under strictly controlled conditions
    - Data retention: retained only as long as necessary for inquiry processing and booking preparation; securely deleted if no booking results
    - Right to access, rectify, erase — by contacting the data controller at hello@novoselec.ch
    - No data sold to third parties
  - **GAP (known):** Fallback text does not explicitly mention check-in/check-out dates or guest count as collected data (the inquiry form collects these). Also does not name specific data processors (Resend, Cloudflare) or mention WhatsApp contact or Cloudflare Web Analytics cookieless tracking. These should be added when CMS-managed content replaces the fallback.
  - Preloaded with template content in all 4 locales
  - Always accessible in 1 click from any page (footer link)
  - **Available in German regardless of DE locale activation** (CON-LEGAL)
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-6
- **Verification:** Legal review checklist, verify German version available when DE disabled
- **Status:** Implemented

### REQ-TC-3: Impressum (Legal Notice)

- **Intent:** Transparency and DACH visitor trust — operator identity, photo credits, copyright, and external link disclaimers
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page at `/{locale}/impresum` with `HeroSimple` photo-backed header (REQ-VD-12)
  - CMS-managed per locale via `editorial` collection (`page_key: "impressum"`), with hardcoded 4-locale fallback content containing inline HTML links (mailto, external sites) rendered via sanitized `set:html` (allowlist: `<a>`, `<br>`, `<em>`, `<strong>` tags only — all other HTML stripped)
  - Content covers (per locale):
    - Operator identity: "Apartmani Novoselec", address (Ždrelac, Pašman, Croatia), contact email (hello@novoselec.ch). Operator label varies per locale: "Vlasnik" (hr), "Betreiber" (de), "Upravljavec" (sl), "Operator" (en)
    - Website development attribution: Gray Matter GmbH (graymatter.ch) — linked
    - Photo credits: Sara & Marco from Places of Juma (placesofjuma.com) — linked, with warm editorial recommendation to visit their blog
    - External link disclaimer: no liability for third-party linked content
    - Copyright notice: all content subject to copyright, reproduction requires written consent, downloads for private non-commercial use only
  - **Always reachable in 1 click from every page** (footer link in legal links section)
  - Footer link labeled per locale: "Impresum" (hr), "Impressum" (de), "Impresum" (sl), "Legal Notice" (en) via `footer.impressum` translation key
  - Available in all 4 active locales with culturally adapted text (German uses "Betreiber", Croatian uses "Vlasnik", Slovenian uses "Upravljavec", English uses "Operator")
  - Preloaded with complete fallback content in all 4 locales
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-VD-12
- **Verification:** Verify 1-click access from all pages via footer link, verify all 4 locale versions render correctly, verify photo credits and Gray Matter attribution present
- **Status:** Implemented

### REQ-TC-4: House Rules & Booking Terms

- **Intent:** Set clear expectations before booking
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Displayed on apartment detail page and linked from inquiry confirmation email
  - Content includes:
    - Check-in / check-out times
    - Quiet hours
    - Smoking policy (indoor/outdoor)
    - Pet policy and any extra fees
    - Party/event policy
    - Maximum occupancy enforcement
    - Cancellation policy (owner-defined)
    - Deposit requirements if any
    - "Prices are in EUR, tourist tax included/excluded" disclosure
  - CMS-managed per locale, per apartment (with global defaults)
  - Preloaded with reasonable template content
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-AP-1, REQ-CMS-1
- **Verification:** Verify display on apartment page, verify in confirmation email
- **Status:** Planned

### REQ-TC-5: GDPR Consent on Forms

- **Intent:** Explicit consent for data processing via inquiry form
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Unchecked checkbox on inquiry form: "I agree to the processing of my personal data according to the Privacy Policy"
  - Privacy Policy hyperlinked in all 4 locales (links to `/{locale}/privatnost`)
  - Form cannot submit without consent checked
  - Consent timestamp stored with inquiry in D1
  - Per-locale label text
- **Constraints:** CON-LEGAL, CON-SEC, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-BK-8, REQ-TC-2
- **Verification:** Test form without consent (rejected), with consent (accepted), verify Privacy Policy link present
- **Status:** Implemented

### REQ-TC-6: Security Headers

- **Intent:** Baseline web security
- **Applies To:** System
- **Acceptance Criteria:**
  - **CSP baseline:**
    - `default-src 'self'`
    - `script-src 'self' https://challenges.cloudflare.com` (Turnstile)
    - `frame-src https://challenges.cloudflare.com` (Turnstile widget)
    - `img-src 'self' data: blob: https:` (R2 images via Worker route, external maps)
    - `style-src 'self' 'unsafe-inline'` (required for Astro island hydration; nonce-based if feasible)
    - `connect-src 'self' https://challenges.cloudflare.com` (API endpoints + Turnstile verification callbacks)
    - `font-src 'self'` (self-hosted fonts)
    - `object-src 'none'` (no plugins)
    - `base-uri 'self'` (prevent base tag hijacking)
    - Admin panel uses a relaxed CSP (separate route-level policy: `'unsafe-inline' 'unsafe-eval' https:` for admin tooling)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Strict-Transport-Security: max-age=31536000; includeSubDomains
  - Cross-Origin-Opener-Policy: same-origin-allow-popups
  - Cross-Origin-Resource-Policy: same-origin
  - Permissions-Policy: restrict camera, microphone, geolocation, accelerometer, gyroscope, magnetometer, midi, payment, usb
  - Set via Workers response headers
- **Constraints:** CON-SEC
- **Priority:** P1
- **Dependencies:** None
- **Verification:** securityheaders.com scan
- **Status:** Implemented

### REQ-TC-7: Accessibility Statement

- **Intent:** Public commitment to accessibility standards
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Footer link to accessibility statement page
  - States WCAG 2.1 AA target compliance
  - Lists known limitations if any
  - Contact info for accessibility feedback
  - CMS-managed, at least in English and German
- **Constraints:** CON-A11Y, CON-I18N
- **Priority:** P2
- **Dependencies:** REQ-CMS-1
- **Verification:** Page exists and is accurate
- **Status:** Deprecated - page removed, not needed for vacation rental

### REQ-TC-8: Security Contact Disclosure

- **Intent:** Enable responsible disclosure of security vulnerabilities via standard well-known URI
- **Applies To:** System
- **Acceptance Criteria:**
  - `/.well-known/security.txt` served at the well-known URI (managed via Cloudflare dashboard, not a static file in the repo)
  - Contains: Contact (mailto), Expires date, Preferred-Languages (hr, en, de, sl), Canonical URL
  - Expires date set to a future date (must be updated before expiry)
  - Conforms to RFC 9116
- **Constraints:** CON-SEC
- **Priority:** P2
- **Dependencies:** None
- **Verification:** Verify file accessible at `/.well-known/security.txt`, validate fields present
- **Status:** Implemented

## Out of Scope

- Full legal audit (owner should consult local legal advisor)
- DSGVO audit beyond basics
- Cookie-based marketing consent (no marketing cookies used)

## Domain Dependencies

- i18n (localized legal text)
- CMS (content management, preloaded templates)
- Booking (data processing, consent, confirmation emails)
