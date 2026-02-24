"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type RatePlanSummary = {
  baseNightly: number;
  weekendNightly: number | null;
  cleaningFee: number;
  taxRate: number;
  currency: string;
};

type Props = {
  slug: string;
  minNights: number;
  maxGuests: number;
  ratePlan: RatePlanSummary | null;
};

export function AvailabilityWidget({ slug, minNights, maxGuests, ratePlan }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-baseline justify-between">
          {ratePlan && (
            <span className="text-2xl font-semibold">
              ${ratePlan.baseNightly.toFixed(0)}
              <span className="text-base font-normal text-muted-foreground"> / night</span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="check-in">Check-in</Label>
            <Input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              aria-label="Check-in date"
            />
          </div>
          <div>
            <Label htmlFor="check-out">Check-out</Label>
            <Input
              id="check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().slice(0, 10)}
              aria-label="Check-out date"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
            <SelectTrigger id="guests" aria-label="Number of guests">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {guestOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} guest{n !== 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Min. {minNights} night{minNights !== 1 ? "s" : ""}. Availability is validated on the next step.
        </p>
        <Link
          href={{
            pathname: `/book/${slug}`,
            query: checkIn && checkOut ? { checkIn, checkOut, guests } : undefined,
          }}
          className="block"
        >
          <Button className="w-full">Reserve</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
