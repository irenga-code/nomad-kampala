import "server-only";

export interface OrderRecord {
  id?: string | number;
  [key: string]: unknown;
}

export interface ReservationRecord {
  id?: string | number;
  [key: string]: unknown;
}

const DB_NOT_CONFIGURED_MSG =
  "Database is not connected yet. Configure Supabase before saving or reading orders/reservations.";

export async function listOrders(): Promise<OrderRecord[]> {
  return [];
}

export async function createOrder(_input: unknown): Promise<never> {
  throw new Error(DB_NOT_CONFIGURED_MSG);
}

export async function listReservations(): Promise<ReservationRecord[]> {
  return [];
}

export async function createReservation(_input: unknown): Promise<never> {
  throw new Error(DB_NOT_CONFIGURED_MSG);
}
