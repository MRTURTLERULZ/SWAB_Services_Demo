import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { property: { select: { name: true, slug: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Guest</th>
              <th className="text-left p-3">Property</th>
              <th className="text-left p-3">Dates</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-3">{b.guestName}<br /><span className="text-muted-foreground text-xs">{b.guestEmail}</span></td>
                <td className="p-3">
                  <Link href={`/properties/${b.property.slug}`} className="text-primary hover:underline">{b.property.name}</Link>
                </td>
                <td className="p-3">{b.startDate.toLocaleDateString()} – {b.endDate.toLocaleDateString()}</td>
                <td className="p-3">${Number(b.total).toFixed(2)}</td>
                <td className="p-3">{b.status}</td>
                <td className="p-3 text-muted-foreground">{b.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
