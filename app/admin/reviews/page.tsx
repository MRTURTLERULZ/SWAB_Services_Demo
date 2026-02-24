import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true, slug: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Property</th>
              <th className="text-left p-3">Reviewer</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3">Verified</th>
              <th className="text-left p-3">Featured</th>
              <th className="text-left p-3">Hidden</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">
                  <Link href={`/properties/${r.property.slug}`} className="text-primary hover:underline">{r.property.name}</Link>
                </td>
                <td className="p-3">{r.reviewerName}</td>
                <td className="p-3">{r.rating}/5</td>
                <td className="p-3">{r.verified ? "Yes" : "No"}</td>
                <td className="p-3">{r.featured ? "Yes" : "No"}</td>
                <td className="p-3">{r.hidden ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
