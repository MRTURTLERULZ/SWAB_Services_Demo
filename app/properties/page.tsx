import { prisma } from "@/lib/prisma";
import { PropertyCard, type PropertyWithRelations } from "@/components/property-card";
import { isDemoMode, getDemoProperties } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vacation Rentals | Boston Area, Concord, Methuen",
  description: "Browse our vacation rentals: family-friendly homes with game rooms, waterfront condos on Warner's Pond, and more. Book directly and save.",
};

export default async function PropertiesPage() {
  let properties: PropertyWithRelations[] = [];
  if (isDemoMode) {
    properties = getDemoProperties() as unknown as PropertyWithRelations[];
  } else {
    try {
      properties = await prisma.property.findMany({
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          ratePlans: { take: 1 },
        },
        orderBy: { featured: "desc" },
      });
    } catch (e) {
      console.error("PropertiesPage DB error:", e);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Our properties</h1>
      <p className="text-muted-foreground mb-8">
        Entire homes and condos in Methuen, Concord, and the Boston area. Book directly for the best rates.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
