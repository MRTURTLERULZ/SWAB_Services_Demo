type Props = {
  rating: number | null;
  reviewCount: number | null;
  sourceLabel: string | null;
};

export function ExternalRatingSummary({ rating, reviewCount, sourceLabel }: Props) {
  if (rating == null && reviewCount == null) return null;
  const label = sourceLabel || "Reviews";
  const text =
    reviewCount != null && reviewCount > 0
      ? `Rated ${rating?.toFixed(1) ?? "—"} from ${reviewCount} reviews (${label})`
      : rating != null
        ? `Rated ${rating.toFixed(1)} (${label})`
        : null;
  if (!text) return null;
  return <p className="text-sm text-muted-foreground">{text}</p>;
}
