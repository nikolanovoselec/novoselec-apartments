import type { APIRoute } from "astro";
import { locales, defaultLocale } from "~/i18n/config";
import { getLocalizedCollection } from "~/lib/content";

const staticPages = [
  "",              // homepage
  "/apartmani",
  "/galerija",
  "/hrana",
  "/aktivnosti",
  "/plaze",
  "/kontakt",
  "/dolazak",
  "/vodic",
  "/o-nama",
  "/faq",
  "/privatnost",
];

/**
 * Dynamic multilingual sitemap.
 * Includes xhtml:link alternates for all active locales per URL.
 * Apartment detail pages are dynamically loaded from CMS.
 */
export const GET: APIRoute = async ({ url }) => {
  const origin = url.origin;
  const activeLocales = [...locales];
  const today = new Date().toISOString().split("T")[0];

  // Load apartment slugs from CMS
  const apartments = await getLocalizedCollection("apartments", defaultLocale);
  const apartmentSlugs = apartments.map((a) => `/apartmani/${a.slug}`);

  const allPages = [...staticPages, ...apartmentSlugs];
  const urls: string[] = [];

  for (const page of allPages) {
    for (const locale of activeLocales) {
      const loc = `${origin}/${locale}${page}`;
      const alternates = activeLocales
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt}" href="${origin}/${alt}${page}" />`,
        )
        .join("\n");

      urls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/${defaultLocale}${page}" />
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
