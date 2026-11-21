"use client";
import { useEffect, useState } from "react";

export type Slide = { src: string; alt: string; pos?: string; portrait?: boolean };

// Full-bleed hero: photos cross-fade behind the copy one at a time, no zoom.
export default function HeroSlider({ slides, children }: { slides: Slide[]; children: React.ReactNode }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);
  return (
    <section className="hero">
      <div className="hero-slides" aria-hidden>
        {slides.map((s, k) => (
          <div className={`hslide${k === i ? " on" : ""}${s.portrait ? " portrait" : ""}`} key={s.src}>
            {s.portrait && <img className="bgfill" src={s.src} alt="" />}
            <img className="main" src={s.src} alt="" loading={k === 0 ? "eager" : "lazy"} style={{ objectPosition: s.pos || "center" }} />
          </div>
        ))}
      </div>
      <div className="hero-shade" aria-hidden />
      <div className="container">
        <div className="hero-copy">{children}</div>
      </div>
      <div className="hero-progress" role="tablist" aria-label="Hero photos">
        {slides.map((s, k) => (
          <button key={s.src} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}: ${s.alt}`} />
        ))}
      </div>
      <span className="sr-only">{slides[i].alt}</span>
    </section>
  );
}
