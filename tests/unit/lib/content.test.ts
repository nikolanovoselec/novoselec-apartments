import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLocalizedCollection, getLocalizedEntry } from "~/lib/content";

vi.mock("emdash", () => ({
  getEmDashCollection: vi.fn(),
  getEmDashEntry: vi.fn(),
}));

import { getEmDashCollection, getEmDashEntry } from "emdash";

const mockGetCollection = vi.mocked(getEmDashCollection);
const mockGetEntry = vi.mocked(getEmDashEntry);

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// getLocalizedCollection
// ---------------------------------------------------------------------------

describe("getLocalizedCollection()", () => {
  it("returns entries matched by entry.locale field", async () => {
    mockGetCollection.mockResolvedValue({
      entries: [
        { slug: "apt-one", locale: "de", data: {} },
        { slug: "apt-two", locale: "hr", data: {} },
      ],
    } as never);

    const result = await getLocalizedCollection("apartments", "de");

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("apt-one");
    expect(result[0].locale).toBe("de");
  });

  it("returns entries matched by data.locale field", async () => {
    mockGetCollection.mockResolvedValue({
      entries: [
        { slug: "page-1", data: { locale: "sl" } },
        { slug: "page-2", data: { locale: "hr" } },
      ],
    } as never);

    const result = await getLocalizedCollection("pages", "sl");

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("page-1");
  });

  it("returns entries matched by slug suffix convention", async () => {
    mockGetCollection.mockResolvedValue({
      entries: [
        { slug: "about-en", data: {} },
        { slug: "about-hr", data: {} },
        { slug: "about-de", data: {} },
      ],
    } as never);

    const result = await getLocalizedCollection("pages", "en");

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("about-en");
  });

  it("falls back to Croatian entries when target locale has none", async () => {
    mockGetCollection.mockResolvedValue({
      entries: [
        { slug: "news-hr", locale: "hr", data: {} },
        { slug: "tips-hr", locale: "hr", data: {} },
      ],
    } as never);

    const result = await getLocalizedCollection("news", "de");

    expect(result).toHaveLength(2);
    expect(result.every((e) => e.locale === "hr")).toBe(true);
  });

  it("returns all entries when no Croatian entries found either", async () => {
    mockGetCollection.mockResolvedValue({
      entries: [
        { slug: "entry-a", locale: "en", data: {} },
        { slug: "entry-b", locale: "sl", data: {} },
      ],
    } as never);

    const result = await getLocalizedCollection("misc", "de");

    expect(result).toHaveLength(2);
  });

  it("returns empty array when collection is empty", async () => {
    mockGetCollection.mockResolvedValue({ entries: [] } as never);

    const result = await getLocalizedCollection("empty", "hr");

    expect(result).toEqual([]);
  });

  it("returns empty array when getEmDashCollection throws", async () => {
    mockGetCollection.mockRejectedValue(new Error("D1 unavailable"));

    const result = await getLocalizedCollection("broken", "hr");

    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getLocalizedEntry
// ---------------------------------------------------------------------------

describe("getLocalizedEntry()", () => {
  it("returns locale-specific slug entry when found", async () => {
    mockGetEntry.mockResolvedValue({
      entry: { slug: "about-de", locale: "de", data: { title: "Über uns" } },
    } as never);

    const result = await getLocalizedEntry("pages", "about", "de");

    expect(result).not.toBeNull();
    expect(result!.slug).toBe("about-de");
    // First call should be with locale-specific slug
    expect(mockGetEntry).toHaveBeenCalledWith("pages", "about-de");
  });

  it("falls back to base slug when locale-specific slug not found", async () => {
    mockGetEntry
      .mockRejectedValueOnce(new Error("not found"))
      .mockResolvedValueOnce({
        entry: { slug: "about", locale: "hr", data: { title: "O nama" } },
      } as never);

    const result = await getLocalizedEntry("pages", "about", "en");

    expect(result).not.toBeNull();
    expect(result!.slug).toBe("about");
    expect(mockGetEntry).toHaveBeenCalledTimes(2);
    expect(mockGetEntry).toHaveBeenNthCalledWith(1, "pages", "about-en");
    expect(mockGetEntry).toHaveBeenNthCalledWith(2, "pages", "about");
  });

  it("returns null when entry not found at all", async () => {
    mockGetEntry
      .mockRejectedValueOnce(new Error("not found"))
      .mockResolvedValueOnce({ entry: null } as never);

    const result = await getLocalizedEntry("pages", "missing", "hr");

    expect(result).toBeNull();
  });

  it("returns null when getEmDashEntry throws on base slug", async () => {
    mockGetEntry
      .mockRejectedValueOnce(new Error("not found"))
      .mockRejectedValueOnce(new Error("D1 error"));

    const result = await getLocalizedEntry("pages", "broken", "hr");

    expect(result).toBeNull();
  });
});
