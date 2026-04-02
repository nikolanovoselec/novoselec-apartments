import { describe, it, expect } from "vitest";
import {
  getSeasonForDate,
  getNightDates,
  computeStayPrice,
  getLowestActiveRate,
  getMinStayForCheckIn,
  type Season,
} from "~/lib/pricing";

const seasons: readonly Season[] = [
  { id: "s1", apartmentId: "a1", name: "Off-peak", startDate: "2026-05-01", endDate: "2026-06-30", pricePerNight: 80, minStay: 3 },
  { id: "s2", apartmentId: "a1", name: "Peak", startDate: "2026-07-01", endDate: "2026-08-31", pricePerNight: 150, minStay: 7 },
  { id: "s3", apartmentId: "a1", name: "Shoulder", startDate: "2026-09-01", endDate: "2026-09-30", pricePerNight: 100, minStay: 3 },
];

describe("getSeasonForDate()", () => {
  it("returns correct season for a date within range", () => {
    expect(getSeasonForDate(seasons, "2026-07-15")?.name).toBe("Peak");
    expect(getSeasonForDate(seasons, "2026-05-01")?.name).toBe("Off-peak");
    expect(getSeasonForDate(seasons, "2026-06-30")?.name).toBe("Off-peak");
  });

  it("returns undefined for uncovered dates", () => {
    expect(getSeasonForDate(seasons, "2026-04-15")).toBeUndefined();
    expect(getSeasonForDate(seasons, "2026-10-05")).toBeUndefined();
  });
});

describe("getNightDates()", () => {
  it("returns correct night dates (checkIn inclusive, checkOut exclusive)", () => {
    const dates = getNightDates("2026-07-01", "2026-07-04");
    expect(dates).toEqual(["2026-07-01", "2026-07-02", "2026-07-03"]);
  });

  it("returns empty for same-day check-in/out", () => {
    expect(getNightDates("2026-07-01", "2026-07-01")).toEqual([]);
  });

  it("handles single night", () => {
    expect(getNightDates("2026-07-01", "2026-07-02")).toEqual(["2026-07-01"]);
  });

  it("handles month boundaries", () => {
    const dates = getNightDates("2026-06-29", "2026-07-02");
    expect(dates).toEqual(["2026-06-29", "2026-06-30", "2026-07-01"]);
  });
});

describe("computeStayPrice()", () => {
  const baseParams = {
    seasons,
    adults: 2,
    childrenUnder12: 1,
    children12to17: 0,
    cleaningFee: 50,
    touristTaxRate: 1.35,
  };

  it("computes single-season stay correctly", () => {
    const result = computeStayPrice({
      ...baseParams,
      checkIn: "2026-07-05",
      checkOut: "2026-07-12",
    });

    expect(result.nightsTotal).toBe(7);
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].seasonName).toBe("Peak");
    expect(result.segments[0].pricePerNight).toBe(150);
    expect(result.subtotal).toBe(7 * 150); // 1050
    expect(result.cleaningFee).toBe(50);
    // Tourist tax: 1.35 * 2 taxable persons * 7 nights = 18.9
    expect(result.touristTax).toBeCloseTo(1.35 * 2 * 7);
    expect(result.taxablePersons).toBe(2); // children under 12 exempt
    expect(result.hasUncoveredDates).toBe(false);
  });

  it("splits cross-season stays correctly", () => {
    const result = computeStayPrice({
      ...baseParams,
      checkIn: "2026-06-28",
      checkOut: "2026-07-04",
    });

    expect(result.nightsTotal).toBe(6);
    expect(result.segments).toHaveLength(2);

    const offPeak = result.segments.find((s) => s.seasonName === "Off-peak");
    const peak = result.segments.find((s) => s.seasonName === "Peak");

    expect(offPeak?.nights).toBe(3); // Jun 28, 29, 30
    expect(peak?.nights).toBe(3);    // Jul 1, 2, 3
    expect(result.subtotal).toBe(3 * 80 + 3 * 150); // 240 + 450 = 690
  });

  it("handles children 12-17 as taxable", () => {
    const result = computeStayPrice({
      ...baseParams,
      children12to17: 2,
      checkIn: "2026-07-01",
      checkOut: "2026-07-02",
    });

    // 2 adults + 2 children 12-17 = 4 taxable persons
    expect(result.taxablePersons).toBe(4);
    expect(result.touristTax).toBeCloseTo(1.35 * 4 * 1);
  });

  it("exempts children under 12 from tourist tax", () => {
    const result = computeStayPrice({
      ...baseParams,
      childrenUnder12: 3,
      checkIn: "2026-07-01",
      checkOut: "2026-07-02",
    });

    // Only 2 adults are taxable, 3 children under 12 exempt
    expect(result.taxablePersons).toBe(2);
  });

  it("flags uncovered dates", () => {
    const result = computeStayPrice({
      ...baseParams,
      checkIn: "2026-04-25",
      checkOut: "2026-05-03",
    });

    expect(result.hasUncoveredDates).toBe(true);
    // Apr 25-30 are uncovered (6 nights), May 1-2 are off-peak (2 nights)
    expect(result.nightsTotal).toBe(2);
  });

  it("computes total including all fees", () => {
    const result = computeStayPrice({
      ...baseParams,
      checkIn: "2026-07-01",
      checkOut: "2026-07-08",
    });

    const expectedSubtotal = 7 * 150;
    const expectedTax = 1.35 * 2 * 7;
    const expectedTotal = expectedSubtotal + 50 + expectedTax;

    expect(result.total).toBeCloseTo(expectedTotal);
  });
});

describe("getLowestActiveRate()", () => {
  it("returns lowest rate among active seasons", () => {
    expect(getLowestActiveRate(seasons, "2026-06-01")).toBe(80);
  });

  it("excludes past seasons", () => {
    expect(getLowestActiveRate(seasons, "2026-09-15")).toBe(100);
  });

  it("returns undefined when no active seasons", () => {
    expect(getLowestActiveRate(seasons, "2026-11-01")).toBeUndefined();
  });
});

describe("getMinStayForCheckIn()", () => {
  it("returns min stay for check-in season", () => {
    expect(getMinStayForCheckIn(seasons, "2026-07-15")).toBe(7);
    expect(getMinStayForCheckIn(seasons, "2026-05-15")).toBe(3);
  });

  it("returns 1 for uncovered dates", () => {
    expect(getMinStayForCheckIn(seasons, "2026-04-01")).toBe(1);
  });
});
