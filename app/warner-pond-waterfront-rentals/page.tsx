import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { isDemoMode, getDemoProperties } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Warner's Pond Waterfront Rentals | Concord MA",
  description: "Waterfront rentals on Warner's Pond in Concord MA. Lake access, garden and lake views, self check-in. Direct booking.",
};

export default async function WarnerPondWaterfrontRentalsPage() {
  const properties = isDemoMode
    ? getDemoProperties().filter((p) => p.city === "Concord")
    : await prisma.property.findMany({
        where: { city: "Concord" },
        include: { images: { take: 1 }, ratePlans: { take: 1 } },
      }).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Warner&apos;s Pond Waterfront Rentals</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Stay on the water in Concord. Our Warner&apos;s Pond waterfront rentals offer lake access, garden and lake views, and a peaceful setting. Ideal for small groups and families—with fast WiFi, self check-in, and fully equipped kitchens.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Waterfront and lake access</li>
        <li>Garden and lake views</li>
        <li>Self check-in, parking</li>
        <li>Near Minute Man Park and Old North Bridge</li>
      </ul>
      <div className="space-y-4 mb-6">
        {properties.map((p) => (
          <div key={p.id} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
            <p className="text-muted-foreground mb-4">{p.maxGuests} guests · Waterfront</p>
            <Link href={`/properties/${p.slug}`}>
              <Button>View property & book</Button>
            </Link>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground">
        <Link href="/concord-vacation-rental" className="text-primary hover:underline">Concord vacation rental</Link> · <Link href="/properties" className="text-primary hover:underline">All properties</Link> · <Link href="/contact" className="text-primary hover:underline">Contact</Link>.
      </p>
    </div>
  );
}
