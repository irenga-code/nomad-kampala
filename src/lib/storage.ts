import "server-only";

// TEMPORARY STUBS: orders and reservations are not persisted until Supabase is connected.
// Replace the bodies of saveOrder / saveReservation (and listOrders / listReservations in db.ts)
// with Supabase calls; the API routes already validate everything and handle this error.

export class PersistenceUnavailableError extends Error {
  constructor() {
    super("Order and reservation storage is not connected yet.");
    this.name = "PersistenceUnavailableError";
  }
}

export type OrderLine = { id: number; name: string; qty: number };

export type NewReservation = {
  name: string; phone: string; email: string | null; event_slug: string | null;
  date: string; guests: number; notes: string | null;
};

export type NewOrder = {
  name: string; phone: string; kind: "table" | "inquiry"; date: string | null; guests: number | null;
  event_slug: string | null; notes: string | null; items: OrderLine[];
};

export async function saveReservation(_r: NewReservation): Promise<{ id: number }> {
  throw new PersistenceUnavailableError();
}

export async function saveOrder(_o: NewOrder): Promise<{ orderId: number; reservationId: number | null }> {
  throw new PersistenceUnavailableError();
}
