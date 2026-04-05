# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Apartmani Pašman — a vacation rental website for family apartments in Ždrelac, Pašman island (Croatia). Astro 6 SSR on Cloudflare Workers with D1, R2, and Emdash CMS.

## Commands

```bash
npm run dev          # Local dev server (astro dev)
npm run build        # Production build (astro build)
npm run deploy       # Build + wrangler deploy
npm run typecheck    # astro check
npm test             # vitest run
npm run test:watch   # vitest (watch mode)
npm run bootstrap    # emdash init && emdash seed
npm run seed         # emdash seed (re-seed content)
```

CI runs typecheck → test → build → deploy (on main) via `.github/workflows/ci.yml`.

## Architecture

**Runtime:** Astro SSR (`output: "server"`) on Cloudflare Workers. No static generation — HTML rendered per-request with live D1/R2 data.

**Middleware chain** (`src/middleware/index.ts`): redirects (trailing slash) → locale extraction → security headers (CSP stricter on public, relaxed for admin).

**Routing:** Manual i18n with 4 locales (`hr` default, `de`, `sl`, `en`). All public pages under `/[locale]/...`. API routes at `/api/...` (no locale prefix). Admin at `/_emdash/` and `/admin/api/...`.

**Content:** Emdash CMS with collections (apartments, editorial, testimonials, amenities, faq, guide). Locale fallback: requested → `hr`. Content loaded via `src/lib/content.ts`.

**Images:** UUID keys in R2 (no extensions). Served through `/api/img/[key]` with Cloudflare Image Resizing (AVIF/WebP). Hybrid R2 adapter: bindings for reads, S3 API for presigned uploads.

**Availability:** Half-open intervals `[check_in, check_out)` — checkout day is available for new check-in. Overlap: `proposed.checkIn < block.checkOut && proposed.checkOut > block.checkIn`.

**Auth:** Magic link (6-digit codes, SHA-256 hashed, 10-min expiry, 5 attempts/hour). JWT + refresh tokens. Admin emails restricted via `ADMIN_EMAILS` env var.

**Email:** Resend for transactional (magic links, inquiry notifications). Outbox pattern with `email_status` and `retry_at` tracking.

## Cloudflare Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| `DB` | D1 | SQLite database (auth, availability, inquiries, analytics) |
| `MEDIA` | R2 | Image/media storage |

Secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `JWT_SECRET`, `EMDASH_AUTH_SECRET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.

## Database

Two migrations in `migrations/`:
- `0001_auth.sql` — `auth_codes`, `sessions`
- `0002_availability.sql` — `availability_blocks`, `inquiries`, `events`, `redirects`

All dates are `YYYY-MM-DD` strings (UTC midnight). Inquiry statuses: `new|read|responded|confirmed|declined|spam`.

## Key Patterns

- **Islands architecture:** Minimal JS. Client interactivity via `is:inline` scripts (carousel, mobile nav). IntersectionObserver for scroll reveals.
- **Inquiry pipeline** (`POST /api/inquiry`): Zod validation → honeypot → Turnstile → sanitize → availability check → price estimate → D1 insert → Resend email.
- **Pricing:** Season-based with tourist tax (exempt for children <12). Defined in `seed/content/seasons.json`.
- **Security:** Turnstile on all public forms, CSP headers, input sanitization (HTML strip + email header injection), rate limiting on auth.
- **Reduced motion:** All animations respect `prefers-reduced-motion`.

## Documentation

Comprehensive docs in `documentation/` (architecture, API reference, auth, deployment, security, CMS guide, SEO, troubleshooting). Product spec in `sdd/`.
