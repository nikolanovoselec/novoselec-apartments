import { locales, type Locale } from "~/i18n/config";

interface HreflangLink {
  readonly hreflang: string;
  readonly href: string;
}

/**
 * Build hreflang alternate links for all locales.
 * Used in Base.astro <head> for SEO.
 *
 * @param pathname - Current page pathname (e.g., "/hr/apartmani")
 * @param siteOrigin - Site origin (e.g., "https://novoselec.hr")
 * @returns Array of hreflang link objects for all locales + x-default
 */
export function buildHreflangLinks(
  pathname: string,
  siteOrigin: string,
): readonly HreflangLink[] {
  // Extract the locale prefix and the rest of the path
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (!match) return [];

  // Only generate hreflang for valid locales
  const extractedLocale = match[1];
  if (!locales.includes(extractedLocale as Locale)) return [];

  const rest = match[2] ?? "";

  const links: HreflangLink[] = locales.map((loc) => ({
    hreflang: loc,
    href: `${siteOrigin}/${loc}${rest}`,
  }));

  // x-default points to Croatian variant
  links.push({
    hreflang: "x-default",
    href: `${siteOrigin}/hr${rest}`,
  });

  return links;
}
