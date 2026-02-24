import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { isDemoMode, getDemoPropertyBySlug } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Game Room Rental Massachusetts | Family Retreat Methuen",
  description: "Rent a vacation home with a game room in Massachusetts. Family Retreat Methuen features a dedicated game room, 3 bedrooms, near Boston and Salem.",
};

export default async function GameRoomRentalPage() {
  const property = isDemoMode
    ? getDemoPropertyBySlug("family-retreat-methuen-game-room")
    : await prisma.property.findFirst({
        where: { slug: "family-retreat-methuen-game-room" },
        include: { images: { take: 1 }, ratePlans: { take: 1 } },
      }).catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Game Room Rental in Massachusetts</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Looking for a Massachusetts vacation rental with a game room? Our Family Retreat in Methuen features a dedicated game room that guests love—perfect for families and groups. The home sleeps 6, has a full kitchen, laundry, and is in a safe, quiet neighborhood near Boston and Salem.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Dedicated game room</li>
        <li>3 bedrooms, 6 guests</li>
        <li>Full kitchen, laundry, WiFi</li>
        <li>Methuen, near Boston & Salem</li>
      </ul>
      {property && (
        <div className="rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
          <p className="text-muted-foreground mb-4">{property.maxGuests} guests · {property.bedrooms} bedrooms · Game room</p>
          <Link href={`/properties/${property.slug}`}>
            <Button>View property & book</Button>
          </Link>
        </div>
      )}
      <p className="text-muted-foreground">
        <Link href="/properties" className="text-primary hover:underline">View all properties</Link> or <Link href="/methuen-vacation-rental" className="text-primary hover:underline">Methuen vacation rental</Link>.
      </p>
    </div>
  );
}
