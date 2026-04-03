import { describe, it, expect } from "vitest";
import hr from "~/i18n/translations/hr.json";
import en from "~/i18n/translations/en.json";
import de from "~/i18n/translations/de.json";
import sl from "~/i18n/translations/sl.json";

const locales = { hr, en, de, sl } as Record<string, Record<string, string>>;
const localeNames = Object.keys(locales);

describe("Translation completeness", () => {
  // Every key in HR must exist in all other locales
  const hrKeys = Object.keys(hr);

  for (const key of hrKeys) {
    for (const locale of localeNames) {
      if (locale === "hr") continue;
      it(`key "${key}" exists in ${locale}`, () => {
        expect(locales[locale][key]).toBeDefined();
      });
    }
  }

  // Every key in EN must exist in HR (catch keys added to EN but not HR)
  const enKeys = Object.keys(en);
  for (const key of enKeys) {
    it(`EN key "${key}" also exists in HR`, () => {
      expect(hr[key as keyof typeof hr]).toBeDefined();
    });
  }

  // No empty string values in any locale
  for (const locale of localeNames) {
    for (const [key, value] of Object.entries(locales[locale])) {
      it(`${locale}."${key}" is not empty`, () => {
        expect(value.trim().length).toBeGreaterThan(0);
      });
    }
  }

  // Critical keys that MUST exist in all locales
  const criticalKeys = [
    "nav.home", "nav.apartments", "nav.contact",
    "apartments.title", "apartments.sleeps", "apartments.fromPrice",
    "apartments.bedrooms", "apartments.night", "apartments.amenitiesTitle",
    "apartments.priceFromLabel", "apartments.viewButton",
    "homepage.ourGuests", "homepage.experiences", "homepage.discoverIsland",
    "homepage.triptych.food", "homepage.triptych.activities", "homepage.triptych.beaches",
    "homepage.cta.label", "homepage.cta.title", "homepage.cta.subtitle", "homepage.cta.button",
    "hosts.title", "gettingHere.title", "faq.title",
    "footer.tagline",
    "error.404.message", "error.404.home",
  ];

  for (const key of criticalKeys) {
    for (const locale of localeNames) {
      it(`critical key "${key}" exists in ${locale}`, () => {
        expect(locales[locale][key]).toBeDefined();
        expect(locales[locale][key].trim().length).toBeGreaterThan(0);
      });
    }
  }
});
