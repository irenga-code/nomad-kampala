import type { Metadata } from "next";
import { listGallery } from "@/lib/db";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photos from nights at NOMAD Kampala: live artists, bands, DJs, bottle service and the Kampala crowd.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  const items = listGallery();
  return (
    <>
      <div className="page-title container">
        <span className="eyebrow">Gallery</span>
        <h1>Inside NOMAD Kampala</h1>
      </div>
      <section className="block">
        <div className="container"><GalleryGrid items={items} /></div>
      </section>
    </>
  );
}
