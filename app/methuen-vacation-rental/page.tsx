import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { isDemoMode, getDemoPropertyBySlug } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Methuen Vacation Rental | Family-Friendly Home with Game Room",
  description: "Book a Methuen vacation rental near Boston and Salem. Family-friendly home with game room, full kitchen, and quiet neighborhood. Direct booking, best rates.",
};

export default async function MethuenVacationRentalPage() {
  const property = isDemoMode
    ? getDemoPropertyBySlug("family-retreat-methuen-game-room")
    : await prisma.property.findFirst({
        where: { city: "Methuen", slug: "family-retreat-methuen-game-room" },
        include: { images: { take: 1 }, ratePlans: { take: 1 } },
      }).catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Methuen Vacation Rental: Family-Friendly Stay with Game Room</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Looking for a Methuen vacation rental that works for the whole family? Our entire home in Methuen offers a dedicated game room, full kitchen, on-site laundry, and a safe, quiet neighborhood—perfect for families. Located near Boston, Salem, and New Hampshire, it&apos;s an ideal base for exploring the region.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Game room for kids and adults</li>
        <li>Full kitchen and laundry</li>
        <li>Private driveway, free parking</li>
        <li>Dedicated workspace and fast WiFi</li>
        <li>Near Boston, Salem, and NH</li>
      </ul>
      {property && (
        <div className="rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
          <p className="text-muted-foreground mb-4">{property.maxGuests} guests · {property.bedrooms} bedrooms · {property.baths} bath</p>
          <Link href={`/properties/${property.slug}`}>
            <Button>View property & book</Button>
          </Link>
        </div>
      )}
      <p className="text-muted-foreground">
        <Link href="/properties" className="text-primary hover:underline">View all properties</Link> or <Link href="/contact" className="text-primary hover:underline">contact us</Link> for questions.
      </p>
    </div>
  );
}
