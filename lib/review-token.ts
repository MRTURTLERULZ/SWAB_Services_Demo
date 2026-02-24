import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.REVIEW_TOKEN_SECRET || "default-secret-change-in-production";

export function createReviewToken(bookingId: string): string {
  const payload = `${bookingId}.${Date.now()}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyReviewToken(token: string): { bookingId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [bookingId, _ts, sig] = decoded.split(".");
    if (!bookingId || !sig) return null;
    const payload = `${bookingId}.${_ts}`;
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (!timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))) return null;
    return { bookingId };
  } catch {
    return null;
  }
}
