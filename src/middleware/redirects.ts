import type { MiddlewareHandler } from "astro";

/**
 * URL normalization middleware.
 * - Removes trailing slashes (except root)
 * - Redirects www to non-www (handled at Cloudflare level, but defense-in-depth)
 */
export const redirectsMiddleware: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;

  // Remove trailing slash (except for root /)
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const cleaned = pathname.slice(0, -1);
    const target = new URL(cleaned + context.url.search, context.url.origin);
    return context.redirect(target.toString(), 301);
  }

  return next();
};
