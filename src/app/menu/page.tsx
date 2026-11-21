import type { Metadata } from "next";
import MenuBrowser from "@/components/MenuBrowser";
import BottleMarquee from "@/components/BottleMarquee";
import { listMenu } from "@/lib/db";
import { SITE, toLd } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Menu: Bottle Service, Cocktails & Food in Kampala",
  description:
    "NOMAD Kampala menu: Martell, Hennessy, Don Julio and Johnnie Walker bottle service, cocktails, shots, beer and kitchen bites. Pre-order, ask for prices and reserve a table on WhatsApp.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const items = listMenu();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "NOMAD Kampala Menu",
    url: `${SITE.url}/menu`,
    inLanguage: "en",
    hasMenuSection: [
      { c: "bottle", n: "Bottle Service" }, { c: "drinks", n: "Cocktails & Drinks" }, { c: "kitchen", n: "Kitchen & Bites" },
    ].map((s) => ({
      "@type": "MenuSection",
      name: s.n,
      hasMenuItem: items.filter((i) => i.category === s.c).map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        description: i.description,
      })),
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toLd(ld) }} />
      <div className="page-title container">
        <span className="eyebrow">Bottles &amp; Menu</span>
        <h1>Pour. Share. Repeat.</h1>
        <p>Pick your bottles, cocktails and bites, then ask for prices and send your order on WhatsApp, or attach it to a table reservation.</p>
      </div>
      <BottleMarquee />
      <section className="block" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <MenuBrowser items={items} />
          <div className="spotlights">
            <figure><img src="/images/bottles/martell-xo-dark.png" alt="Martell XO cognac" loading="lazy" /><figcaption><b>Martell XO</b><span>The bottle for the big night</span></figcaption></figure>
            <figure><img src="/images/bottles/don-julio-reposado-cocktails.png" alt="Don Julio Reposado with cocktails" loading="lazy" /><figcaption><b>Don Julio</b><span>Tequila corner, served your way</span></figcaption></figure>
          </div>
          <p className="count-note" style={{ textAlign: "center", marginTop: "2.5rem" }}>
            Ask us for prices on WhatsApp. Availability confirmed on order. Please drink responsibly. 18+ only.
          </p>
        </div>
      </section>
    </>
  );
}
