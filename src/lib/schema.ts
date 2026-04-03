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

interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

/**
 * Build Schema.org VacationRental JSON-LD for an apartment.
 */
export function buildVacationRentalSchema(
  apartment: ApartmentData,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
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

/**
 * Build Schema.org BreadcrumbList JSON-LD.
 */
export function buildBreadcrumbSchema(
  items: readonly BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };
}
