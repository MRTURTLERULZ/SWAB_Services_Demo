import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyCard, type PropertyWithRelations } from "@/components/property-card";
import { isDemoMode, getDemoProperties } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let properties: PropertyWithRelations[] = [];
  if (isDemoMode) {
    properties = getDemoProperties(true).slice(0, 6) as unknown as PropertyWithRelations[];
  } else {
    try {
      properties = await prisma.property.findMany({
        where: { featured: true },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          ratePlans: { take: 1 },
        },
        take: 6,
      });
    } catch (e) {
      console.error("HomePage DB error:", e);
    }
  }

  return (
    <div>
      {isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-center text-sm text-amber-800 dark:text-amber-200">
          Demo mode — showing sample data. Add <code className="bg-amber-500/20 px-1 rounded">DATABASE_URL</code> to .env to connect your database.
        </div>
      )}
      <section className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Book your stay directly
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
            Skip the middleman. Save on fees and get the best rates on vacation rentals in the Boston area, Concord, and Methuen.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 mt-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View properties
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Our properties</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/properties" className="text-primary hover:underline font-medium">
            See all properties
          </Link>
        </div>
      </section>
    </div>
  );
}
