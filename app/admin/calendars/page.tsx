import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SyncButton } from "@/components/admin/sync-button";

export default async function AdminCalendarsPage() {
  const calendars = await prisma.externalCalendar.findMany({
    orderBy: { propertyId: "asc" },
    include: { property: { select: { id: true, name: true, slug: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">External calendars (iCal)</h1>
      <p className="text-muted-foreground text-sm mb-4">
        Add iCal URLs from Airbnb/VRBO to block dates. Use &quot;Sync now&quot; or run the daily cron.
      </p>
      <div className="rounded-md border mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Property</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Last synced</th>
              <th className="text-left p-3">Active</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {calendars.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">
                  <Link href={`/admin/properties/${c.property.id}`} className="text-primary hover:underline">{c.property.name}</Link>
                </td>
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.lastSyncedAt ? c.lastSyncedAt.toLocaleString() : "Never"}</td>
                <td className="p-3">{c.active ? "Yes" : "No"}</td>
                <td className="p-3 text-right">
                  <SyncButton calendarId={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        To add a new calendar, use the property edit page or POST /api/admin/calendars (propertyId, name, icalUrl).
      </p>
    </div>
  );
}
