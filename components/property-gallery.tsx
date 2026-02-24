"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PropertyImage } from "@prisma/client";

export function PropertyGallery({ images, name }: { images: PropertyImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No images
      </div>
    );
  }

  const current = images[index];
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <Image
          src={current.url}
          alt={current.alt || name}
          fill
          className="object-cover cursor-pointer"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
          onClick={() => setLightboxOpen(true)}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        <button
          type="button"
          className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white"
          onClick={() => setLightboxOpen(true)}
        >
          View all ({images.length})
        </button>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={() => go(-1)}
                aria-label="Previous"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={() => go(1)}
                aria-label="Next"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <Image
              src={current.url}
              alt={current.alt || name}
              fill
              className="object-contain"
              sizes="90vw"
              onClick={() => setLightboxOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
