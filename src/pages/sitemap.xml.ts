import type { APIRoute } from "astro";
import { locales } from "~/i18n/config";

const pages = [
  "",              // homepage
  "/apartmani",
  "/zasto-pasman",
  "/dolazak",
  "/vodic",
  "/o-nama",
  "/faq",
  "/privatnost",
  "/impressum",
];

/**
 * Dynamic multilingual sitemap.
 * Includes xhtml:link alternates for all active locales per URL.
 * TODO: Query active locales and published apartments from D1/Emdash.
 */
export const GET: APIRoute = async ({ url }) => {
  const origin = url.origin;
  // TODO: Filter by active locales from site-settings
  const activeLocales = [...locales];

  const urls: string[] = [];

  for (const page of pages) {
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
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/hr${page}" />
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
