import type { Metadata } from "next";
import ArchiveBrowser from "@/components/ArchiveBrowser";
import { dateLabel, listArchive, listEvents } from "@/lib/db";
import { SITE, toLd } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Archive: Past Nights & International Artists",
  description:
    "See what happened at NOMAD Kampala: posters and line-ups from Tipsy Tuesday, Swift Fridays, The After Dark, Sunday School and nights with international artists.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage({ searchParams }: { searchParams: { filter?: string } }) {
  const entries = listArchive();
  const nights = listEvents().map((e) => ({ slug: e.slug, title: e.title }));
  const items = entries.map((e) => ({ ...e, dateLabel: dateLabel(e.date) }));
  const valid = ["international", ...nights.map((n) => n.slug)];
  const initial = searchParams.filter && valid.includes(searchParams.filter) ? searchParams.filter : "all";

  const ld = {
    "@context": "https://schema.org",
    "@graph": entries.map((e) => ({
      "@type": "Event",
      name: `${e.title} at NOMAD Kampala`,
      description: `${e.headline}. ${e.details}`,
      startDate: e.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      image: e.images.map((s) => `${SITE.url}${s}`),
      location: {
        "@type": "NightClub",
        name: SITE.name,
        address: { "@type": "PostalAddress", streetAddress: "Bunga - Ggaba Road", addressLocality: "Kampala", addressCountry: "UG" },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toLd(ld) }} />
      <div className="page-title container">
        <span className="eyebrow">Archive</span>
        <h1>What happened at NOMAD</h1>
        <p>Posters and line-ups from our past nights, including the international artists who have played the NOMAD stage.</p>
      </div>
      <section className="block">
        <div className="container">
          <ArchiveBrowser items={items} nights={nights} initial={initial} />
          <p style={{ textAlign: "center", marginTop: "3rem", color: "var(--muted)" }}>More from every night on Instagram: <a style={{ color: "var(--gold)" }} href={SITE.instagram} target="_blank" rel="noopener noreferrer">{SITE.instagramHandle}</a></p>
        </div>
      </section>
    </>
  );
}
