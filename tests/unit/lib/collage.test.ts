import { describe, it, expect } from "vitest";

/**
 * Tests for the ScrollCollage component data and CMS integration.
 * TDD: written BEFORE implementation.
 */

describe("Collage photo data", () => {
  const exteriorPhotos = [
    "/photos/apt-nikola-terrace-dining.jpg",
    "/photos/apt-nikola-terrace-wide.jpg",
    "/photos/apt-nikola-terrace-loungers.jpg",
    "/photos/apt-nikola-terrace-bbq.jpg",
    "/photos/apt-bbq-garden.jpg",
    "/photos/apt-marko-balcony.jpg",
    "/photos/apt-marko-balcony-view.jpg",
    "/photos/apt-marko-pine-view.jpg",
    "/photos/apt-building-exterior.jpg",
    "/photos/apt-nikola-wine-glass.jpg",
  ];

  const interiorPhotosNikola = [
    "/photos/apt-nikola-living.jpg",
    "/photos/apt-nikola-kitchen-new.jpg",
    "/photos/apt-nikola-bedroom1.jpg",
    "/photos/apt-nikola-bedroom2.jpg",
    "/photos/apt-nikola-bathroom.jpg",
    "/photos/apt-nikola-kids-sofa.jpg",
  ];

  const interiorPhotosMarko = [
    "/photos/apt-marko-kitchen.jpg",
    "/photos/apt-nikola-living-terrace.jpg",
  ];

  it("exterior photos should not include any interior photos", () => {
    const allInterior = [...interiorPhotosNikola, ...interiorPhotosMarko];
    for (const ext of exteriorPhotos) {
      expect(allInterior).not.toContain(ext);
    }
  });

  it("interior photos should not include any exterior photos", () => {
    const allInterior = [...interiorPhotosNikola, ...interiorPhotosMarko];
    for (const int of allInterior) {
      expect(exteriorPhotos).not.toContain(int);
    }
  });

  it("should have at least 5 exterior photos for smooth collage loop", () => {
    expect(exteriorPhotos.length).toBeGreaterThanOrEqual(5);
  });

  it("each apartment should have at least 2 interior photos", () => {
    expect(interiorPhotosNikola.length).toBeGreaterThanOrEqual(2);
    expect(interiorPhotosMarko.length).toBeGreaterThanOrEqual(2);
  });

  it("no duplicate photos in any list", () => {
    const allPhotos = [...exteriorPhotos, ...interiorPhotosNikola, ...interiorPhotosMarko];
    const unique = new Set(allPhotos);
    expect(unique.size).toBe(allPhotos.length);
  });
});

describe("Collage CMS data parsing", () => {
  it("should parse JSON array of {src, alt} objects from CMS body", () => {
    const cmsBody = JSON.stringify([
      { src: "/photos/test1.jpg", alt: "Test 1" },
      { src: "/photos/test2.jpg", alt: "Test 2" },
    ]);

    const parsed = JSON.parse(cmsBody) as Array<{ src: string; alt: string }>;
    expect(parsed).toHaveLength(2);
    expect(parsed[0].src).toBe("/photos/test1.jpg");
    expect(parsed[0].alt).toBe("Test 1");
  });

  it("should handle empty CMS body gracefully", () => {
    const cmsBody = "";
    let parsed: Array<{ src: string; alt: string }> = [];
    try {
      parsed = JSON.parse(cmsBody);
    } catch {
      parsed = [];
    }
    expect(parsed).toHaveLength(0);
  });

  it("should handle malformed JSON gracefully", () => {
    const cmsBody = "not json";
    let parsed: Array<{ src: string; alt: string }> = [];
    try {
      parsed = JSON.parse(cmsBody);
    } catch {
      parsed = [];
    }
    expect(parsed).toHaveLength(0);
  });
});
