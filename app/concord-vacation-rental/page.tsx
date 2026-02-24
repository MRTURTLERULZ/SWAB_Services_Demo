import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { isDemoMode, getDemoProperties } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Concord Vacation Rental | Waterfront & Historic Area",
  description: "Book a Concord (Concorde) vacation rental. Waterfront condos near Warner's Pond, Minute Man Park, Old North Bridge. Direct booking, best rates.",
};

export default async function ConcordVacationRentalPage() {
  const properties = isDemoMode
    ? getDemoProperties().filter((p) => p.city === "Concord")
    : await prisma.property.findMany({
        where: { city: "Concord" },
        include: { images: { take: 1 }, ratePlans: { take: 1 } },
      }).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Concord Vacation Rental: Waterfront & History</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Explore Concord and the surrounding Concorde area with a waterfront vacation rental. Our condos offer lake access, garden and lake views, and are steps from Minute Man National Historical Park, Old North Bridge, and Louisa May Alcott&apos;s Orchard House. Self check-in, fast WiFi, and fully equipped kitchens make for a comfortable stay.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Waterfront and Warner&apos;s Pond area</li>
        <li>Minute Man National Historical Park nearby</li>
        <li>Old North Bridge and Orchard House</li>
        <li>Self check-in, fast WiFi</li>
      </ul>
      <div className="space-y-4 mb-6">
        {properties.map((p) => (
          <div key={p.id} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
            <p className="text-muted-foreground mb-4">{p.maxGuests} guests · {p.bedrooms} bedrooms</p>
            <Link href={`/properties/${p.slug}`}>
              <Button>View property & book</Button>
            </Link>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground">
        <Link href="/properties" className="text-primary hover:underline">View all properties</Link> or <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
      </p>
    </div>
  );
}
