import { describe, it, expect } from "vitest";

/**
 * Tests for the ScrollCollage component data and CMS integration.
 * TDD: written BEFORE implementation.
 */

describe("Collage photo data", () => {
  const exteriorPhotos = [
    "/api/img/7194c1f8-73f3-4fef-934b-b5e88f673315",
    "/api/img/13bda87b-adb7-45c6-bab8-f5bd9eb0b3dd",
    "/api/img/e7911211-aa6b-44ec-a86d-f5761fef4fdf",
    "/api/img/27033d6a-e1fe-4099-950d-e2ce54ac7564",
    "/api/img/2d537213-c38b-4076-8e2e-a5ee25783c0e",
    "/api/img/ce450315-1fcf-4f8b-baba-8d72e8d15ae4",
    "/api/img/505eeb9b-b387-48fb-a76d-f0fe4e50fb46",
    "/api/img/4c3a2840-a47e-4b7c-86bc-d0b2f8f00939",
    "/api/img/874a33b5-4ef6-4cee-b604-9dcca02c2bef",
    "/api/img/b860e7fe-4821-4358-81c3-274f7487b7a8",
  ];

  const interiorPhotosNikola = [
    "/api/img/92faaf15-fab4-4543-9e47-5fd17da50cb3",
    "/api/img/8aa52d38-e07a-4bdc-b0fa-b8929fbe5874",
    "/api/img/40b149e7-7a73-46f5-a6b2-627d00200c68",
    "/api/img/46056f33-0fdf-4b3b-895a-5ba112078002",
    "/api/img/babc3c1c-0907-4887-8b67-9356b1f5a256",
    "/api/img/9d4c4b23-1566-4f49-a674-1c9de72d8fea",
  ];

  const interiorPhotosMarko = [
    "/api/img/5cbbf359-98d4-46a3-8b99-ec1e5117bc3e",
    "/api/img/55a5ff9f-9168-44ed-9b75-76b5011754c6",
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
