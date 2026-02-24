import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true, slug: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Property</th>
              <th className="text-left p-3">Message</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="p-3">{i.name}</td>
                <td className="p-3"><a href={`mailto:${i.email}`} className="text-primary hover:underline">{i.email}</a></td>
                <td className="p-3">{i.property ? <Link href={`/properties/${i.property.slug}`} className="text-primary hover:underline">{i.property.name}</Link> : "—"}</td>
                <td className="p-3 max-w-xs truncate">{i.message}</td>
                <td className="p-3 text-muted-foreground">{i.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
