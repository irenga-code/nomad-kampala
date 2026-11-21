import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { listEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: SITE.url, priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE.url}/events`, priority: 0.9, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE.url}/reserve`, priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE.url}/gallery`, priority: 0.7, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE.url}/menu`, priority: 0.9, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE.url}/archive`, priority: 0.7, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE.url}/contact`, priority: 0.8, changeFrequency: "yearly", lastModified: now },
  ];
  const events: MetadataRoute.Sitemap = listEvents().map((e) => ({
    url: `${SITE.url}/events/${e.slug}`, priority: 0.8, changeFrequency: "weekly", lastModified: now,
  }));
  return [...pages, ...events];
}
