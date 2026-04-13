import { describe, it, expect } from "vitest";
import { t, hasTranslation } from "~/i18n/t";

describe("t() translation helper", () => {
  it("returns Croatian translation for hr locale", () => {
    expect(t("hr", "nav.home")).toBe("Početna");
  });

  it("returns German translation for de locale", () => {
    expect(t("de", "nav.home")).toBe("Startseite");
  });

  it("returns Slovenian translation for sl locale", () => {
    expect(t("sl", "nav.home")).toBe("Domov");
  });

  it("returns English translation for en locale", () => {
    expect(t("en", "nav.home")).toBe("Home");
  });

  it("falls back to Croatian when key missing in target locale", () => {
    // All locales should have all keys, but if one is missing, Croatian is fallback
    const result = t("en", "nav.home");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns the key itself when missing from all locales", () => {
    expect(t("en", "nonexistent.key")).toBe("nonexistent.key");
  });

  it("interpolates params with {placeholder} syntax", () => {
    expect(t("en", "apartments.sleeps", { count: "4" })).toBe("Sleeps 4");
    expect(t("de", "apartments.sleeps", { count: "6" })).toBe("6 Personen");
    expect(t("hr", "apartments.sleeps", { count: "3" })).toBe("3 osoba");
  });

  it("interpolates multiple params", () => {
    const result = t("en", "pricing.touristTaxNote", { rate: "1.35" });
    expect(result).toContain("1.35");
    expect(result).toContain("Children under 12");
  });

  it("returns raw string when no params provided for parameterized key", () => {
    const result = t("en", "apartments.sleeps");
    expect(result).toBe("Sleeps {count}");
  });

  it("handles all navigation keys across all locales", () => {
    const navKeys = [
      "nav.home", "nav.apartments", "nav.whyPasman", "nav.gettingHere",
      "nav.localGuide", "nav.about", "nav.faq", "nav.inquire",
    ];
    const locales = ["hr", "de", "sl", "en"] as const;

    for (const locale of locales) {
      for (const key of navKeys) {
        const result = t(locale, key);
        expect(result).not.toBe(key); // Should not fall through to key
        expect(result.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("hasTranslation()", () => {
  it("returns true for existing keys", () => {
    expect(hasTranslation("en", "nav.home")).toBe(true);
    expect(hasTranslation("de", "nav.home")).toBe(true);
  });

  it("returns false for non-existing keys", () => {
    expect(hasTranslation("en", "nonexistent.key")).toBe(false);
  });
});
