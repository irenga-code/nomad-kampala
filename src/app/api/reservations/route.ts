import { NextResponse } from "next/server";
import { listEvents } from "@/lib/db";
import { saveReservation } from "@/lib/storage";
import { bad, clean, limited, readJson, serverError, validDate, validEmail, validPhone } from "@/lib/validate";

export async function POST(req: Request) {
  try {
    if (limited(req)) return bad("Too many requests. Please try again later.", 429);
    const b = await readJson(req);
    if (b instanceof NextResponse) return b;

    const name = clean(b.name, 80), phone = clean(b.phone, 25), email = clean(b.email, 120);
    const date = clean(b.date, 10), notes = clean(b.notes, 500), slug = clean(b.event_slug, 60);
    const guests = Math.round(Number(b.guests));

    if (name.length < 2 || !validPhone(phone)) return bad("Please enter a valid name and phone number.");
    if (!validDate(date)) return bad("Please choose a valid date.");
    if (!Number.isInteger(guests) || guests < 1 || guests > 100) return bad("Guests must be between 1 and 100.");
    if (email && !validEmail(email)) return bad("Invalid email.");
    if (slug && !listEvents().some((e) => e.slug === slug)) return bad("Unknown night.");

    await saveReservation({ name, phone, email: email || null, event_slug: slug || null, date, guests, notes: notes || null });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return serverError(e);
  }
}
