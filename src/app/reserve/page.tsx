import type { Metadata } from "next";
import ReserveForm from "@/components/ReserveForm";
import { listEvents } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reserve a Table - VIP Bottle Service",
  description: "Book a table at NOMAD Kampala night club. VIP and bottle service reservations for birthdays, celebrations and weekly nights.",
  alternates: { canonical: "/reserve" },
};

export default function Reserve({ searchParams }: { searchParams: { event?: string } }) {
  const events = listEvents().map(({ slug, title, day }) => ({ slug, title, day }));
  return (
    <>
      <div className="page-title container">
        <p className="eyebrow">Reservations</p>
        <h1>Reserve Your Table</h1>
        <p>Send your request and our team will confirm by phone or WhatsApp.</p>
      </div>
      <section className="block">
        <div className="container"><ReserveForm events={events} preselect={searchParams.event} /></div>
      </section>
    </>
  );
}
