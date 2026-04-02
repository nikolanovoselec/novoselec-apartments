import type { APIRoute } from "astro";

/**
 * Dynamic robots.txt.
 * Blocks admin panel and media URLs from indexing.
 */
export const GET: APIRoute = async ({ url }) => {
  const content = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /_emdash/
Disallow: /media/
Disallow: /api/

Sitemap: ${url.origin}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
