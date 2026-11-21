import { NextResponse } from "next/server";
import { getDb, listEvents } from "@/lib/db";
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

    const db = getDb();
    const get = db.prepare("SELECT id,name FROM menu_items WHERE id=? AND available=1");
    const lines: { id: number; name: string; qty: number }[] = [];
    for (const [id, qty] of want) {
      const item = get.get(id) as { id: number; name: string } | undefined;
      if (!item) return bad("Some items are no longer available. Please refresh the menu.");
      lines.push({ ...item, qty });
    }
    const total = 0; // no prices on the site: customers ask on WhatsApp

    const run = db.transaction(() => {
      const summary = lines.map((l) => `${l.qty} x ${l.name}`).join(", ");
      const orderId = Number(
        db.prepare("INSERT INTO orders (name,phone,kind,date,guests,event_slug,notes,items,total) VALUES (?,?,?,?,?,?,?,?,?)")
          .run(name, phone, kind, kind === "table" ? date : null, kind === "table" ? guests : null, slug || null, notes || null, JSON.stringify(lines), total).lastInsertRowid
      );
      let reservationId: number | null = null;
      if (kind === "table") {
        reservationId = Number(
          db.prepare("INSERT INTO reservations (name,phone,email,event_slug,date,guests,notes) VALUES (?,?,?,?,?,?,?)")
            .run(name, phone, null, slug || null, date, guests, `Pre-order #${orderId}: ${summary}${notes ? ` | ${notes}` : ""}`.slice(0, 900)).lastInsertRowid
        );
        db.prepare("UPDATE orders SET reservation_id=? WHERE id=?").run(reservationId, orderId);
      }
      return { orderId, reservationId };
    });
    const { orderId, reservationId } = run();
    return NextResponse.json({ ok: true, id: orderId, reservationId }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return serverError(e);
  }
}
