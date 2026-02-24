import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookPageClient } from "./book-page-client";
import { isDemoMode, getDemoPropertyBySlug } from "@/lib/demo-data";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = isDemoMode ? getDemoPropertyBySlug(slug) : await prisma.property.findUnique({ where: { slug } });
  if (!property) return { title: "Book" };
  return { title: `Book ${property.name}` };
}

export default async function BookPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { checkIn, checkOut, guests } = await searchParams;
  const property = isDemoMode
    ? getDemoPropertyBySlug(slug)
    : await prisma.property.findUnique({
        where: { slug },
        include: { ratePlans: { take: 1 }, images: { take: 1 } },
      });
  if (!property) notFound();
  const ratePlan = "ratePlans" in property ? property.ratePlans[0] : null;
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/properties/${slug}`} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
        ← Back to {property.name}
      </Link>
      <h1 className="text-2xl font-bold mb-6">Book your stay</h1>
      <BookPageClient
        propertyId={property.id}
        minNights={property.minNights}
        maxGuests={property.maxGuests}
        initialCheckIn={checkIn ?? undefined}
        initialCheckOut={checkOut ?? undefined}
        initialGuests={guests ? Number(guests) : undefined}
        ratePlan={
          ratePlan
            ? {
                baseNightly: Number(ratePlan.baseNightly),
                weekendNightly: ratePlan.weekendNightly ? Number(ratePlan.weekendNightly) : null,
                cleaningFee: Number(ratePlan.cleaningFee),
                taxRate: Number(ratePlan.taxRate),
                currency: ratePlan.currency,
              }
            : null
        }
      />
    </div>
  );
}
