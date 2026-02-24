import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

/**
 * Check if a date range is available for a property (no overlap with CONFIRMED bookings,
 * BlockedDateRange, or active HOLDs).
 */
export async function isAvailable(
  propertyId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const now = new Date();

  const [overlappingBooking, overlappingBlock] = await Promise.all([
    prisma.booking.findFirst({
      where: {
        propertyId,
        OR: [
          { status: "CONFIRMED" },
          { status: "HOLD", holdExpiresAt: { gt: now } },
        ],
        startDate: { lt: end },
        endDate: { gt: start },
      },
    }),
    prisma.blockedDateRange.findFirst({
      where: {
        propertyId,
        startDate: { lt: end },
        endDate: { gt: start },
      },
    }),
  ]);

  return !overlappingBooking && !overlappingBlock;
}

/**
 * Get all unavailable date ranges for a property (for calendar display).
 */
export async function getUnavailableRanges(
  propertyId: string,
  fromDate: Date,
  toDate: Date
): Promise<{ startDate: Date; endDate: Date }[]> {
  const now = new Date();
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        propertyId,
        OR: [
          { status: "CONFIRMED" },
          { status: "HOLD", holdExpiresAt: { gt: now } },
        ],
        startDate: { lt: toDate },
        endDate: { gt: fromDate },
      },
      select: { startDate: true, endDate: true },
    }),
    prisma.blockedDateRange.findMany({
      where: {
        propertyId,
        startDate: { lt: toDate },
        endDate: { gt: fromDate },
      },
      select: { startDate: true, endDate: true },
    }),
  ]);

  return [
    ...bookings.map((b) => ({ startDate: b.startDate, endDate: b.endDate })),
    ...blocks.map((b) => ({ startDate: b.startDate, endDate: b.endDate })),
  ];
}
