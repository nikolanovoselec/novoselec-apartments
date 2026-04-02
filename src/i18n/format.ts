import type { Locale } from "./config";

const localeMap: Record<Locale, string> = {
  hr: "hr-HR",
  de: "de-DE",
  sl: "sl-SI",
  en: "en-GB",
};

/**
 * Format a date for the given locale.
 */
export function formatDate(
  locale: Locale,
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaults: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat(localeMap[locale], options ?? defaults).format(date);
}

/**
 * Format a short date (e.g., "5. Aug" or "5 Aug").
 */
export function formatDateShort(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(localeMap[locale], {
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format a date range (e.g., "1. Jul – 31. Aug 2026").
 */
export function formatDateRange(locale: Locale, start: Date, end: Date): string {
  return `${formatDateShort(locale, start)} – ${formatDate(locale, end)}`;
}

/**
 * Format currency in EUR with locale-specific formatting.
 */
export function formatCurrency(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with locale-specific separators.
 */
export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeMap[locale]).format(value);
}
