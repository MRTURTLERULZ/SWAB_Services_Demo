import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncExternalCalendar } from "@/lib/ical-sync";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calendars = await prisma.externalCalendar.findMany({
    where: { active: true },
    select: { id: true },
  });
  const results: { id: string; eventsCount?: number; blocksCount?: number; error?: string }[] = [];
  for (const cal of calendars) {
    try {
      const r = await syncExternalCalendar(cal.id);
      results.push({ id: cal.id, eventsCount: r.eventsCount, blocksCount: r.blocksCount });
    } catch (e) {
      results.push({ id: cal.id, error: e instanceof Error ? e.message : "Unknown error" });
    }
  }
  return NextResponse.json({ synced: results.length, results });
}
