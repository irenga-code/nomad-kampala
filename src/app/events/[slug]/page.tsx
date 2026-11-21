import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listEvents } from "@/lib/db";
import { SITE, toLd } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };
const find = (slug: string) => listEvents().find((e) => e.slug === slug);

export function generateMetadata({ params }: Props): Metadata {
  const e = find(params.slug);
  if (!e) return {};
  return {
    title: `${e.title} every ${e.day} at NOMAD Kampala`,
    description: `${e.title} at NOMAD Kampala night club, every ${e.day}. ${e.tagline}. Reserve your table on Bunga - Ggaba Road.`,
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { images: [e.image] },
  };
}

export default function EventPage({ params }: Props) {
  const e = find(params.slug);
  if (!e) notFound();
  const others = listEvents().filter((x) => x.slug !== e.slug);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${e.title} at NOMAD Kampala`,
    description: e.description,
    image: `${SITE.url}${e.image}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    eventSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1W",
      byDay: `https://schema.org/${e.day}`,
      scheduleTimezone: "Africa/Kampala",
    },
    location: {
      "@type": "NightClub",
      name: SITE.name,
      address: { "@type": "PostalAddress", streetAddress: "Bunga - Ggaba Road", addressLocality: "Kampala", addressCountry: "UG" },
    },
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toLd(ld) }} />
      <section className="block">
        <div className="container split">
          <div>
            <span className="eyebrow">Every {e.day}</span>
            <h1 style={{ fontSize: "clamp(2.4rem,6vw,4.4rem)", lineHeight: 1.02, margin: "0.8rem 0 1rem", color: "var(--cream)" }}>{e.title}</h1>
            <p style={{ fontSize: "1.15rem", color: "var(--gold2)" }}>{e.tagline}</p>
            <p>{e.description}</p>
            <p>Find us opposite Shell on Bunga - Ggaba Road, Kampala. Call or WhatsApp {SITE.phoneLabels.join(" / ")}.</p>
            <p style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link className="btn solid" href={`/reserve?event=${e.slug}`}>Reserve for {e.title}</Link>
              <Link className="btn" href="/events">All events</Link>
            </p>
          </div>
          <div className="pic"><img src={e.image} alt={`${e.title} night at NOMAD Kampala`} /></div>
        </div>
      </section>
      <section className="block alt">
        <div className="container">
          <div className="section-head"><span className="eyebrow">More nights</span><h2>Also at NOMAD</h2></div>
          <div className="nights">
            {others.map((o) => (
              <Link href={`/events/${o.slug}`} className={`night${o.banner ? " banner" : ""}`} key={o.slug}>
                <img src={o.image} alt={`${o.title} at NOMAD Kampala`} loading="lazy" />
                <div className="body"><span className="day">{o.day}</span><h3>{o.title}</h3><p>{o.tagline}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
