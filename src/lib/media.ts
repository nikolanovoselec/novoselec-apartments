export interface ImageOptions {
  readonly width?: number;
  readonly format?: "webp" | "avif" | "jpeg";
  readonly quality?: number;
  readonly fit?: "scale-down" | "contain" | "cover" | "crop";
}

/**
 * Build a public media URL for an image stored in R2.
 * The /api/img/:key route handles fetching from R2 and applying Image Resizing.
 */
export function buildMediaUrl(key: string, options?: ImageOptions): string {
  const params = new URLSearchParams();
  if (options?.width) params.set("w", String(options.width));
  if (options?.format) params.set("f", options.format);
  if (options?.quality) params.set("q", String(options.quality));
  if (options?.fit) params.set("fit", options.fit);

  const query = params.toString();
  return `/api/img/${encodeURIComponent(key)}${query ? `?${query}` : ""}`;
}

/**
 * Build a srcset string for responsive images.
 */
export function buildSrcset(
  key: string,
  widths: readonly number[] = [400, 800, 1200, 1920],
  format?: "webp" | "avif" | "jpeg",
): string {
  return widths
    .map((w) => `${buildMediaUrl(key, { width: w, format })} ${w}w`)
    .join(", ");
}

/**
 * Standard responsive image widths.
 */
export const responsiveWidths = [400, 800, 1200, 1920] as const;
