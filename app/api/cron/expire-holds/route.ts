import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron-friendly endpoint to expire HOLD bookings past holdExpiresAt.
 * Secure with CRON_SECRET or Vercel cron auth in production.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.booking.updateMany({
    where: {
      status: "HOLD",
      holdExpiresAt: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ expired: result.count });
}
