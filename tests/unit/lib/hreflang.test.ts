import { describe, it, expect } from "vitest";
import { buildHreflangLinks } from "~/lib/hreflang";

const ORIGIN = "https://novoselec.hr";
const LOCALES = ["hr", "de", "sl", "en"] as const;

describe("buildHreflangLinks()", () => {
  it("returns one entry per supported locale plus x-default", () => {
    const links = buildHreflangLinks("/hr/apartmani", ORIGIN);
    expect(links).toHaveLength(LOCALES.length + 1);
  });

  it("includes all four locale variants for a nested path", () => {
    const links = buildHreflangLinks("/hr/apartmani", ORIGIN);
    const hreflangs = links.map((l) => l.hreflang);
    expect(hreflangs).toContain("hr");
    expect(hreflangs).toContain("de");
    expect(hreflangs).toContain("sl");
    expect(hreflangs).toContain("en");
    expect(hreflangs).toContain("x-default");
  });

  it("builds correct hrefs by replacing the locale prefix", () => {
    const links = buildHreflangLinks("/hr/apartmani", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));

    expect(byLang["hr"]).toBe("https://novoselec.hr/hr/apartmani");
    expect(byLang["de"]).toBe("https://novoselec.hr/de/apartmani");
    expect(byLang["sl"]).toBe("https://novoselec.hr/sl/apartmani");
    expect(byLang["en"]).toBe("https://novoselec.hr/en/apartmani");
  });

  it("x-default always points to the HR variant", () => {
    const links = buildHreflangLinks("/de/apartmani", ORIGIN);
    const xDefault = links.find((l) => l.hreflang === "x-default");
    expect(xDefault?.href).toBe("https://novoselec.hr/hr/apartmani");
  });

  it("handles root locale path /hr/", () => {
    const links = buildHreflangLinks("/hr/", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));

    expect(byLang["hr"]).toBe("https://novoselec.hr/hr/");
    expect(byLang["de"]).toBe("https://novoselec.hr/de/");
    expect(byLang["sl"]).toBe("https://novoselec.hr/sl/");
    expect(byLang["en"]).toBe("https://novoselec.hr/en/");
    expect(byLang["x-default"]).toBe("https://novoselec.hr/hr/");
  });

  it("handles deeply nested path /de/apartmani/lavanda", () => {
    const links = buildHreflangLinks("/de/apartmani/lavanda", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));

    expect(byLang["hr"]).toBe("https://novoselec.hr/hr/apartmani/lavanda");
    expect(byLang["de"]).toBe("https://novoselec.hr/de/apartmani/lavanda");
    expect(byLang["sl"]).toBe("https://novoselec.hr/sl/apartmani/lavanda");
    expect(byLang["en"]).toBe("https://novoselec.hr/en/apartmani/lavanda");
  });

  it("does not add a trailing slash when input has none", () => {
    const links = buildHreflangLinks("/hr/apartmani", ORIGIN);
    for (const link of links) {
      expect(link.href).not.toMatch(/\/$/);
    }
  });

  it("preserves trailing slash when input has one", () => {
    const links = buildHreflangLinks("/hr/apartmani/", ORIGIN);
    for (const link of links) {
      // x-default follows hr which has trailing slash
      expect(link.href).toMatch(/\/$/);
    }
  });

  it("works when called with a German locale prefix in the pathname", () => {
    const links = buildHreflangLinks("/de/kontakt", ORIGIN);
    const xDefault = links.find((l) => l.hreflang === "x-default");
    expect(xDefault?.href).toBe("https://novoselec.hr/hr/kontakt");
  });

  it("works when called with a Slovenian locale prefix in the pathname", () => {
    const links = buildHreflangLinks("/sl/kontakt", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));
    expect(byLang["hr"]).toBe("https://novoselec.hr/hr/kontakt");
  });

  it("returns hrefs with no double slashes in the path", () => {
    const links = buildHreflangLinks("/hr/apartmani", ORIGIN);
    for (const link of links) {
      const pathPart = link.href.replace(/^https?:\/\//, "");
      expect(pathPart).not.toContain("//");
    }
  });

  it("returns empty array for invalid locale prefix", () => {
    const links = buildHreflangLinks("/fr/page", ORIGIN);
    expect(links).toHaveLength(0);
  });

  it("returns empty array for non-locale path", () => {
    const links = buildHreflangLinks("/api/inquiry", ORIGIN);
    expect(links).toHaveLength(0);
  });

  it("handles bare locale path /hr without trailing slash", () => {
    const links = buildHreflangLinks("/hr", ORIGIN);
    expect(links).toHaveLength(5);
    const hrLink = links.find((l) => l.hreflang === "hr");
    expect(hrLink?.href).toBe("https://novoselec.hr/hr");
  });
});
