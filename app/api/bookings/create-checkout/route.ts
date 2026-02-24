import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addMinutes, parseISO, differenceInDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { isAvailable } from "@/lib/availability";
import { computeBookingTotals } from "@/lib/pricing";
import { createCheckoutSchema } from "@/lib/validations/booking";
import { isDemoMode } from "@/lib/demo-data";

const HOLD_MINUTES = 15;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export async function POST(request: Request) {
  if (isDemoMode) {
    return NextResponse.json(
      { error: "Booking is disabled in demo mode. Add DATABASE_URL and Stripe keys to enable." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const parsed = createCheckoutSchema.safeParse({
      ...body,
      guests: typeof body.guests === "string" ? Number(body.guests) : body.guests,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors?.checkIn?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { propertyId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone } = parsed.data;

    const startDate = parseISO(checkIn);
    const endDate = parseISO(checkOut);
    const nights = differenceInDays(endDate, startDate);

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { ratePlans: true, seasonalRates: true },
    });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const ratePlan = property.ratePlans[0];
    if (!ratePlan) {
      return NextResponse.json({ error: "Property has no rate plan" }, { status: 400 });
    }

    if (nights < property.minNights) {
      return NextResponse.json(
        { error: `Minimum stay is ${property.minNights} night(s)` },
        { status: 400 }
      );
    }
    if (guests > property.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${property.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    const available = await isAvailable(propertyId, startDate, endDate);
    if (!available) {
      return NextResponse.json({ error: "Selected dates are not available" }, { status: 400 });
    }

    const totals = computeBookingTotals(startDate, endDate, {
      ...ratePlan,
      seasonalRates: property.seasonalRates,
    });
    if (totals.nights === 0) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    const holdExpiresAt = addMinutes(new Date(), HOLD_MINUTES);

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        guestName,
        guestEmail,
        guestPhone: guestPhone ?? null,
        startDate,
        endDate,
        guests,
        status: "HOLD",
        holdExpiresAt,
        subtotal: totals.subtotal,
        cleaningFee: totals.cleaningFee,
        taxes: totals.taxes,
        total: totals.total,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/book/${property.slug}/confirmation?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/book/${property.slug}?cancelled=1`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: (ratePlan.currency || "usd").toLowerCase(),
          unit_amount: Math.round((totals.subtotal / totals.nights) * 100),
          product_data: {
            name: `${property.name} — ${nights} night(s)`,
            description: `${checkIn} to ${checkOut}`,
          },
        },
        quantity: totals.nights,
      },
      {
        price_data: {
          currency: (ratePlan.currency || "usd").toLowerCase(),
          unit_amount: Math.round(totals.cleaningFee * 100),
          product_data: { name: "Cleaning fee" },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: (ratePlan.currency || "usd").toLowerCase(),
          unit_amount: Math.round(totals.taxes * 100),
          product_data: { name: "Taxes & fees" },
        },
        quantity: 1,
      },
    ];

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { bookingId: booking.id },
      customer_email: guestEmail,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, bookingId: booking.id });
  } catch (e) {
    console.error("Create checkout error:", e);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
