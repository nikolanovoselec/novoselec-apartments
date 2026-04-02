export const locales = ["hr", "de", "sl", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hr";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeNames: Record<Locale, string> = {
  hr: "Hrvatski",
  de: "Deutsch",
  sl: "Slovenščina",
  en: "English",
};
