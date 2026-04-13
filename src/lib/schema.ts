interface ApartmentData {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly sleeps: number;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly size: number;
  readonly priceFrom: number;
  readonly amenities: readonly string[];
}

/**
 * Build Schema.org VacationRental JSON-LD payload for an apartment.
 * Does NOT include @context/@type - the SchemaOrg.astro component adds those.
 */
export function buildVacationRentalSchema(
  apartment: ApartmentData,
): Record<string, unknown> {
  return {
    name: apartment.name,
    description: apartment.description,
    image: apartment.image,
    numberOfRooms: apartment.bedrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: apartment.sleeps,
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: apartment.size,
      unitCode: "MTK",
    },
    amenityFeature: apartment.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    priceRange: `From €${apartment.priceFrom}/night`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ždrelac",
      addressRegion: "Zadar County",
      addressCountry: "HR",
    },
  };
}
