import type { MiddlewareHandler } from "astro";
import { isValidLocale, defaultLocale, type Locale } from "~/i18n/config";

/**
 * Extract locale from URL path prefix (e.g., /hr/apartmani -> "hr").
 */
export function extractLocaleFromPath(pathname: string): Locale | null {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (match && isValidLocale(match[1])) {
    return match[1] as Locale;
  }
  return null;
}

/**
 * Detect preferred locale from Accept-Language header.
 */
export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase())
    .find((lang) => isValidLocale(lang));

  return (preferred as Locale) ?? defaultLocale;
}

/**
 * Locale middleware: validates locale in URL, sets on locals.
 * Does NOT handle root redirect — that's done in src/pages/index.astro.
 */
export const localeMiddleware: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;

  // Skip API routes, media, admin, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/media/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/_emdash/") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname === "/favicon.svg"
  ) {
    return next();
  }

  // Root redirect handled by src/pages/index.astro
  if (pathname === "/") {
    return next();
  }

  const locale = extractLocaleFromPath(pathname);

  if (locale) {
    context.locals.locale = locale;
  }

  return next();
};
