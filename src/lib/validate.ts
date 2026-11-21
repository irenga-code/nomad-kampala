import { NextResponse } from "next/server";
import { PersistenceUnavailableError } from "@/lib/storage";

export const MAX_BODY = 8 * 1024; // 8 KB is plenty for a cart

export const bad = (error: string, status = 400) =>
  NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
export const serverError = (e: unknown) => {
  if (e instanceof PersistenceUnavailableError) {
    return bad("Online booking is being set up. Please contact us on WhatsApp to place your order or reserve a table.", 503);
  }
  console.error("[api]", e);
  return bad("Something went wrong. Please try again or contact us on WhatsApp.", 500);
};

export const clean = (v: unknown, max: number) =>
  String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);

export const validPhone = (p: string) => /^\+?[\d\s()-]{7,25}$/.test(p) && (p.match(/\d/g) ?? []).length >= 7;
export const validEmail = (e: string) => e.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export function validDate(d: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = new Date(`${d}T12:00:00Z`);
  if (Number.isNaN(t.getTime()) || t.toISOString().slice(0, 10) !== d) return false; // rejects 2026-99-99, 2026-02-31
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const max = new Date(today); max.setUTCFullYear(max.getUTCFullYear() + 1);
  return t.getTime() >= today.getTime() - 86_400_000 && t <= max;
}

// Reads and validates a small JSON object body; returns a Response on failure.
export async function readJson(req: Request): Promise<Record<string, unknown> | NextResponse> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json")) return bad("Unsupported content type", 415);
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin) {
    try { if (new URL(origin).host !== host) return bad("Forbidden", 403); } catch { return bad("Forbidden", 403); }
  }
  const text = await req.text();
  if (text.length > MAX_BODY) return bad("Request too large", 413);
  try {
    const v = JSON.parse(text);
    if (!v || typeof v !== "object" || Array.isArray(v)) return bad("Invalid request", 400);
    return v as Record<string, unknown>;
  } catch { return bad("Invalid request", 400); }
}

// Best-effort in-memory limiter (per server instance). Add Vercel Firewall rate limits for real protection.
const hits = new Map<string, number[]>();
export function limited(req: Request, max = 8, windowMs = 600_000) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}
