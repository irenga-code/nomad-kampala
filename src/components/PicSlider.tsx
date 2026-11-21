"use client";
import { useEffect, useState } from "react";

export type Pic = { src: string; alt: string; pos?: string };

// Photos fade in one after another inside a single frame.
export default function PicSlider({ pics, ms = 4200 }: { pics: Pic[]; ms?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % pics.length), ms);
    return () => clearInterval(t);
  }, [pics.length, ms]);
  return (
    <div className="picslider">
      {pics.map((p, k) => (
        <img key={p.src} className={k === i ? "on" : ""} src={p.src} alt={p.alt} loading={k === 0 ? "eager" : "lazy"} style={{ objectPosition: p.pos || "center" }} />
      ))}
      <div className="ps-dots" aria-hidden>
        {pics.map((p, k) => <i key={p.src} className={k === i ? "on" : ""} />)}
      </div>
    </div>
  );
}
