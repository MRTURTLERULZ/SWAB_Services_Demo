import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [propertiesCount, bookingsCount, inquiriesCount] = await Promise.all([
    prisma.property.count(),
    prisma.booking.count(),
    prisma.inquiry.count(),
  ]);
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true, slug: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Properties</p>
          <p className="text-2xl font-semibold">{propertiesCount}</p>
          <Link href="/admin/properties" className="text-sm text-primary hover:underline">Manage</Link>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Bookings</p>
          <p className="text-2xl font-semibold">{bookingsCount}</p>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Inquiries</p>
          <p className="text-2xl font-semibold">{inquiriesCount}</p>
          <Link href="/admin/inquiries" className="text-sm text-primary hover:underline">View all</Link>
        </div>
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent bookings</h2>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3">Guest</th>
                <th className="text-left p-3">Property</th>
                <th className="text-left p-3">Dates</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="p-3">{b.guestName}</td>
                  <td className="p-3">
                    <Link href={`/properties/${b.property.slug}`} className="text-primary hover:underline">
                      {b.property.name}
                    </Link>
                  </td>
                  <td className="p-3">{b.startDate.toLocaleDateString()} – {b.endDate.toLocaleDateString()}</td>
                  <td className="p-3">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
