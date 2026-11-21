import { NextResponse } from "next/server";
import { getMenuItem, listEvents } from "@/lib/db";
import { saveOrder } from "@/lib/storage";
import { bad, clean, limited, readJson, serverError, validDate, validPhone } from "@/lib/validate";

export async function POST(req: Request) {
  try {
    if (limited(req)) return bad("Too many requests. Please try again later.", 429);
    const b = await readJson(req);
    if (b instanceof NextResponse) return b;

    const name = clean(b.name, 80), phone = clean(b.phone, 25), notes = clean(b.notes, 500);
    const kind = b.kind === "table" ? "table" : "inquiry";
    const date = clean(b.date, 10), slug = clean(b.event_slug, 60);
    const guests = Math.round(Number(b.guests));

    if (name.length < 2 || !validPhone(phone)) return bad("Please enter your name and a valid phone number.");
    if (slug && !listEvents().some((e) => e.slug === slug)) return bad("Unknown night.");
    if (kind === "table") {
      if (!validDate(date)) return bad("Please choose a valid date for your table.");
      if (!Number.isInteger(guests) || guests < 1 || guests > 100) return bad("Guests must be between 1 and 100.");
    }

    // Validate shape, merge duplicate lines, cap sizes.
    if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 60) return bad("Your cart is empty.");
    const want = new Map<number, number>();
    for (const l of b.items as unknown[]) {
      if (!l || typeof l !== "object") return bad("Invalid cart.");
      const id = Number((l as { id: unknown }).id), qty = Math.round(Number((l as { qty: unknown }).qty));
      if (!Number.isInteger(id) || id < 1 || !Number.isInteger(qty) || qty < 1) return bad("Invalid cart.");
      want.set(id, Math.min(50, (want.get(id) ?? 0) + qty));
    }

    const lines: { id: number; name: string; qty: number }[] = [];
    for (const [id, qty] of want) {
      const item = getMenuItem(id);
      if (!item) return bad("Some items are no longer available. Please refresh the menu.");
      lines.push({ id: item.id, name: item.name, qty });
    }

    const { orderId, reservationId } = await saveOrder({
      name, phone, kind,
      date: kind === "table" ? date : null,
      guests: kind === "table" ? guests : null,
      event_slug: slug || null,
      notes: notes || null,
      items: lines,
    });
    return NextResponse.json({ ok: true, id: orderId, reservationId }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return serverError(e);
  }
}
