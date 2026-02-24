import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getPostSlugs } from "@/lib/blog";
import { isDemoMode, getDemoProperties } from "@/lib/demo-data";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let properties: { slug: string; updatedAt: Date }[] = [];
  if (isDemoMode) {
    properties = getDemoProperties().map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  } else {
    try {
      properties = await prisma.property.findMany({ select: { slug: true, updatedAt: true } });
    } catch {
      // no DB
    }
  }
  const blogSlugs = getPostSlugs();
  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  const landingPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/policies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/methuen-vacation-rental`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/concord-vacation-rental`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/boston-area-vacation-rental`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/game-room-rental-massachusetts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/warner-pond-waterfront-rentals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];
  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...landingPages, ...propertyUrls, ...blogUrls];
}
