import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const bodySchema = z.object({
  bookingId: z.string(),
  propertyId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
  reviewerName: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const key = `review:${getClientKey(request)}`;
  const { success } = rateLimit(key);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { bookingId, propertyId, rating, title, body: bodyText, reviewerName } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking || booking.propertyId !== propertyId || booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
    }
    if (booking.endDate > new Date()) {
      return NextResponse.json({ error: "Review can only be submitted after checkout" }, { status: 400 });
    }

    const existing = await prisma.review.findFirst({ where: { bookingId } });
    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
    }

    const sanitizedBody = bodyText?.replace(/<[^>]*>/g, "").slice(0, 2000) ?? null;

    await prisma.review.create({
      data: {
        propertyId,
        bookingId,
        rating,
        title: title ?? null,
        body: sanitizedBody,
        reviewerName,
        verified: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Review API error:", e);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
