"use client";
import { useEffect, useState } from "react";
import type { Photo } from "./GalleryGrid";

// Continuous, auto-scrolling strip of rounded photo cards (pauses on hover, tap/click opens a lightbox).
export default function GalleryStrip({ items }: { items: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = items.length;
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % n));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, n]);
  const card = (g: Photo, k: number, dup: boolean) => (
    <button className="gstrip-card" key={(dup ? "d" : "a") + g.id} onClick={() => setOpen(k)} aria-label={`Open photo: ${g.alt}`} tabIndex={dup ? -1 : 0} aria-hidden={dup}>
      <img src={g.src} alt={dup ? "" : g.alt} loading="lazy" />
    </button>
  );
  return (
    <>
      <div className="gstrip" style={{ ["--n" as string]: n }}>
        <div className="gstrip-track">
          {items.map((g, k) => card(g, k, false))}
          {items.map((g, k) => card(g, k, true))}
        </div>
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <img src={items[open].src} alt={items[open].alt} onClick={(e) => e.stopPropagation()} />
          <button className="x" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
          <button className="p" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + n) % n); }} aria-label="Previous">&lsaquo;</button>
          <button className="n" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % n); }} aria-label="Next">&rsaquo;</button>
        </div>
      )}
    </>
  );
}
