import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendInquiryReceivedToAdmin, sendInquiryAutoReply } from "@/lib/email";
import { rateLimit, getClientKey } from "@/lib/rate-limit";
import { isDemoMode } from "@/lib/demo-data";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(10).max(10000),
  propertyId: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const key = `inquiry:${getClientKey(request)}`;
  const { success } = rateLimit(key);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, message, propertyId } = parsed.data;
    if (isDemoMode) {
      return NextResponse.json({ id: "demo-inquiry" });
    }
    const inquiry = await prisma.inquiry.create({
      data: { name, email, message, propertyId: propertyId || null },
    });
    try {
      await sendInquiryReceivedToAdmin({ name, email, message, propertyId: propertyId ?? null });
      await sendInquiryAutoReply(email, name);
    } catch (mailErr) {
      console.error("Inquiry email error:", mailErr);
    }
    return NextResponse.json({ id: inquiry.id });
  } catch (e) {
    console.error("Inquiry API error:", e);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
