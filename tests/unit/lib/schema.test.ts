import { describe, it, expect } from "vitest";
import { buildVacationRentalSchema, buildBreadcrumbSchema } from "~/lib/schema";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const LAVANDA = {
  name: "Apartment Lavanda",
  description: "A beautiful sea-view apartment on Pašman island.",
  image: "https://apartmani.novoselec.ch/images/lavanda/hero.jpg",
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
  it("returns an object with @type 'VacationRental'", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["@type"]).toBe("VacationRental");
  });

  it("includes @context pointing to schema.org", () => {
    const schema = buildVacationRentalSchema(LAVANDA);
    expect(schema["@context"]).toBe("https://schema.org");
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
      "https://apartmani.novoselec.ch/images/lavanda/hero.jpg"
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
// ---------------------------------------------------------------------------

describe("buildBreadcrumbSchema()", () => {
  it("returns an object with @type 'BreadcrumbList'", () => {
    const schema = buildBreadcrumbSchema([{ label: "Home", href: "/" }]);
    expect(schema["@type"]).toBe("BreadcrumbList");
  });

  it("includes @context pointing to schema.org", () => {
    const schema = buildBreadcrumbSchema([{ label: "Home", href: "/" }]);
    expect(schema["@context"]).toBe("https://schema.org");
  });

  it("creates itemListElement array", () => {
    const schema = buildBreadcrumbSchema([{ label: "Home", href: "/" }]);
    const items = schema["itemListElement"] as unknown[];
    expect(Array.isArray(items)).toBe(true);
  });

  it("position numbers start at 1", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Apartments", href: "/hr/apartmani" },
    ]);
    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    expect(items[0]["position"]).toBe(1);
    expect(items[1]["position"]).toBe(2);
  });

  it("items with href get 'item' property", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Apartments", href: "/hr/apartmani" },
    ]);
    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    expect(items[0]["item"]).toBeDefined();
    expect(items[1]["item"]).toBeDefined();
  });

  it("last item without href has no 'item' property (current page)", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Apartments", href: "/hr/apartmani" },
      { label: "Lavanda" },
    ]);
    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    expect(items[2]["item"]).toBeUndefined();
  });

  it("each list item has @type ListItem", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Lavanda" },
    ]);
    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    for (const item of items) {
      expect(item["@type"]).toBe("ListItem");
    }
  });

  it("each list item includes name from label", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Lavanda" },
    ]);
    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    expect(items[0]["name"]).toBe("Home");
    expect(items[1]["name"]).toBe("Lavanda");
  });

  it("returns correct structure for 3-level breadcrumb Home > Apartments > Lavanda", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "https://apartmani.novoselec.ch/hr/" },
      { label: "Apartments", href: "https://apartmani.novoselec.ch/hr/apartmani" },
      { label: "Lavanda" },
    ]);

    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);

    expect(items[0]["position"]).toBe(1);
    expect(items[0]["name"]).toBe("Home");
    expect(items[0]["item"]).toBe("https://apartmani.novoselec.ch/hr/");

    expect(items[1]["position"]).toBe(2);
    expect(items[1]["name"]).toBe("Apartments");
    expect(items[1]["item"]).toBe("https://apartmani.novoselec.ch/hr/apartmani");

    expect(items[2]["position"]).toBe(3);
    expect(items[2]["name"]).toBe("Lavanda");
    expect(items[2]["item"]).toBeUndefined();
  });

  it("handles a single-item breadcrumb (home page)", () => {
    const schema = buildBreadcrumbSchema([{ label: "Home" }]);
    const items = schema["itemListElement"] as Array<Record<string, unknown>>;
    expect(items).toHaveLength(1);
    expect(items[0]["position"]).toBe(1);
    expect(items[0]["name"]).toBe("Home");
    expect(items[0]["item"]).toBeUndefined();
  });

  it("handles empty items array", () => {
    const schema = buildBreadcrumbSchema([]);
    const items = schema["itemListElement"] as unknown[];
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(0);
  });
});
