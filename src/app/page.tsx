import Link from "next/link";
import { listEvents, listGallery } from "@/lib/db";
import { nextEvent, todayName, tonightEvent } from "@/lib/tonight";
import { FAQ } from "@/lib/faq";
import { SITE, toLd } from "@/lib/site";
import HeroSlider from "@/components/HeroSlider";
import PicSlider from "@/components/PicSlider";
import GalleryStrip from "@/components/GalleryStrip";
import Reveal from "@/components/Reveal";
import BottleMarquee from "@/components/BottleMarquee";
import { dateLabel, listArchive } from "@/lib/db";

export const dynamic = "force-dynamic";

const BRANDS = ["Martell", "Johnnie Walker", "Don Julio 1942", "Live Bands", "Resident DJs", "VIP Tables", "Bottle Service", "Kampala Nights"];

export default function Home() {
  const events = listEvents();
  const gallery = listGallery();
  const tonight = tonightEvent(events);
  const next = nextEvent(events);
  const today = todayName();
  const archive = listArchive();
  const intl = archive.filter((a) => a.intl);
  const recent = archive.slice(0, 4);
  // Hero background: stage-light photos, one at a time (landscape only, so every photo fills the full background).
  const slides = [
    { src: "/images/hero/light-beams.jpg", alt: "Laser beams and purple spotlights inside NOMAD Kampala night club" },
    { src: "/images/hero/light-lasers.jpg", alt: "Blue and pink laser beams at NOMAD Kampala night club" },
    { src: "/images/hero/light-projectors.jpg", alt: "Stage spotlights glowing through haze" },
    { src: "/images/hero/light-stage.jpg", alt: "Smoke and spotlights on the NOMAD stage" },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toLd(faqLd) }} />

      <HeroSlider slides={slides}>
        <span className="badge">
          <i />
          {tonight ? `Tonight: ${tonight.title}` : `Next: ${next.title}`}
        </span>
        <h1>
          Kampala&apos;s <em>finest</em> night club
        </h1>
        <p className="lead">
          Bass up, bottles out. Live artists, resident DJs and VIP bottle service on Bunga - Ggaba Road. Reserve your table and pre-order your bottles.
        </p>
        <div className="cta">
          <Link className="btn solid" href="/reserve">Reserve a table</Link>
          <Link className="btn" href="/menu">Bottles &amp; menu</Link>
          <Link className="btn" href="/events">Weekly events</Link>
        </div>
        <div className="hero-meta">
          <div><b>{events.length}</b><span>Nights a week</span></div>
          <div><b>Live</b><span>Artists &amp; bands</span></div>
          <div><b>VIP</b><span>Bottle service</span></div>
        </div>
      </HeroSlider>

      <div className="marquee" aria-hidden>
        <div className="track">
          {[...BRANDS, ...BRANDS].map((b, i) => <span key={i}>{b}</span>)}
        </div>
      </div>

      <section className="block">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Every week</span>
              <h2>Pick your night at NOMAD</h2>
              <p>{events.length} nights, {events.length} moods. Tap a night to see the details and book your table.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="nights">
              {events.map((e) => (
                <Link href={`/events/${e.slug}`} className={`night${e.banner ? " banner" : ""}${e.day === today ? " today" : ""}`} key={e.slug}>
                                    <img src={e.image} alt={`${e.title} at NOMAD Kampala night club`} loading="lazy" />
                  <div className="body">
                    <span className="day">{e.day}</span>
                    <h3>{e.title}</h3>
                    <p>{e.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block ring-section">
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow">Bottles &amp; Menu</span>
              <h2>Bottles out. Bass up.</h2>
              <p>Martell, Hennessy, Don Julio and more, plus cocktails and hot bites from our kitchen. Build your order and ask for prices on WhatsApp.</p>
            </div>
          </Reveal>
          <BottleMarquee />
          <p style={{ textAlign: "center", marginTop: "1rem" }}><Link className="btn solid" href="/menu">Open the menu</Link></p>
        </div>
      </section>

      <section className="block alt" id="international">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">International artists</span>
              <h2>The world comes to NOMAD</h2>
              <p>NOMAD Kampala hosts international artists alongside Uganda&apos;s best. Recent guests include Deobi from Nigeria, Eivin Cena from France, and DJ Sonia, Afrique and Chef Amandine from Rwanda.</p>
            </div>
          </Reveal>
        </div>
        <div className="intl-marquee" style={{ ["--n" as string]: intl.length }}>
          <div className="intl-track">
            {[0, 1].map((copy) =>
              intl.map((a) => (
                <Link href="/archive?filter=international" className="intl-card" key={`${copy}-${a.slug}`} aria-hidden={copy === 1 || undefined} tabIndex={copy === 1 ? -1 : undefined}>
                  <img src={a.images[0]} alt={copy === 1 ? "" : a.alt} loading="lazy" />
                  <div><span className="adate">{dateLabel(a.date)}</span><h3>{a.headline}</h3><span className="intl-tag">{a.country}</span></div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">The experience</span>
            <h2 style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)", lineHeight: 1.08, margin: "0.8rem 0 1.2rem", color: "var(--cream)" }}>
              Where Kampala comes to be seen
            </h2>
            <p>NOMAD is a premium night club on Bunga - Ggaba Road, opposite Shell. We bring together live bands, Uganda&apos;s leading artists and top DJs in a space made for big nights.</p>
            <div className="features">
              <div><b>Live music</b><span>Bands and artists on stage</span></div>
              <div><b>VIP tables</b><span>Reserve ahead, arrive to a ready table</span></div>
              <div><b>Premium bottles</b><span>Martell, Johnnie Walker, Don Julio</span></div>
              <div><b>Resident DJs</b><span>Music that keeps the floor full</span></div>
            </div>
            <Link className="btn solid" href="/reserve">Book your table</Link>
          </Reveal>
          <Reveal className="pic">
            <PicSlider pics={[
              { src: "/images/06-bottle-service-black-label.jpg", alt: "VIP bottle service at NOMAD Kampala" },
              { src: "/images/hero/light-sparklers.jpg", alt: "Sparkler bottle service celebration at NOMAD Kampala", pos: "center 60%" },
              { src: "/images/hero/light-confetti.jpg", alt: "Crowd and confetti on the dance floor at NOMAD Kampala", pos: "center 55%" },
            ]} />
          </Reveal>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow">Gallery</span>
              <h2>Inside our nights</h2>
            </div>
          </Reveal>
          <GalleryStrip items={gallery} />
          <p style={{ textAlign: "center", marginTop: "2rem" }}><Link className="btn" href="/gallery">See full gallery</Link></p>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow">Archive</span>
              <h2>What happened at NOMAD</h2>
            </div>
          </Reveal>
          <div className="archive-grid">
            {recent.map((a) => (
              <Link href="/archive" className="acard" key={a.slug}>
                <span className="aimg"><img src={a.images[0]} alt={a.alt} loading="lazy" /></span>
                <div className="abody"><span className="adate">{dateLabel(a.date)}</span><h3>{a.title}</h3></div>
              </Link>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem" }}><Link className="btn" href="/archive">Browse the archive</Link></p>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow">Good to know</span>
              <h2>Questions, answered</h2>
            </div>
            <div className="faq">
              {FAQ.map((f) => (
                <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block alt ig-band">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Instagram</span>
            <p className="big">{SITE.instagramHandle}</p>
            <p>Follow NOMAD Kampala for every line-up, poster and night.</p>
            <a className="btn" href={SITE.instagram} target="_blank" rel="noopener noreferrer">Follow on Instagram</a>
          </Reveal>
        </div>
      </section>

      <section className="block cta-band">
        <div className="container">
          <Reveal>
            <h2>Your table is waiting</h2>
            <p>Call or WhatsApp {SITE.phoneLabels.join(" / ")}</p>
            <Link className="btn solid" href="/reserve">Reserve online</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
