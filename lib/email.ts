import { Resend } from "resend";
import type { Booking, Property } from "@prisma/client";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}
const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendBookingConfirmationEmail(
  booking: Booking & { property: Property }
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping confirmation email");
    return;
  }
  const checkIn = booking.startDate.toLocaleDateString();
  const checkOut = booking.endDate.toLocaleDateString();
  const total = Number(booking.total);
  const html = `
    <h1>Booking confirmed</h1>
    <p>Hi ${booking.guestName},</p>
    <p>Your stay at <strong>${booking.property.name}</strong> is confirmed.</p>
    <ul>
      <li>Check-in: ${checkIn}</li>
      <li>Check-out: ${checkOut}</li>
      <li>Guests: ${booking.guests}</li>
      <li>Total: $${total.toFixed(2)}</li>
    </ul>
    <p>Exact address and check-in instructions will be sent separately or are available in your account.</p>
    <p><a href="${appUrl}/properties/${booking.property.slug}">View property</a></p>
    <p>Thank you for booking with us!</p>
  `;
  await resend.emails.send({
    from: fromEmail,
    to: booking.guestEmail,
    subject: `Booking confirmed: ${booking.property.name}`,
    html,
  });
}

export async function sendInquiryReceivedToAdmin(
  inquiry: { name: string; email: string; message: string; propertyId: string | null }
): Promise<void> {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return;
  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New inquiry from ${inquiry.name}`,
    html: `<p>From: ${inquiry.name} &lt;${inquiry.email}&gt;</p><p>${inquiry.message.replace(/\n/g, "<br>")}</p>`,
  });
}

export async function sendInquiryAutoReply(email: string, name: string): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "We received your message",
    html: `<p>Hi ${name},</p><p>We've received your inquiry and will get back to you soon.</p>`,
  });
}

export async function sendReviewRequestEmail(
  email: string,
  guestName: string,
  propertyName: string,
  reviewLink: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `How was your stay at ${propertyName}?`,
    html: `<p>Hi ${guestName},</p><p>Thank you for staying at ${propertyName}. We'd love to hear your feedback.</p><p><a href="${reviewLink}">Leave a review</a></p>`,
  });
}
