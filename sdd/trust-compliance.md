# Trust & Compliance

GDPR, privacy policy, Impressum, house rules, cancellation policy, security headers, and accessibility statement.

## Key Concepts

- **GDPR**: EU General Data Protection Regulation governing personal data processing
- **Impressum**: Legal notice page required by German/Austrian law for commercial websites
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
- **Status:** Planned

### REQ-TC-2: Privacy Policy

- **Intent:** GDPR-compliant data processing disclosure
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page, CMS-managed per locale
  - Content covers:
    - Data controller identity and contact
    - Legal basis for inquiry processing (Art. 6(1)(b) GDPR — pre-contractual measures)
    - What data is collected: name, email, phone, dates, message via inquiry form
    - How data is stored: D1 database on Cloudflare infrastructure (EU region)
    - Data processors: Resend (email delivery), Cloudflare (hosting)
    - Data retention: inquiries retained for 2 years, then deleted unless converted to booking records
    - Right to access, rectify, erase — contact email for requests
    - WhatsApp: user-initiated contact, subject to Meta's privacy policy (third-country transfer — user-initiated basis)
    - Cloudflare Web Analytics: cookieless, no personal data collected
    - No data sold to third parties
  - Preloaded with template content in all 4 locales
  - Always accessible in 1 click from any page (footer link)
  - **Available in German regardless of DE locale activation** (same exception as Impressum — CON-LEGAL)
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1, REQ-CMS-6
- **Verification:** Legal review checklist, verify German version available when DE disabled
- **Status:** Planned

### REQ-TC-3: Impressum (Legal Notice)

- **Intent:** Legal page required for German/Austrian visitors (Telemediengesetz)
- **Applies To:** Visitor
- **Acceptance Criteria:**
  - Standalone page, CMS-managed per locale
  - Required content: operator full name, postal address, email, phone, tourism registration/license number if applicable
  - **Always reachable in 1 click from every page** (footer link, clearly labeled "Impressum")
  - Available in German even if DE locale is otherwise disabled (legal requirement)
  - Preloaded with template
- **Constraints:** CON-LEGAL, CON-I18N
- **Priority:** P1
- **Dependencies:** REQ-CMS-1
- **Verification:** Verify 1-click access from all pages, verify German version exists
- **Status:** Planned

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
  - Privacy Policy linked
  - Form cannot submit without consent checked
  - Consent timestamp stored with inquiry in D1
  - Per-locale label text
- **Constraints:** CON-LEGAL, CON-SEC, CON-I18N
- **Priority:** P0
- **Dependencies:** REQ-BK-1, REQ-TC-2
- **Verification:** Test form without consent (rejected), with consent (accepted)
- **Status:** Planned

### REQ-TC-6: Security Headers

- **Intent:** Baseline web security
- **Applies To:** System
- **Acceptance Criteria:**
  - **CSP baseline:**
    - `default-src 'self'`
    - `script-src 'self' https://challenges.cloudflare.com` (Turnstile)
    - `frame-src https://challenges.cloudflare.com` (Turnstile widget)
    - `img-src 'self' data: blob: https:` (Image Resizing, external maps)
    - `style-src 'self' 'unsafe-inline'` (required for Astro island hydration; nonce-based if feasible)
    - `connect-src 'self'` (API endpoints)
    - `font-src 'self'` (self-hosted fonts)
    - `object-src 'none'` (no plugins)
    - `base-uri 'self'` (prevent base tag hijacking)
    - Admin panel uses a relaxed CSP (separate route-level policy: `'unsafe-inline' 'unsafe-eval' https:` for admin tooling)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: restrict camera, microphone, geolocation
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
- **Status:** Planned

## Out of Scope

- Full legal audit (owner should consult local legal advisor)
- DSGVO audit beyond basics
- Cookie-based marketing consent (no marketing cookies used)

## Domain Dependencies

- i18n (localized legal text)
- CMS (content management, preloaded templates)
- Booking (data processing, consent, confirmation emails)
