import { getEmDashCollection, getEmDashEntry } from "emdash";
import type { Locale } from "~/i18n/config";

export interface LocalizedEntry {
  slug: string;
  locale: string;
  data: Record<string, unknown>;
}

/**
 * Get all entries from an Emdash collection filtered by locale.
 * Uses Emdash's built-in locale filter (SQL-level, no pagination needed).
 * Falls back to Croatian if locale-specific content not found.
 */
export async function getLocalizedCollection(
  collectionSlug: string,
  locale: Locale,
): Promise<LocalizedEntry[]> {
  try {
    // Use Emdash's native locale filter - no limit means ALL entries returned
    const { entries } = await getEmDashCollection(collectionSlug, { locale });
    if (entries && entries.length > 0) {
      return entries.map(mapEntry);
    }

    // Fallback: try Croatian
    if (locale !== "hr") {
      const { entries: hrEntries } = await getEmDashCollection(collectionSlug, { locale: "hr" });
      if (hrEntries && hrEntries.length > 0) {
        return hrEntries.map(mapEntry);
      }
    }

    return [];
  } catch (error) {
    console.error(`[CMS] Failed to load collection "${collectionSlug}":`, error);
    return [];
  }
}

/**
 * Get a single entry by slug and locale.
 */
export async function getLocalizedEntry(
  collectionSlug: string,
  slug: string,
  locale: Locale,
): Promise<LocalizedEntry | null> {
  try {
    // Try locale-specific slug first (e.g., "about-hr")
    const localizedSlug = `${slug}-${locale}`;
    try {
      const { entry } = await getEmDashEntry(collectionSlug, localizedSlug);
      if (entry) return mapEntry(entry);
    } catch {
      // Not found, try base slug
    }

    const { entry } = await getEmDashEntry(collectionSlug, slug);
    if (entry) return mapEntry(entry);
    return null;
  } catch (error) {
    console.error(`[CMS] Failed to load entry "${collectionSlug}/${slug}":`, error);
    return null;
  }
}

/**
 * Get site settings from Emdash.
 */
export async function getSettings(): Promise<Record<string, unknown> | null> {
  try {
    const { getSiteSettings } = await import("emdash");
    return (await getSiteSettings()) as Record<string, unknown>;
  } catch (error) {
    console.error("[CMS] Failed to load site settings:", error);
    return null;
  }
}

function mapEntry(entry: unknown): LocalizedEntry {
  const e = entry as { slug?: string; locale?: string; data?: Record<string, unknown> };
  // locale is at entry level (Emdash i18n) OR in data.locale (our custom field)
  const locale = e.locale ?? (e.data?.locale as string) ?? "hr";
  return {
    slug: e.slug ?? "",
    locale,
    data: e.data ?? {},
  };
}

/**
 * Parse collage/gallery photo array from CMS body field.
 * Emdash auto-parses JSON fields (strings starting with [ or {),
 * so the value may be an already-parsed array OR a string.
 */
export function parsePhotoArray(body: unknown): Array<{ src: string; alt: string }> {
  let raw: unknown = body;
  if (typeof raw === "string") {
    try { raw = JSON.parse(raw); } catch { return []; }
  }
  if (Array.isArray(raw)) {
    return raw.filter(
      (item: unknown) =>
        typeof item === "object" && item !== null &&
        typeof (item as Record<string, unknown>).src === "string" &&
        typeof (item as Record<string, unknown>).alt === "string"
    );
  }
  return [];
}
