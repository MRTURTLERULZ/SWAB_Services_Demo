import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { bookings: true } } },
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/admin/properties/new">
          <Button>Add property</Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Bookings</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.city}, {p.state}</td>
                <td className="p-3 text-muted-foreground">{p.slug}</td>
                <td className="p-3">{p._count.bookings}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/properties/${p.id}`} className="text-primary hover:underline mr-2">Edit</Link>
                  <Link href={`/properties/${p.slug}`} target="_blank" rel="noopener" className="text-muted-foreground hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
