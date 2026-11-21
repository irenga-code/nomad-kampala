"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NIGHTS, waLink } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

export type CartLine = { id: number; name: string; image: string | null; qty: number };
type Ctx = {
  lines: CartLine[]; count: number; bump: number;
  add: (l: Omit<CartLine, "qty">) => void; setQty: (id: number, q: number) => void; clear: () => void;
  open: boolean; setOpen: (v: boolean) => void;
};
const C = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(C);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};
const KEY = "nomad-cart-v1";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) {
        setLines(raw.filter((l) => l && Number.isInteger(l.id) && typeof l.name === "string" && Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= 50
          && (l.image === null || (typeof l.image === "string" && l.image.startsWith("/images/"))))
          .slice(0, 60).map((l) => ({ id: l.id, name: String(l.name).slice(0, 120), image: l.image, qty: l.qty })));
      }
    } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines, ready]);

  const add = useCallback((l: Omit<CartLine, "qty">) => {
    setLines((cur) => cur.some((x) => x.id === l.id) ? cur.map((x) => x.id === l.id ? { ...x, qty: Math.min(50, x.qty + 1) } : x) : [...cur, { ...l, qty: 1 }]);
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback((id: number, q: number) => {
    setLines((cur) => q <= 0 ? cur.filter((x) => x.id !== id) : cur.map((x) => x.id === id ? { ...x, qty: Math.min(50, q) } : x));
  }, []);
  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const v = useMemo(() => ({ lines, count, bump, add, setQty, clear, open, setOpen }), [lines, count, bump, add, setQty, clear, open]);
  return <C.Provider value={v}>{children}</C.Provider>;
}

export function CartButton() {
  const { count, setOpen, bump } = useCart();
  return (
    <button className="cartbtn" onClick={() => { setOpen(true); }} aria-label={`Open your order, ${count} items`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
      <span key={bump} className={`cnt${count ? " has" : ""}`}>{count}</span>
    </button>
  );
}

export function CartFab() {
  const { count, setOpen, bump } = useCart();
  if (!count) return null;
  return (
    <button key={bump} className="cartfab" onClick={() => { setOpen(true); }}>
      <span>View my order</span><b>{count} {count === 1 ? "item" : "items"}</b>
    </button>
  );
}

type Done = { id: number; url: string; kind: string; sent: boolean };

export function CartDrawer() {
  const { lines, count, setQty, clear, open, setOpen } = useCart();
  const [mode, setMode] = useState<"table" | "inquiry">("table");
  const [f, setF] = useState({ name: "", phone: "", date: "", guests: "4", night: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const today = new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, setOpen]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  function message(id: number) {
    const night = NIGHTS.find((n) => n.slug === f.night)?.label;
    const head = mode === "table"
      ? `*Table reservation + pre-order*\nDate: ${f.date}\nGuests: ${f.guests}${night ? `\nNight: ${night}` : ""}`
      : `*Order inquiry*`;
    return [
      `Hello NOMAD Kampala! New order request #${id}`, "", head, `Name: ${f.name}`, `Phone: ${f.phone}`, "",
      "*Items*",
      ...lines.map((l) => `- ${l.qty} x ${l.name}`),
      ...(f.notes ? ["", `Notes: ${f.notes}`] : []),
      "", "Please send me the prices and confirm availability. Thank you!",
    ].join("\n");
  }

  async function submit(whatsapp: boolean) {
    setErr("");
    if (!f.name.trim() || !/^[+\d\s()-]{7,25}$/.test(f.phone.trim())) return setErr("Please enter your name and a valid phone number.");
    if (mode === "table" && !f.date) return setErr("Please choose a date for your table.");
    // open the tab right away so mobile browsers do not block it after the network call
    const w = whatsapp ? window.open("", "_blank") : null;
    if (w) w.opener = null; // detach opener before navigating to wa.me
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: mode, ...f, event_slug: f.night, guests: Number(f.guests), items: lines.map((l) => ({ id: l.id, qty: l.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) { w?.close(); return setErr(data.error || "Could not save your order. Please try again."); }
      const url = waLink(message(data.id));
      if (w) w.location.href = url;
      setDone({ id: data.id, url, kind: mode, sent: whatsapp });
      clear();
    } catch {
      w?.close(); setErr("Network problem. Please try again.");
    } finally { setBusy(false); }
  }

  if (!open) return null;
  return (
    <div className="drawer-wrap" onClick={() => setOpen(false)}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your order" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{done ? "Order received" : "Your order"}</h2>
          <button className="x" onClick={() => setOpen(false)} aria-label="Close">&times;</button>
        </header>

        {done ? (
          <div className="drawer-body done">
            <p className="big">Cheers, {f.name.split(" ")[0] || "friend"}!</p>
            <p>Your {done.kind === "table" ? "table reservation and pre-order" : "order inquiry"} <b>#{done.id}</b> is saved. Our team will confirm shortly.</p>
            <p><a className="btn solid" href={done.url} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={20} color="currentColor" /> {done.sent ? "Open WhatsApp again" : "Send it on WhatsApp too"}</a></p>
            <p><button className="btn" onClick={() => { setDone(null); setOpen(false); }}>Back to the menu</button></p>
          </div>
        ) : count === 0 ? (
          <div className="drawer-body empty"><p>Your order is empty.</p><p style={{ color: "var(--muted)" }}>Add bottles, cocktails or bites from the menu.</p></div>
        ) : (
          <>
            <div className="drawer-body">
              <ul className="lines">
                {lines.map((l) => (
                  <li key={l.id}>
                    <div className="lthumb">{l.image ? <img src={l.image} alt="" /> : <span>{l.name[0]}</span>}</div>
                    <div className="linfo"><b>{l.name}</b><span>Price on WhatsApp</span></div>
                    <div className="stepper" aria-label={`Quantity for ${l.name}`}>
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Less">&minus;</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="More">+</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="total"><span>Prices</span><b>Ask us on WhatsApp</b></div>

              <div className="modes" role="tablist">
                <button className={mode === "table" ? "on" : ""} onClick={() => setMode("table")}>Table reservation</button>
                <button className={mode === "inquiry" ? "on" : ""} onClick={() => setMode("inquiry")}>Order inquiry</button>
              </div>
              <p className="hint">{mode === "table" ? "Attach this order to a table booking. Your drinks will be ready when you arrive." : "Ask about availability and delivery or pickup. No table needed."}</p>

              <div className="fgrid">
                <label>Name<input value={f.name} onChange={set("name")} autoComplete="name" /></label>
                <label>Phone / WhatsApp<input value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="+256..." /></label>
                {mode === "table" && (
                  <>
                    <label>Date<input type="date" min={today} value={f.date} onChange={set("date")} /></label>
                    <label>Guests<input type="number" min={1} max={100} value={f.guests} onChange={set("guests")} /></label>
                    <label className="wide">Night (optional)
                      <select value={f.night} onChange={set("night")}>
                        <option value="">Any night</option>
                        {NIGHTS.map((n) => <option key={n.slug} value={n.slug}>{n.label}</option>)}
                      </select>
                    </label>
                  </>
                )}
                <label className="wide">Notes (optional)<textarea rows={2} value={f.notes} onChange={set("notes")} placeholder={mode === "table" ? "Birthday, VIP table, serve at 10pm..." : "Pickup or delivery, questions..."} /></label>
              </div>
              {err && <p className="err" role="alert">{err}</p>}
            </div>
            <footer>
              <button className="btn solid wa" disabled={busy} onClick={() => submit(true)}>{busy ? "Saving..." : <><WhatsAppIcon size={20} color="currentColor" /> Ask prices &amp; send order</>}</button>
              <button className="btn" disabled={busy} onClick={() => submit(false)}>Save pre-order only</button>
              <p className="fine">Our team replies on WhatsApp with prices and availability. Please drink responsibly. 18+.</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
