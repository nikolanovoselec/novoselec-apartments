import { describe, it, expect } from "vitest";
import { buildVacationRentalSchema } from "~/lib/schema";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const LAVANDA = {
  name: "Apartment Lavanda",
  description: "A beautiful sea-view apartment on Pašman island.",
  image: "https://novoselec.hr/images/lavanda/hero.jpg",
  sleeps: 4,
  bedrooms: 2,
  bathrooms: 1,
  size: 65,
  priceFrom: 80,
  amenities: ["WiFi", "Air conditioning", "Parking"],
};

// ---------------------------------------------------------------------------
// buildVacationRentalSchema
// ---------------------------------------------------------------------------

describe("buildVacationRentalSchema()", () => {
  it("returns payload without @context/@type (SchemaOrg component adds those)", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["@context"]).toBeUndefined();
    expect(schema["@type"]).toBeUndefined();
  });

  it("includes name from apartment data", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["name"]).toBe("Apartment Lavanda");
  });

  it("includes description from apartment data", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["description"]).toBe(
      "A beautiful sea-view apartment on Pašman island."
    );
  });

  it("includes image from apartment data", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["image"]).toBe(
      "https://novoselec.hr/images/lavanda/hero.jpg"
    );
  });

  it("maps bedrooms to numberOfRooms", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["numberOfRooms"]).toBe(2);
  });

  it("maps sleeps to occupancy.maxValue", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const occupancy = schema["occupancy"] as Record<string, unknown>;
    expect(occupancy).toBeDefined();
    expect(occupancy["maxValue"]).toBe(4);
  });

  it("sets occupancy @type to QuantitativeValue", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const occupancy = schema["occupancy"] as Record<string, unknown>;
    expect(occupancy["@type"]).toBe("QuantitativeValue");
  });

  it("maps size to floorSize with value and unitCode MTK", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const floorSize = schema["floorSize"] as Record<string, unknown>;
    expect(floorSize).toBeDefined();
    expect(floorSize["@type"]).toBe("QuantitativeValue");
    expect(floorSize["value"]).toBe(65);
    expect(floorSize["unitCode"]).toBe("MTK");
  });

  it("maps amenities to amenityFeature array", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const features = schema["amenityFeature"] as unknown[];
    expect(Array.isArray(features)).toBe(true);
    expect(features).toHaveLength(3);
  });

  it("each amenityFeature has @type LocationFeatureSpecification and name", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const features = schema["amenityFeature"] as Array<Record<string, unknown>>;
    for (const feature of features) {
      expect(feature["@type"]).toBe("LocationFeatureSpecification");
      expect(typeof feature["name"]).toBe("string");
      expect(feature["value"]).toBe(true);
    }
  });

  it("includes amenity names from input array", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const features = schema["amenityFeature"] as Array<Record<string, unknown>>;
    const names = features.map((f) => f["name"]);
    expect(names).toContain("WiFi");
    expect(names).toContain("Air conditioning");
    expect(names).toContain("Parking");
  });

  it("includes priceRange as a string containing the priceFrom value", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const priceRange = schema["priceRange"] as string;
    expect(typeof priceRange).toBe("string");
    expect(priceRange).toContain("80");
  });

  it("includes address with Croatia as addressCountry", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const address = schema["address"] as Record<string, unknown>;
    expect(address).toBeDefined();
    expect(address["addressCountry"]).toBe("HR");
  });

  it("includes address @type PostalAddress", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    const address = schema["address"] as Record<string, unknown>;
    expect(address["@type"]).toBe("PostalAddress");
  });

  it("handles apartment with no amenities", () => {
    const noAmenities = { ...LAVANDA, amenities: [] };
    const schema = buildVacationRentalSchema(noAmenities);
    const features = schema["amenityFeature"] as unknown[];
    expect(Array.isArray(features)).toBe(true);
    expect(features).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// buildBreadcrumbSchema
// Note: buildBreadcrumbSchema was removed — Breadcrumbs.astro builds its own schema inline
