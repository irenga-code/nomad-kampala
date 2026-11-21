"use client";
import { useEffect, useState } from "react";

export type Photo = { id: number; src: string; alt: string };

export default function GalleryGrid({ items }: { items: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);
  return (
    <>
      <div className="gallery">
        {items.map((g, k) => (
          <button key={g.id} onClick={() => setOpen(k)} aria-label={`Open photo: ${g.alt}`}>
            <img src={g.src} alt={g.alt} loading="lazy" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <img src={items[open].src} alt={items[open].alt} onClick={(e) => e.stopPropagation()} />
          <button className="x" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
          <button className="p" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length); }} aria-label="Previous">&lsaquo;</button>
          <button className="n" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length); }} aria-label="Next">&rsaquo;</button>
        </div>
      )}
    </>
  );
}
