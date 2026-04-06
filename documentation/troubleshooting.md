# Troubleshooting

Common issues and how to resolve them.

**Audience:** Developers, Operators

---

## Admin Panel

### "Authentication failed" after CF Access login
**Cause:** `CF_ACCESS_AUDIENCE` env var not matching the Access Application AUD tag, or the var not accessible at runtime.

**Fix:**
1. Verify `CF_ACCESS_AUDIENCE` is set in `wrangler.jsonc` vars (NOT as a secret — `process.env` on Workers only reads vars)
2. Verify the AUD tag matches the Access Application in CF dashboard
3. Redeploy after changes: `npx wrangler deploy`

### Can't reach admin panel at all
**Cause:** Cloudflare Access policy not configured for the path.

**Fix:** Ensure a CF Access Application exists for domain `apartmani.novoselec.ch/_emdash` with the correct users in the policy.

## Content & Display

### Changes not appearing on the live site
**Cause:** Edge caching. Static pages are cached at Cloudflare's edge.

**Fix:**
- Wait up to 1 hour for cache expiry
- Force purge: CF Dashboard → Caching → Purge Everything
- Force refresh in browser: Ctrl+Shift+R

### Wave dividers not showing under hero images
**Cause:** Missing `<style>` block in the page file. Each page needs its own hero CSS because Astro scopes styles per component.

**Fix:** Ensure the page has a `<style is:global>` block with `.page-hero` and `.page-hero__wave` styles. Copy from `hrana.astro` as reference.

### Mixed languages on a page
**Cause:** Translation key missing for the active locale, falling back to Croatian.

**Fix:** Check `src/i18n/translations/{locale}.json` for the missing key. Add the translation.

## Forms & Email

### Inquiry form submission fails silently
**Possible causes:**
1. Turnstile not loaded (check CSP allows `challenges.cloudflare.com`)
2. Turnstile token expired (form open > 5 minutes)
3. API endpoint error

**Debug:** Open browser DevTools → Network → submit the form → check `/api/inquiry` response status and body.

### Emails not being received
**Possible causes:**
1. `RESEND_API_KEY` not set as Worker secret
2. `ADMIN_EMAILS` var empty or wrong in `wrangler.jsonc`
3. Resend API rate limit or domain verification issue

**Debug:**
```bash
npx wrangler secret list  # verify RESEND_API_KEY exists
npx wrangler tail          # watch live logs during form submission
```

### Turnstile widget not rendering
**Cause:** CSP blocking the Turnstile script.

**Fix:** Ensure CSP includes:
- `script-src: https://challenges.cloudflare.com`
- `frame-src: https://challenges.cloudflare.com`
- `connect-src: https://challenges.cloudflare.com`

## Deployment

### Build fails in CI
**Common causes:**
1. TypeScript errors: run `astro check` locally to see details
2. Missing dependencies: `npm ci` failed
3. Import errors: check for circular imports or wrong paths

### Deploy succeeds but site shows old version
**Cause:** Cloudflare edge cache serving stale content.

**Fix:** Purge cache in CF Dashboard, or wait for cache TTL expiry.

### D1 database errors
**Cause:** Migration conflict or table schema mismatch.

**Fix:** For development, wipe and rebuild:
```bash
npx wrangler d1 execute apartmani-db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
```
Check which tables exist and compare to expected schema.

---

## Related Documentation

- [Configuration](configuration.md#d1-migrations) — Migration files and apply commands
- [Deployment](deployment.md) — Full setup and deploy steps
- [Authentication](authentication.md#cloudflare-access-authentication) — CF Access setup and troubleshooting
- [Security](security.md#rate-limiting) — Rate limiting and bot protection details
- [CMS Guide](cms-guide.md) — Owner-facing content management issues
