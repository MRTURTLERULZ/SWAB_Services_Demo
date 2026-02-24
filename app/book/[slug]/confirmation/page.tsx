import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking confirmation",
  description: "Your booking has been confirmed.",
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { session_id } = await searchParams;

  const property = await prisma.property.findUnique({ where: { slug } }).catch(() => null);
  if (!property) notFound();

  type BookingRow = { guestName: string; startDate: Date; endDate: Date; total: { toString: () => string }; status: string };
  let booking: BookingRow | null = null;
  if (session_id) {
    const b = await prisma.booking.findFirst({
      where: { stripeSessionId: session_id, propertyId: property.id },
      select: { guestName: true, startDate: true, endDate: true, total: true, status: true },
    });
    if (b) booking = b as BookingRow;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Booking confirmation</h1>
      {booking && booking.status === "CONFIRMED" ? (
        <>
          <p className="text-muted-foreground mb-4">
            Thank you, {booking.guestName}. Your stay at {property.name} is confirmed.
          </p>
          <p className="text-sm text-muted-foreground">
            {booking.startDate.toLocaleDateString()} – {booking.endDate.toLocaleDateString()}
          </p>
          <p className="text-sm font-medium mt-2">Total: ${Number(booking.total).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-4">
            A confirmation email has been sent to you with check-in details and the exact address.
          </p>
        </>
      ) : session_id ? (
        <p className="text-muted-foreground">
          We&apos;re processing your payment. If you just completed payment, you&apos;ll receive a confirmation email shortly. If you have any questions, please contact us.
        </p>
      ) : (
        <p className="text-muted-foreground">
          No session information. If you completed a booking, check your email for confirmation.
        </p>
      )}
      <Link href={`/properties/${slug}`} className="mt-8 inline-block">
        <Button variant="outline">Back to property</Button>
      </Link>
    </div>
  );
}
