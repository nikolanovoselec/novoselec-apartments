import type { MiddlewareHandler } from "astro";

/**
 * Security headers middleware.
 * Sets CSP, X-Frame-Options, and other security headers on all responses.
 */
export const headersMiddleware: MiddlewareHandler = async (context, next) => {
  const response = await next();

  const isAdmin = context.url.pathname.startsWith("/_emdash/") ||
    context.url.pathname.startsWith("/admin/");

  // Stricter CSP for visitor pages, relaxed for admin
  const csp = isAdmin
    ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' https:; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'self' https://challenges.cloudflare.com"
    : [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
};
