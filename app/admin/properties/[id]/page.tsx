import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function AdminPropertyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, ratePlans: true },
  });
  if (!property) notFound();
  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">← Properties</Link>
      <h1 className="text-2xl font-bold mb-6">Edit: {property.name}</h1>
      <div className="space-y-4 max-w-2xl">
        <p><strong>Slug:</strong> {property.slug}</p>
        <p><strong>City:</strong> {property.city}, {property.state}</p>
        <p><strong>Guests:</strong> {property.maxGuests} · Beds: {property.beds} · Baths: {property.baths}</p>
        <p><strong>External rating:</strong> {property.externalRating ?? "—"} from {property.externalReviewCount ?? 0} reviews ({property.externalSourceLabel ?? "—"})</p>
        <p><strong>Featured:</strong> {property.featured ? "Yes" : "No"}</p>
        <Link href={`/properties/${property.slug}`} target="_blank" rel="noopener">
          <Button variant="outline">View public page</Button>
        </Link>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Full edit form (all fields, images, rate plan, external rating) can be added here. Data is editable via Prisma Studio or API.</p>
    </div>
  );
}
