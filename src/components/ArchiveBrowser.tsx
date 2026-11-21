"use client";
import { useEffect, useMemo, useState } from "react";

export type ArchiveItem = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  night: string | null;
  headline: string;
  details: string;
  country: string | null;
  intl: boolean;
  images: string[];
  alt: string;
};

export default function ArchiveBrowser({
  items, nights, initial = "all",
}: { items: ArchiveItem[]; nights: { slug: string; title: string }[]; initial?: string }) {
  const [filter, setFilter] = useState(initial);
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(
    () => items.filter((i) => filter === "all" || (filter === "international" ? i.intl : i.night === filter)),
    [items, filter]
  );
  // flat list of every poster in the current view, for the lightbox
  const flat = useMemo(
    () => list.flatMap((it) => it.images.map((src, k) => ({ src, alt: it.alt, caption: `${it.title} - ${it.dateLabel}`, key: `${it.slug}-${k}` }))),
    [list]
  );
  const startIndex = (slug: string) => {
    let n = 0;
    for (const it of list) { if (it.slug === slug) return n; n += it.images.length; }
    return 0;
  };

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % flat.length));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + flat.length) % flat.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat.length]);

  const chips = [
    { id: "all", label: "All nights" },
    { id: "international", label: "International artists" },
    ...nights.map((n) => ({ id: n.slug, label: n.title })),
  ];

  return (
    <>
      <div className="chips" role="tablist" aria-label="Filter the archive">
        {chips.map((c) => (
          <button key={c.id} className={filter === c.id ? "on" : ""} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>
      <p className="count-note">{list.length} {list.length === 1 ? "night" : "nights"}</p>
      <div className="archive-grid">
        {list.map((it) => (
          <article className="acard" key={it.slug}>
            <button className="aimg" onClick={() => setOpen(startIndex(it.slug))} aria-label={`View poster: ${it.title}, ${it.dateLabel}`}>
              <img src={it.images[0]} alt={it.alt} loading="lazy" />
              {it.images.length > 1 && <span className="count">{it.images.length} posters</span>}
            </button>
            <div className="abody">
              <span className="adate">{it.dateLabel}</span>
              <h3>{it.title}</h3>
              <p className="head">{it.headline}</p>
              {it.intl && <span className="intl-tag">International artist &middot; {it.country}</span>}
              <p className="det">{it.details}</p>
            </div>
          </article>
        ))}
      </div>
      {open !== null && flat[open] && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <figure onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <img src={flat[open].src} alt={flat[open].alt} />
            <figcaption style={{ color: "var(--muted)", marginTop: "0.8rem", fontSize: "0.85rem" }}>{flat[open].caption}</figcaption>
          </figure>
          <button className="x" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
          <button className="p" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + flat.length) % flat.length); }} aria-label="Previous">&lsaquo;</button>
          <button className="n" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % flat.length); }} aria-label="Next">&rsaquo;</button>
        </div>
      )}
    </>
  );
}
