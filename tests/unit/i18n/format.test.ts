import { describe, it, expect } from "vitest";
import { formatDate, formatDateShort, formatCurrency, formatNumber } from "~/i18n/format";

describe("formatDate()", () => {
  const date = new Date("2026-08-15");

  it("formats date in Croatian", () => {
    const result = formatDate("hr", date);
    expect(result).toContain("2026");
    expect(result).toContain("15");
  });

  it("formats date in German", () => {
    const result = formatDate("de", date);
    expect(result).toContain("2026");
    expect(result).toContain("August");
  });

  it("formats date in Slovenian", () => {
    const result = formatDate("sl", date);
    expect(result).toContain("2026");
  });

  it("formats date in English", () => {
    const result = formatDate("en", date);
    expect(result).toContain("2026");
    expect(result).toContain("August");
  });

  it("accepts custom options", () => {
    const result = formatDate("en", date, { month: "short", day: "numeric" });
    expect(result).toContain("Aug");
    expect(result).toContain("15");
  });
});

describe("formatDateShort()", () => {
  it("returns a short date string", () => {
    const result = formatDateShort("en", new Date("2026-07-01"));
    expect(result).toContain("Jul");
  });
});

describe("formatCurrency()", () => {
  it("formats EUR in German locale", () => {
    const result = formatCurrency("de", 120);
    expect(result).toContain("120");
    expect(result).toContain("€");
  });

  it("formats EUR in English locale", () => {
    const result = formatCurrency("en", 1200);
    expect(result).toContain("€");
    expect(result).toContain("1,200") || expect(result).toContain("1200");
  });

  it("formats fractional amounts", () => {
    const result = formatCurrency("de", 99.5);
    expect(result).toContain("99");
    expect(result).toContain("€");
  });

  it("formats zero", () => {
    const result = formatCurrency("en", 0);
    expect(result).toContain("0");
    expect(result).toContain("€");
  });
});

describe("formatNumber()", () => {
  it("formats number with locale separators", () => {
    const deResult = formatNumber("de", 1234567);
    expect(deResult).toContain("1.234.567") || expect(deResult).toContain("1234567");

    const enResult = formatNumber("en", 1234567);
    expect(enResult).toContain("1,234,567");
  });
});
