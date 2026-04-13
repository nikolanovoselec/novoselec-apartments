/**
 * Availability block: represents a booked date range.
 * Uses half-open interval: [checkIn, checkOut) - checkout day is available for new check-in.
 */
export interface AvailabilityBlock {
  readonly id: string;
  readonly apartmentId: string;
  readonly checkIn: string;  // YYYY-MM-DD
  readonly checkOut: string; // YYYY-MM-DD (exclusive - this day is available)
}

/**
 * Check if a proposed stay overlaps with any existing availability blocks.
 * Uses half-open interval: overlap occurs when proposed.checkIn < block.checkOut AND proposed.checkOut > block.checkIn.
 */
export function hasOverlap(
  blocks: ReadonlyArray<AvailabilityBlock>,
  checkIn: string,
  checkOut: string,
): boolean {
  return blocks.some(
    (block) => checkIn < block.checkOut && checkOut > block.checkIn,
  );
}

/**
 * Find all blocks that overlap with the proposed date range.
 */
export function findOverlappingBlocks(
  blocks: ReadonlyArray<AvailabilityBlock>,
  checkIn: string,
  checkOut: string,
): ReadonlyArray<AvailabilityBlock> {
  return blocks.filter(
    (block) => checkIn < block.checkOut && checkOut > block.checkIn,
  );
}

/**
 * Get all booked dates within a month range as an array of YYYY-MM-DD strings.
 * Useful for calendar display - returns each individual booked night.
 */
export function getBookedDatesInRange(
  blocks: ReadonlyArray<AvailabilityBlock>,
  rangeStart: string,
  rangeEnd: string,
): readonly string[] {
  const bookedDates: string[] = [];

  for (const block of blocks) {
    const start = block.checkIn < rangeStart ? rangeStart : block.checkIn;
    const end = block.checkOut > rangeEnd ? rangeEnd : block.checkOut;

    const current = new Date(start + "T12:00:00Z");
    const endDate = new Date(end + "T12:00:00Z");

    while (current < endDate) {
      const dateStr = current.toISOString().slice(0, 10);
      if (dateStr >= rangeStart && dateStr < rangeEnd) {
        bookedDates.push(dateStr);
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }
  }

  return [...new Set(bookedDates)].sort();
}

/**
 * Validate that check-in is before check-out and they're not the same day.
 */
export function validateDateRange(checkIn: string, checkOut: string): boolean {
  return checkIn < checkOut;
}
