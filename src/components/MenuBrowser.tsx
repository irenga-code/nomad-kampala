"use client";
import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { waLink } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

export type Item = { id: number; slug: string; name: string; category: string; sub: string; description: string; image: string | null; tag: string | null };
const TABS = [
  { id: "all", label: "All" },
  { id: "bottle", label: "Bottle Service" },
  { id: "drinks", label: "Cocktails & Drinks" },
  { id: "kitchen", label: "Kitchen & Bites" },
];
const TITLES: Record<string, string> = { bottle: "Bottle Service", drinks: "Cocktails & Drinks", kitchen: "Kitchen & Bites" };

function Glyph({ cat }: { cat: string }) {
  if (cat === "kitchen")
    return <svg viewBox="0 0 24 24"><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.5-3 4-3 7h3v11" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="M5 4h14l-5.5 7v6h3M10.5 17v0M8 21h8M12 11v10" /><path d="M7.5 7.5h9" /></svg>;
}

function Card({ it }: { it: Item }) {
  const { lines, add, setQty } = useCart();
  const qty = lines.find((l) => l.id === it.id)?.qty ?? 0;
  const photo = it.image?.includes("/bottles/") && it.slug !== "jw-red-label" ? "shot" : it.image ? "photo" : "glyph";
  return (
    <article className="mcard">
      <div className={`mimg ${photo}`}>
        {it.image ? <img src={it.image} alt={`${it.name} at NOMAD Kampala`} loading="lazy" style={it.slug === "jw-red-label" ? { objectPosition: "80% 50%" } : undefined} /> : <Glyph cat={it.category} />}
        {it.tag && <span className="mtag">{it.tag}</span>}
      </div>
      <div className="mbody">
        <span className="msub">{it.sub}</span>
        <h3>{it.name}</h3>
        <p className="mdesc">{it.description}</p>
        <div className="mfoot">
          <a className="ask" href={waLink(`Hello NOMAD Kampala, what is the price of ${it.name}?`)} target="_blank" rel="noopener noreferrer" aria-label={`Ask the price of ${it.name} on WhatsApp`}><WhatsAppIcon size={18} /> Ask price</a>
          {qty === 0 ? (
            <button className="add" onClick={() => add({ id: it.id, name: it.name, image: it.image })} aria-label={`Add ${it.name} to order`}>Add</button>
          ) : (
            <div className="stepper" aria-label={`Quantity for ${it.name}`}>
              <button onClick={() => setQty(it.id, qty - 1)} aria-label="Less">&minus;</button>
              <span>{qty}</span>
              <button onClick={() => setQty(it.id, qty + 1)} aria-label="More">+</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MenuBrowser({ items }: { items: Item[] }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((i) => (tab === "all" || i.category === tab) && (!s || `${i.name} ${i.sub} ${i.description}`.toLowerCase().includes(s)));
  }, [items, tab, q]);
  const groups = tab === "all" ? (["bottle", "drinks", "kitchen"] as const).map((c) => ({ c, items: list.filter((i) => i.category === c) })).filter((g) => g.items.length) : [{ c: tab, items: list }];
  const counts = (id: string) => (id === "all" ? items.length : items.filter((i) => i.category === id).length);

  return (
    <>
      <div className="menubar">
        <div className="chips" role="tablist" aria-label="Menu categories">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>{t.label} <small>{counts(t.id)}</small></button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search the menu</span>
          <input type="search" placeholder="Search Martell, mojito, pizza..." value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {list.length === 0 && <p className="count-note" style={{ textAlign: "center", padding: "3rem 0" }}>Nothing matches &ldquo;{q}&rdquo;. Try another word.</p>}
      {groups.map((g) => (
        <section key={g.c} id={g.c} className="mgroup">
          {tab === "all" && <h2>{TITLES[g.c]}</h2>}
          <div className="mgrid">{g.items.map((it) => <Card key={it.id} it={it} />)}</div>
        </section>
      ))}
    </>
  );
}
