import type { Metadata } from "next";
import { SITE, WA_DISPLAY, waLink } from "@/lib/site";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact & Location",
  description: "Find NOMAD Kampala night club opposite Shell on Bunga - Ggaba Road. Call or WhatsApp to reserve your table.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <div className="page-title container">
        <p className="eyebrow">Find us</p>
        <h1>Contact NOMAD Kampala</h1>
      </div>
      <section className="block">
        <div className="container split">
          <div>
            <h3>Location</h3>
            <p>{SITE.address}</p>
            <h3 style={{ marginTop: "1.5rem" }}>Reservations</h3>
            {SITE.phones.map((p, i) => (
              <p key={p}><a href={`tel:${p}`}>Call {SITE.phoneLabels[i]}</a></p>
            ))}
            <p style={{ marginTop: "0.6rem" }}>
              <a className="ig-link" href={waLink("Hello NOMAD Kampala, I would like some information.")} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> WhatsApp {WA_DISPLAY}
              </a>
            </p>
            <h3 style={{ marginTop: "1.5rem" }}>Follow us</h3>
            <p><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram {SITE.instagramHandle}</a></p>
          </div>
          <iframe
            title="NOMAD Kampala map"
            loading="lazy"
            style={{ width: "100%", height: 340, border: "1px solid var(--line)" }}
            src="https://www.google.com/maps?q=NOMAD+Kampala+Bunga+Ggaba+Road&output=embed"
          />
        </div>
      </section>
    </>
  );
}
