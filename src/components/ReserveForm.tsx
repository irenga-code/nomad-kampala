"use client";
import { waLink } from "@/lib/site";
import { useState } from "react";

type Ev = { slug: string; title: string; day: string };

export default function ReserveForm({ events, preselect }: { events: Ev[]; preselect?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [wa, setWa] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      const night = events.find((x) => x.slug === data.event_slug);
      const text = `Hello NOMAD Kampala, I would like to reserve a table. Name: ${data.name}. Date: ${data.date}. Guests: ${data.guests}.${night ? ` Night: ${night.title}.` : ""}`;
      setWa(waLink(text));
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div className="msg">
        Thank you! Your reservation request is in. Our team will contact you shortly to confirm your table.
        <p style={{ marginTop: "1rem" }}>
          <a className="btn solid" href={wa} target="_blank" rel="noopener noreferrer">Confirm faster on WhatsApp</a>
        </p>
      </div>
    );

  return (
    <form className="reserve" onSubmit={onSubmit}>
      <div className="row">
        <label>Full name<input name="name" required maxLength={80} /></label>
        <label>Phone / WhatsApp<input name="phone" type="tel" required maxLength={25} placeholder="+256..." /></label>
      </div>
      <div className="row">
        <label>Email (optional)<input name="email" type="email" maxLength={120} /></label>
        <label>Number of guests<input name="guests" type="number" min={1} max={100} defaultValue={4} required /></label>
      </div>
      <div className="row">
        <label>Date<input name="date" type="date" required /></label>
        <label>Night
          <select name="event_slug" defaultValue={preselect || ""}>
            <option value="">Any night</option>
            {events.map((ev) => <option key={ev.slug} value={ev.slug}>{ev.title} ({ev.day})</option>)}
          </select>
        </label>
      </div>
      <label>Notes (birthday, bottles, seating)<textarea name="notes" rows={3} maxLength={500} /></label>
      {state === "error" && <div className="msg">{error}</div>}
      <button className="btn solid" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Request reservation"}</button>
    </form>
  );
}
