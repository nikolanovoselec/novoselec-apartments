import type { Locale } from "~/i18n/config";

export interface Season {
  readonly id: string;
  readonly apartmentId: string;
  readonly name: string;
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string;   // YYYY-MM-DD (inclusive)
  readonly pricePerNight: number;
  readonly minStay: number;
}

export interface PriceBreakdown {
  readonly segments: ReadonlyArray<{
    readonly seasonName: string;
    readonly nights: number;
    readonly pricePerNight: number;
    readonly subtotal: number;
  }>;
  readonly nightsTotal: number;
  readonly subtotal: number;
  readonly cleaningFee: number;
  readonly touristTax: number;
  readonly touristTaxRate: number;
  readonly taxablePersons: number;
  readonly total: number;
  readonly hasUncoveredDates: boolean;
}

/**
 * Find the season that covers a given date for an apartment.
 * Returns undefined if no season covers that date.
 */
export function getSeasonForDate(
  seasons: ReadonlyArray<Season>,
  date: string,
): Season | undefined {
  return seasons.find(
    (s) => date >= s.startDate && date <= s.endDate,
  );
}

/**
 * Get all dates (as YYYY-MM-DD strings) between checkIn (inclusive) and checkOut (exclusive).
 * Each date represents a night stayed.
 */
export function getNightDates(checkIn: string, checkOut: string): readonly string[] {
  const dates: string[] = [];
  const current = new Date(checkIn + "T12:00:00Z");
  const end = new Date(checkOut + "T12:00:00Z");

  while (current < end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Compute the full price breakdown for a stay.
 *
 * Handles cross-season stays by splitting at season boundaries.
 * Tourist tax: exempt for children under 12.
 * Returns hasUncoveredDates=true if any night has no season defined.
 */
export function computeStayPrice(params: {
  readonly seasons: ReadonlyArray<Season>;
  readonly checkIn: string;
  readonly checkOut: string;
  readonly adults: number;
  readonly childrenUnder12: number;
  readonly children12to17: number;
  readonly cleaningFee: number;
  readonly touristTaxRate: number;
}): PriceBreakdown {
  const {
    seasons, checkIn, checkOut,
    adults, childrenUnder12, children12to17,
    cleaningFee, touristTaxRate,
  } = params;

  const nightDates = getNightDates(checkIn, checkOut);
  const taxablePersons = adults + children12to17;

  // Group nights by season
  const segmentMap = new Map<string, { season: Season; nights: number }>();
  let hasUncoveredDates = false;

  for (const date of nightDates) {
    const season = getSeasonForDate(seasons, date);
    if (!season) {
      hasUncoveredDates = true;
      continue;
    }
    const existing = segmentMap.get(season.id);
    if (existing) {
      segmentMap.set(season.id, { ...existing, nights: existing.nights + 1 });
    } else {
      segmentMap.set(season.id, { season, nights: 1 });
    }
  }

  const segments = Array.from(segmentMap.values()).map(({ season, nights }) => ({
    seasonName: season.name,
    nights,
    pricePerNight: season.pricePerNight,
    subtotal: nights * season.pricePerNight,
  }));

  const nightsTotal = segments.reduce((sum, s) => sum + s.nights, 0);
  const subtotal = segments.reduce((sum, s) => sum + s.subtotal, 0);
  const touristTax = touristTaxRate * taxablePersons * nightsTotal;
  const total = subtotal + cleaningFee + touristTax;

  return {
    segments,
    nightsTotal,
    subtotal,
    cleaningFee,
    touristTax,
    touristTaxRate,
    taxablePersons,
    total,
    hasUncoveredDates,
  };
}

/**
 * Get the lowest active price per night for an apartment.
 * Returns undefined if no seasons exist or all are in the past.
 */
export function getLowestActiveRate(
  seasons: ReadonlyArray<Season>,
  today?: string,
): number | undefined {
  const todayStr = today ?? new Date().toISOString().slice(0, 10);
  const activeSeason = seasons.filter((s) => s.endDate >= todayStr);

  if (activeSeason.length === 0) return undefined;

  return Math.min(...activeSeason.map((s) => s.pricePerNight));
}

/**
 * Get the minimum stay for a check-in date (cross-season: check-in season rules apply).
 */
export function getMinStayForCheckIn(
  seasons: ReadonlyArray<Season>,
  checkInDate: string,
): number {
  const season = getSeasonForDate(seasons, checkInDate);
  return season?.minStay ?? 1;
}
