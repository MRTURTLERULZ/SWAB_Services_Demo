import { differenceInDays, isWeekend } from "date-fns";
import type { RatePlan, SeasonalRate } from "@prisma/client";

type RatePlanRow = RatePlan & { seasonalRates?: SeasonalRate[] };

/**
 * Compute nightly rate for a given date (base, weekend override, or seasonal).
 */
function getNightlyRateForDate(
  date: Date,
  ratePlan: RatePlanRow
): number {
  const seasonal = ratePlan.seasonalRates?.find(
    (s) => date >= s.startDate && date <= s.endDate
  );
  if (seasonal) return Number(seasonal.nightlyRate);
  const weekend = ratePlan.weekendNightly != null && isWeekend(date);
  return Number(weekend ? ratePlan.weekendNightly : ratePlan.baseNightly);
}

/**
 * Compute subtotal (nights only), cleaning fee, taxes, and total.
 */
export function computeBookingTotals(
  startDate: Date,
  endDate: Date,
  ratePlan: RatePlanRow
): { subtotal: number; cleaningFee: number; taxes: number; total: number; nights: number } {
  const nights = differenceInDays(endDate, startDate);
  if (nights <= 0) {
    return { subtotal: 0, cleaningFee: 0, taxes: 0, total: 0, nights: 0 };
  }
  let subtotal = 0;
  const d = new Date(startDate);
  for (let i = 0; i < nights; i++) {
    subtotal += getNightlyRateForDate(d, ratePlan);
    d.setDate(d.getDate() + 1);
  }
  const cleaningFee = Number(ratePlan.cleaningFee);
  const taxRate = Number(ratePlan.taxRate);
  const taxes = (subtotal + cleaningFee) * taxRate;
  const total = subtotal + cleaningFee + taxes;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    cleaningFee: Math.round(cleaningFee * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    total: Math.round(total * 100) / 100,
    nights,
  };
}
