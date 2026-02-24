import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminBlocksPage() {
  const blocks = await prisma.blockedDateRange.findMany({
    orderBy: [{ propertyId: "asc" }, { startDate: "asc" }],
    include: { property: { select: { id: true, name: true, slug: true } } },
  });
  const properties = await prisma.property.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blocked dates</h1>
      <p className="text-muted-foreground text-sm mb-4">Manual and iCal-blocked ranges. Add manual blocks per property from property edit or here (API).</p>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Property</th>
              <th className="text-left p-3">Start</th>
              <th className="text-left p-3">End</th>
              <th className="text-left p-3">Source</th>
              <th className="text-left p-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-3">
                  <Link href={`/admin/properties/${b.property.id}`} className="text-primary hover:underline">{b.property.name}</Link>
                </td>
                <td className="p-3">{b.startDate.toLocaleDateString()}</td>
                <td className="p-3">{b.endDate.toLocaleDateString()}</td>
                <td className="p-3">{b.source}</td>
                <td className="p-3 text-muted-foreground">{b.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Properties: {properties.map((p) => p.name).join(", ")}</p>
    </div>
  );
}
