import type { APIRoute } from "astro";

/**
 * Catch-all for /_emdash/* routes.
 * This file exists to give /_emdash paths priority in Astro's file-based
 * router over the dynamic [locale] route. Without this, [locale] matches
 * _emdash as a locale param and returns 404.
 *
 * Emdash's integration injects its own routes at the same patterns.
 * When both exist, Astro should prefer the injected route. If the
 * injected route doesn't match (no handler), this fallback returns 404.
 */
export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  // This should never be reached if Emdash's injected routes are working.
  // If it IS reached, Emdash didn't handle the request.
  return new Response("Emdash route not found", { status: 404 });
};
