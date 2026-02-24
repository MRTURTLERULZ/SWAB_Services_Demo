"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type RatePlan = {
  baseNightly: number;
  weekendNightly: number | null;
  cleaningFee: number;
  taxRate: number;
  currency: string;
};

type Props = {
  propertyId: string;
  minNights: number;
  maxGuests: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  ratePlan: RatePlan | null;
};

export function BookPageClient({
  propertyId,
  minNights,
  maxGuests,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  ratePlan,
}: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? "");
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? "");
  const [guests, setGuests] = useState(initialGuests ?? 1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut,
          guests,
          guestName,
          guestEmail,
          guestPhone: guestPhone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (data.url) {
        router.push(data.url);
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Your dates & guests</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check-in">Check-in</Label>
              <Input
                id="check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                required
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
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="guests">Guests</Label>
            <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
              <SelectTrigger id="guests">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Guest details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="guestName">Full name</Label>
            <Input id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="guestEmail">Email</Label>
            <Input id="guestEmail" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="guestPhone">Phone (optional)</Label>
            <Input id="guestPhone" type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {ratePlan && (
        <p className="text-sm text-muted-foreground">
          From ${ratePlan.baseNightly.toFixed(0)}/night · Min. {minNights} night{minNights !== 1 ? "s" : ""}. Final price and availability are confirmed on the next step.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating reservation…" : "Continue to payment"}
      </Button>
    </form>
  );
}
