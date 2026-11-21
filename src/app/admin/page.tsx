import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { listOrders, listReservations } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const itemsText = (s: string) => {
  try { return (JSON.parse(s) as { qty: number; name: string }[]).map((l) => `${l.qty} x ${l.name}`).join(", "); } catch { return "(unreadable)"; }
};

export default function Admin() {
  // Second gate: never rely on middleware alone.
  if (!isAdmin(headers().get("authorization"))) notFound();
  const rows = listReservations();
  const orders = listOrders();
  return (
    <section className="block">
      <div className="container">
        <h1>Reservations ({rows.length})</h1>
        <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
          <table className="admin">
            <thead><tr><th>#</th><th>Received</th><th>Name</th><th>Phone</th><th>Date</th><th>Guests</th><th>Night</th><th>Notes</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.created_at}</td><td>{r.name}</td>
                  <td><a href={`tel:${r.phone}`}>{r.phone}</a></td>
                  <td>{r.date}</td><td>{r.guests}</td><td>{r.event_slug ?? "-"}</td><td>{r.notes ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1 style={{ marginTop: "3rem" }}>Menu orders ({orders.length})</h1>
        <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
          <table className="admin">
            <thead><tr><th>#</th><th>Received</th><th>Type</th><th>Name</th><th>Phone</th><th>Date</th><th>Guests</th><th>Items</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td><td>{o.created_at}</td><td>{o.kind === "table" ? `Table (res #${o.reservation_id})` : "Inquiry"}</td><td>{o.name}</td>
                  <td><a href={`tel:${o.phone}`}>{o.phone}</a></td><td>{o.date ?? "-"}</td><td>{o.guests ?? "-"}</td>
                  <td>{itemsText(o.items)}{o.notes ? ` | ${o.notes}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
