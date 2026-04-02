import type { Locale } from "./config";
import { defaultLocale } from "./config";

import hrTranslations from "./translations/hr.json";
import deTranslations from "./translations/de.json";
import slTranslations from "./translations/sl.json";
import enTranslations from "./translations/en.json";

type TranslationKey = keyof typeof hrTranslations;

const translations: Record<Locale, Record<string, string>> = {
  hr: hrTranslations,
  de: deTranslations,
  sl: slTranslations,
  en: enTranslations,
};

/**
 * Get a translated string for the given locale and key.
 * Falls back to Croatian if the key is missing in the target locale.
 * Supports interpolation: t("en", "apartments.sleeps", { count: "4" })
 */
export function t(
  locale: Locale,
  key: TranslationKey | string,
  params?: Record<string, string>,
): string {
  const localeStrings = translations[locale];
  const fallbackStrings = translations[defaultLocale];

  const raw = localeStrings[key] ?? fallbackStrings[key] ?? key;

  if (!params) return raw;

  return Object.entries(params).reduce(
    (result, [paramKey, value]) => result.replaceAll(`{${paramKey}}`, value),
    raw,
  );
}

/**
 * Check if a translation key exists for a given locale (not just fallback).
 */
export function hasTranslation(locale: Locale, key: string): boolean {
  return key in translations[locale];
}
