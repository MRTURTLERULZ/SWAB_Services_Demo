import type { Review } from "@prisma/client";
import { format } from "date-fns";

export function VerifiedReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground text-sm">No verified reviews yet. Be the first to leave one after your stay!</p>;
  }
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="border-b pb-4 last:border-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{r.reviewerName}</span>
            <span className="text-muted-foreground text-sm">{format(new Date(r.createdAt), "MMM d, yyyy")}</span>
            <span className="text-sm">★ {r.rating}/5</span>
          </div>
          {r.title && <p className="font-medium mt-1">{r.title}</p>}
          {r.body && <p className="text-sm text-muted-foreground mt-1">{r.body}</p>}
        </li>
      ))}
    </ul>
  );
}
