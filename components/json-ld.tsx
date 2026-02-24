export function LodgingBusinessJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";
  const json = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Direct Book",
    url: baseUrl,
    description: "Vacation rentals in Boston area, Concord, and Methuen. Book directly and save.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

type AccommodationJsonLdProps = {
  name: string;
  description: string;
  url: string;
  image?: string;
  addressLocality: string;
  addressRegion: string;
  maxGuests: number;
  amenities: string[];
  rating?: number;
  reviewCount?: number;
  externalRating?: number;
  externalReviewCount?: number;
  externalSourceLabel?: string;
};

export function AccommodationJsonLd({
  name,
  description,
  url,
  image,
  addressLocality,
  addressRegion,
  maxGuests,
  amenities,
  rating,
  reviewCount,
  externalRating,
  externalReviewCount,
  externalSourceLabel,
}: AccommodationJsonLdProps) {
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name,
    description,
    url,
    ...(image && { image }),
    address: {
      "@type": "PostalAddress",
      addressLocality,
      addressRegion,
    },
    amenityFeature: amenities.slice(0, 10).map((a) => ({ "@type": "LocationFeatureSpecification", name: a })),
    maxOccupancy: maxGuests,
  };
  if (rating != null && reviewCount != null && reviewCount > 0) {
    (json as Record<string, unknown>).aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
    };
  }
  if (externalRating != null && externalReviewCount != null && externalReviewCount > 0) {
    (json as Record<string, unknown>).additionalProperty = {
      "@type": "PropertyValue",
      name: `Rating from ${externalSourceLabel || "external"}`,
      value: `${externalRating} from ${externalReviewCount} reviews`,
    };
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
