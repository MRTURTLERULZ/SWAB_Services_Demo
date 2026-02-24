type ICalEvent = { uid: string; startDate: Date; endDate: Date; summary: string | null };

async function parseICalString(icalString: string): Promise<ICalEvent[]> {
  const ICAL = (await import("ical.js")).default;
  const jCal = ICAL.parse(icalString);
  const comp = new ICAL.Component(jCal[1]);
  const vevents = comp.getAllSubcomponents("vevent");
  const events: ICalEvent[] = [];
  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);
    const uid = event.uid;
    const startDate = event.startDate.toJSDate();
    const endDate = event.endDate.toJSDate();
    const summary = event.summary || null;
    events.push({ uid, startDate, endDate, summary });
  }
  return events;
}

export async function fetchAndParseICal(icalUrl: string): Promise<ICalEvent[]> {
  const res = await fetch(icalUrl);
  if (!res.ok) throw new Error(`Failed to fetch iCal: ${res.status}`);
  const text = await res.text();
  return await parseICalString(text);
}

export async function syncExternalCalendar(externalCalendarId: string): Promise<{ eventsCount: number; blocksCount: number }> {
  const prisma = (await import("@/lib/prisma")).prisma;
  const cal = await prisma.externalCalendar.findUnique({
    where: { id: externalCalendarId },
    include: { property: true },
  });
  if (!cal || !cal.active) throw new Error("Calendar not found or inactive");

  const events = await fetchAndParseICal(cal.icalUrl);

  const now = new Date();
  for (const e of events) {
    await prisma.externalEvent.upsert({
      where: {
        externalCalendarId_uid: { externalCalendarId, uid: e.uid },
      },
      create: {
        externalCalendarId,
        uid: e.uid,
        startDate: e.startDate,
        endDate: e.endDate,
        summary: e.summary,
      },
      update: {
        startDate: e.startDate,
        endDate: e.endDate,
        summary: e.summary,
      },
    });
  }

  await prisma.blockedDateRange.deleteMany({
    where: { propertyId: cal.propertyId, source: "ICAL", externalCalendarId },
  });

  let blocksCount = 0;
  for (const e of events) {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (end <= start) continue;
    await prisma.blockedDateRange.create({
      data: {
        propertyId: cal.propertyId,
        startDate: start,
        endDate: end,
        source: "ICAL",
        externalCalendarId,
        note: e.summary,
      },
    });
    blocksCount++;
  }

  await prisma.externalCalendar.update({
    where: { id: externalCalendarId },
    data: { lastSyncedAt: now },
  });

  return { eventsCount: events.length, blocksCount };
}
