// TDD tests for Phase 3 — src/lib/hreflang.ts does not exist yet.
// These tests WILL FAIL until the module is implemented.

import { describe, it, expect } from "vitest";
import { buildHreflangLinks } from "~/lib/hreflang";

const ORIGIN = "https://apartmani.novoselec.ch";
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

    expect(byLang["hr"]).toBe("https://apartmani.novoselec.ch/hr/apartmani");
    expect(byLang["de"]).toBe("https://apartmani.novoselec.ch/de/apartmani");
    expect(byLang["sl"]).toBe("https://apartmani.novoselec.ch/sl/apartmani");
    expect(byLang["en"]).toBe("https://apartmani.novoselec.ch/en/apartmani");
  });

  it("x-default always points to the HR variant", () => {
    const links = buildHreflangLinks("/de/apartmani", ORIGIN);
    const xDefault = links.find((l) => l.hreflang === "x-default");
    expect(xDefault?.href).toBe("https://apartmani.novoselec.ch/hr/apartmani");
  });

  it("handles root locale path /hr/", () => {
    const links = buildHreflangLinks("/hr/", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));

    expect(byLang["hr"]).toBe("https://apartmani.novoselec.ch/hr/");
    expect(byLang["de"]).toBe("https://apartmani.novoselec.ch/de/");
    expect(byLang["sl"]).toBe("https://apartmani.novoselec.ch/sl/");
    expect(byLang["en"]).toBe("https://apartmani.novoselec.ch/en/");
    expect(byLang["x-default"]).toBe("https://apartmani.novoselec.ch/hr/");
  });

  it("handles deeply nested path /de/apartmani/lavanda", () => {
    const links = buildHreflangLinks("/de/apartmani/lavanda", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));

    expect(byLang["hr"]).toBe("https://apartmani.novoselec.ch/hr/apartmani/lavanda");
    expect(byLang["de"]).toBe("https://apartmani.novoselec.ch/de/apartmani/lavanda");
    expect(byLang["sl"]).toBe("https://apartmani.novoselec.ch/sl/apartmani/lavanda");
    expect(byLang["en"]).toBe("https://apartmani.novoselec.ch/en/apartmani/lavanda");
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
    expect(xDefault?.href).toBe("https://apartmani.novoselec.ch/hr/kontakt");
  });

  it("works when called with a Slovenian locale prefix in the pathname", () => {
    const links = buildHreflangLinks("/sl/kontakt", ORIGIN);
    const byLang = Object.fromEntries(links.map((l) => [l.hreflang, l.href]));
    expect(byLang["hr"]).toBe("https://apartmani.novoselec.ch/hr/kontakt");
  });

  it("returns hrefs with no double slashes in the path", () => {
    const links = buildHreflangLinks("/hr/apartmani", ORIGIN);
    for (const link of links) {
      // Strip the protocol (https://) before checking for double slashes in path
      const pathPart = link.href.replace(/^https?:\/\//, "");
      expect(pathPart).not.toContain("//");
    }
  });
});
