import { describe, it, expect } from "vitest";
import {
  hasOverlap,
  findOverlappingBlocks,
  getBookedDatesInRange,
  validateDateRange,
  type AvailabilityBlock,
} from "~/lib/availability";

const blocks: readonly AvailabilityBlock[] = [
  { id: "b1", apartmentId: "a1", checkIn: "2026-07-05", checkOut: "2026-07-12" },
  { id: "b2", apartmentId: "a1", checkIn: "2026-07-20", checkOut: "2026-07-27" },
  { id: "b3", apartmentId: "a1", checkIn: "2026-08-01", checkOut: "2026-08-08" },
];

describe("hasOverlap()", () => {
  it("detects full overlap", () => {
    expect(hasOverlap(blocks, "2026-07-06", "2026-07-10")).toBe(true);
  });

  it("detects partial overlap at start", () => {
    expect(hasOverlap(blocks, "2026-07-03", "2026-07-07")).toBe(true);
  });

  it("detects partial overlap at end", () => {
    expect(hasOverlap(blocks, "2026-07-10", "2026-07-15")).toBe(true);
  });

  it("detects encompassing overlap", () => {
    expect(hasOverlap(blocks, "2026-07-01", "2026-07-30")).toBe(true);
  });

  it("allows check-in on checkout day (half-open interval)", () => {
    // Block ends 2026-07-12 (exclusive), so new check-in on 2026-07-12 is OK
    expect(hasOverlap(blocks, "2026-07-12", "2026-07-15")).toBe(false);
  });

  it("allows checkout on check-in day of existing block", () => {
    // Block starts 2026-07-20, so new checkout on 2026-07-20 is OK
    expect(hasOverlap(blocks, "2026-07-15", "2026-07-20")).toBe(false);
  });

  it("returns false for completely free range", () => {
    expect(hasOverlap(blocks, "2026-07-13", "2026-07-19")).toBe(false);
  });

  it("returns false for empty blocks array", () => {
    expect(hasOverlap([], "2026-07-01", "2026-07-30")).toBe(false);
  });
});

describe("findOverlappingBlocks()", () => {
  it("finds all overlapping blocks for a wide range", () => {
    const result = findOverlappingBlocks(blocks, "2026-07-01", "2026-08-10");
    expect(result).toHaveLength(3);
  });

  it("finds single overlapping block", () => {
    const result = findOverlappingBlocks(blocks, "2026-07-06", "2026-07-10");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b1");
  });

  it("returns empty for non-overlapping range", () => {
    const result = findOverlappingBlocks(blocks, "2026-07-13", "2026-07-19");
    expect(result).toHaveLength(0);
  });
});

describe("getBookedDatesInRange()", () => {
  it("returns individual booked dates for a month", () => {
    const dates = getBookedDatesInRange(blocks, "2026-07-01", "2026-08-01");
    // Block b1: Jul 5-11 (7 nights), Block b2: Jul 20-26 (7 nights) = 14 dates
    expect(dates).toHaveLength(14);
    expect(dates).toContain("2026-07-05");
    expect(dates).toContain("2026-07-11");
    expect(dates).not.toContain("2026-07-12"); // checkout day is free
    expect(dates).toContain("2026-07-20");
    expect(dates).toContain("2026-07-26");
    expect(dates).not.toContain("2026-07-27"); // checkout day is free
  });

  it("returns sorted unique dates", () => {
    const dates = getBookedDatesInRange(blocks, "2026-07-01", "2026-08-01");
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] > dates[i - 1]).toBe(true);
    }
  });

  it("handles blocks partially outside range", () => {
    const dates = getBookedDatesInRange(blocks, "2026-07-08", "2026-07-25");
    // Block b1 contributes Jul 8-11 (4 dates), Block b2 contributes Jul 20-24 (5 dates)
    expect(dates).toContain("2026-07-08");
    expect(dates).toContain("2026-07-11");
    expect(dates).not.toContain("2026-07-05"); // before range
    expect(dates).toContain("2026-07-20");
    expect(dates).toContain("2026-07-24");
  });

  it("returns empty for no blocks in range", () => {
    const dates = getBookedDatesInRange(blocks, "2026-06-01", "2026-07-01");
    expect(dates).toHaveLength(0);
  });
});

describe("validateDateRange()", () => {
  it("returns true for valid range", () => {
    expect(validateDateRange("2026-07-01", "2026-07-08")).toBe(true);
  });

  it("returns false for same-day", () => {
    expect(validateDateRange("2026-07-01", "2026-07-01")).toBe(false);
  });

  it("returns false for checkout before checkin", () => {
    expect(validateDateRange("2026-07-08", "2026-07-01")).toBe(false);
  });
});
