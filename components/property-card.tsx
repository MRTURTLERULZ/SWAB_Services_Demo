import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property, PropertyImage, RatePlan } from "@prisma/client";

export type PropertyWithRelations = Property & {
  images: PropertyImage[];
  ratePlans: RatePlan[];
};

export function PropertyCard({ property }: { property: PropertyWithRelations }) {
  const img = property.images[0];
  const ratePlan = property.ratePlans[0];
  const highlights = (property.highlights as string[]) || [];
  const topBadges = highlights.slice(0, 3);

  return (
    <Link href={`/properties/${property.slug}`} className="block group">
      <Card className="overflow-hidden h-full transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3] bg-muted">
          {img ? (
            <Image
              src={img.url}
              alt={img.alt || property.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {topBadges.map((h) => (
              <Badge key={h} variant="secondary" className="text-xs">
                {h}
              </Badge>
            ))}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2">{property.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {property.city}, {property.state} · {property.maxGuests} guests
          </p>
          {property.externalRating != null && (
            <p className="text-sm mt-1">
              Rated {property.externalRating} from {property.externalReviewCount ?? 0} reviews
              {property.externalSourceLabel ? ` (${property.externalSourceLabel})` : ""}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          {ratePlan && (
            <span className="font-medium">
              ${Number(ratePlan.baseNightly).toFixed(0)}
              <span className="text-muted-foreground font-normal text-sm"> / night</span>
            </span>
          )}
          <span className="text-sm text-primary font-medium">View details</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
