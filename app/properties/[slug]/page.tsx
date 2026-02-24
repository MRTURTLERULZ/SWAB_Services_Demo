import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyGallery } from "@/components/property-gallery";
import { AvailabilityWidget } from "@/components/availability-widget";
import { ExternalRatingSummary } from "@/components/external-rating-summary";
import { VerifiedReviews } from "@/components/verified-reviews";
import { AccommodationJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { isDemoMode, getDemoPropertyBySlug } from "@/lib/demo-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let property = isDemoMode ? getDemoPropertyBySlug(slug) : null;
  if (!isDemoMode) {
    try {
      property = await prisma.property.findUnique({ where: { slug } });
    } catch {
      property = getDemoPropertyBySlug(slug);
    }
  }
  if (!property) return { title: "Property not found" };
  return {
    title: `${property.name} | Vacation Rental`,
    description: property.description.slice(0, 160),
    openGraph: { title: property.name, description: property.description.slice(0, 160) },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  let property: Awaited<ReturnType<typeof getDemoPropertyBySlug>> | null = null;
  if (isDemoMode) {
    property = getDemoPropertyBySlug(slug);
  } else {
    try {
      const dbProperty = await prisma.property.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          ratePlans: { take: 1 },
          reviews: { where: { verified: true, hidden: false }, orderBy: { createdAt: "desc" }, take: 20 },
        },
      });
      property = dbProperty as Awaited<ReturnType<typeof getDemoPropertyBySlug>> | null;
    } catch {
      property = getDemoPropertyBySlug(slug);
    }
  }

  if (!property) notFound();

  const ratePlan = "ratePlans" in property ? property.ratePlans[0] : null;
  const highlights = (property.highlights as string[]) || [];
  const amenities = (property.amenities as string[]) || [];
  const sleepingArrangement = (property.sleepingArrangement as { room: string; beds: string }[]) || [];

  const isConcord = property.city.toLowerCase() === "concord";
  const nearbyAttractions = isConcord
    ? [
        { name: "Minute Man National Historical Park", desc: "Historic battle sites and trails" },
        { name: "Old North Bridge", desc: "Iconic Revolutionary War site" },
        { name: "Louisa May Alcott's Orchard House", desc: "Author's home and museum" },
      ]
    : [
        { name: "Boston", desc: "Museums, dining, and attractions" },
        { name: "Salem", desc: "Historic witch trials and waterfront" },
        { name: "New Hampshire", desc: "Skiing, hiking, and lakes" },
      ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const propertyUrl = baseUrl ? `${baseUrl}/properties/${property.slug}` : "";
  const verifiedReviews = "reviews" in property ? property.reviews : [];
  const avgRating = verifiedReviews.length > 0
    ? verifiedReviews.reduce((s, r) => s + r.rating, 0) / verifiedReviews.length
    : null;

  return (
    <div className="min-h-screen">
      <AccommodationJsonLd
        name={property.name}
        description={property.description}
        url={propertyUrl}
        image={"images" in property ? property.images[0]?.url : undefined}
        addressLocality={property.city}
        addressRegion={property.state}
        maxGuests={property.maxGuests}
        amenities={amenities}
        rating={avgRating ?? undefined}
        reviewCount={verifiedReviews.length || undefined}
        externalRating={property.externalRating ?? undefined}
        externalReviewCount={property.externalReviewCount ?? undefined}
        externalSourceLabel={property.externalSourceLabel ?? undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl || "/" },
          { name: "Properties", url: `${baseUrl}/properties` },
          { name: property.name, url: propertyUrl },
        ]}
      />
      {/* Above the fold */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-2">
          {highlights.slice(0, 5).map((h) => (
            <Badge key={h} variant="secondary">
              {h}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{property.name}</h1>
        <p className="text-muted-foreground mt-1">
          {property.city}, {property.state} · {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.baths} bath
          {property.baths !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <ExternalRatingSummary
            rating={property.externalRating}
            reviewCount={property.externalReviewCount}
            sourceLabel={property.externalSourceLabel}
          />
          <Link href={`/book/${property.slug}`}>
            <Button className="mt-2">Check availability & book</Button>
          </Link>
        </div>
      </div>

      {/* Gallery */}
      <section className="container mx-auto px-4 mt-6">
        <PropertyGallery images={property.images} name={property.name} />
      </section>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Key facts */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Key facts</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>{property.maxGuests} guests</li>
              <li>{property.bedrooms} bedrooms</li>
              <li>{property.beds} beds</li>
              <li>{property.baths} bath{property.baths !== 1 ? "s" : ""}</li>
              {property.checkInTime && <li>Check-in: {property.checkInTime}</li>}
              {property.checkOutTime && <li>Check-out: {property.checkOutTime}</li>}
            </ul>
            {sleepingArrangement.length > 0 && (
              <ul className="mt-3 text-sm space-y-1">
                {sleepingArrangement.map((s) => (
                  <li key={s.room}>{s.room}: {s.beds}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold mb-3">About this place</h2>
            <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          {/* Nearby attractions */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Nearby attractions</h2>
            <ul className="space-y-2">
              {nearbyAttractions.map((a) => (
                <li key={a.name}>
                  <span className="font-medium">{a.name}</span>
                  <span className="text-muted-foreground text-sm"> — {a.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Approx map - no exact address shown */}
          {property.showApproxMap && property.approxLat != null && property.approxLng != null && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Approximate area: {property.city}, {property.state}. Exact address provided after booking.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${property.approxLat},${property.approxLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                View approximate area on map
              </a>
            </section>
          )}

          {/* Verified reviews + External summary */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Reviews</h2>
            <VerifiedReviews reviews={property.reviews} />
            <div className="mt-4">
              <ExternalRatingSummary
                rating={property.externalRating}
                reviewCount={property.externalReviewCount}
                sourceLabel={property.externalSourceLabel}
              />
            </div>
          </section>

          {/* Policies */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Policies</h2>
            {property.houseRules && (
              <div className="mb-3">
                <h3 className="font-medium text-sm">House rules</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{property.houseRules}</p>
              </div>
            )}
            {property.cancellationPolicy && (
              <div>
                <h3 className="font-medium text-sm">Cancellation</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{property.cancellationPolicy}</p>
              </div>
            )}
          </section>
        </div>

        {/* Sticky booking sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <AvailabilityWidget
              slug={property.slug}
              minNights={property.minNights}
              maxGuests={property.maxGuests}
              ratePlan={ratePlan ? {
                baseNightly: Number(ratePlan.baseNightly),
                weekendNightly: ratePlan.weekendNightly ? Number(ratePlan.weekendNightly) : null,
                cleaningFee: Number(ratePlan.cleaningFee),
                taxRate: Number(ratePlan.taxRate),
                currency: ratePlan.currency,
              } : null}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex justify-center z-10">
        <Link href={`/book/${property.slug}`} className="w-full max-w-md">
          <Button className="w-full">Check availability & book</Button>
        </Link>
      </div>
      <div className="lg:hidden h-20" aria-hidden />
    </div>
  );
}
