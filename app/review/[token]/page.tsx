import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyReviewToken } from "@/lib/review-token";
import { ReviewForm } from "@/components/review-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;
  const decoded = verifyReviewToken(token);
  if (!decoded) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: decoded.bookingId },
    include: { property: true },
  });
  if (!booking || booking.status !== "CONFIRMED") notFound();

  const now = new Date();
  if (booking.endDate > now) notFound();

  const existing = await prisma.review.findFirst({
    where: { bookingId: booking.id },
  });
  if (existing) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-xl font-bold mb-4">Thank you</h1>
        <p className="text-muted-foreground">You have already submitted a review for this stay.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-xl font-bold mb-2">Leave a review</h1>
      <p className="text-muted-foreground mb-6">How was your stay at {booking.property.name}?</p>
      <ReviewForm bookingId={booking.id} propertyId={booking.propertyId} />
    </div>
  );
}
