import { sequence } from "astro:middleware";
import { redirectsMiddleware } from "./redirects";
import { localeMiddleware } from "./locale";
import { headersMiddleware } from "./headers";

/**
 * Middleware chain: redirects -> locale -> headers.
 * Auth middleware added in Phase 3.
 */
export const onRequest = sequence(
  redirectsMiddleware,
  localeMiddleware,
  headersMiddleware,
);
