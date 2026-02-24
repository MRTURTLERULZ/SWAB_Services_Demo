import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { isDemoMode, getDemoProperties } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Boston Area Vacation Rental | Methuen & Concord",
  description: "Vacation rentals near Boston: Methuen family home with game room, Concord waterfront condos. Direct booking, no extra fees.",
};

export default async function BostonAreaVacationRentalPage() {
  const properties = isDemoMode
    ? getDemoProperties()
    : await prisma.property.findMany({
        include: { images: { take: 1 }, ratePlans: { take: 1 } },
      }).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Boston Area Vacation Rentals</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Stay near Boston without the city price tag. Our vacation rentals in Methuen and Concord put you within easy reach of Boston, Salem, and New Hampshire. Book directly for the best rates—no middleman fees.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Methuen: family home with game room, near Boston & Salem</li>
        <li>Concord: waterfront condos on Warner&apos;s Pond</li>
        <li>Direct booking, transparent pricing</li>
      </ul>
      <div className="space-y-4 mb-6">
        {properties.map((p) => (
          <div key={p.id} className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
            <p className="text-muted-foreground mb-4">{p.city}, {p.state} · {p.maxGuests} guests</p>
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
