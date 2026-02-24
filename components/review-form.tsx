"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
  reviewerName: z.string().min(1).max(200),
});

type FormData = z.infer<typeof schema>;

export function ReviewForm({ bookingId, propertyId }: { bookingId: string; propertyId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, bookingId, propertyId }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed");
      }
      setStatus("success");
      router.push("/");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Rating (1-5)</Label>
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex items-center gap-1">
              <input type="radio" value={n} {...register("rating", { valueAsNumber: true })} />
              {n}
            </label>
          ))}
        </div>
        {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
      </div>
      <div>
        <Label htmlFor="reviewerName">Your name</Label>
        <Input id="reviewerName" {...register("reviewerName")} className="mt-1" />
        {errors.reviewerName && <p className="text-sm text-destructive">{errors.reviewerName.message}</p>}
      </div>
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input id="title" {...register("title")} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="body">Review</Label>
        <Textarea id="body" rows={4} {...register("body")} className="mt-1" />
        {errors.body && <p className="text-sm text-destructive">{errors.body.message}</p>}
      </div>
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Submitting…" : "Submit review"}
      </Button>
      {status === "success" && <p className="text-sm text-green-600">Thank you! Your review has been submitted.</p>}
      {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
    </form>
  );
}
