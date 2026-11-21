import type { Metadata } from "next";
import Link from "next/link";
import { listEvents } from "@/lib/db";
import { todayName } from "@/lib/tonight";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Weekly Events & Parties in Kampala",
  description: "Tipsy Tuesday, Run The City, Swift Fridays, The After Dark and Sunday School: the weekly nights at NOMAD Kampala night club on Bunga - Ggaba Road.",
  alternates: { canonical: "/events" },
};

export default function Events() {
  const events = listEvents();
  const today = todayName();
  return (
    <>
      <div className="page-title container">
        <span className="eyebrow">What&apos;s on</span>
        <h1>Weekly Events at NOMAD Kampala</h1>
        <p>Something is always happening at NOMAD. Pick your night and reserve your table.</p>
      </div>
      <section className="block">
        <div className="container nights">
          {events.map((e) => (
            <Link href={`/events/${e.slug}`} className={`night${e.banner ? " banner" : ""}${e.day === today ? " today" : ""}`} key={e.slug}>
              <img src={e.image} alt={`${e.title} night at NOMAD Kampala`} loading="lazy" />
              <div className="body">
                <span className="day">{e.day}</span>
                <h3>{e.title}</h3>
                <p>{e.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
