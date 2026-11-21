import Link from "next/link";
import { SITE, WA_DISPLAY, waLink } from "@/lib/site";
import InstagramIcon from "./InstagramIcon";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="site">
      <div className="container">
        <div className="cols">
          <div>
            <img src="/images/nomad-logo.png" alt="NOMAD Kampala" />
            <p>Premium night club in Kampala, Uganda.</p>
          </div>
          <div>
            <h4>Visit</h4>
            <p>{SITE.address}</p>
          </div>
          <div>
            <h4>Reservations</h4>
            {SITE.phones.map((p, i) => (
              <p key={p}><a href={`tel:${p}`}>{SITE.phoneLabels[i]}</a></p>
            ))}
          </div>
          <div>
            <h4>Explore</h4>
            <p><Link href="/menu">Bottles &amp; Menu</Link></p>
            <p><Link href="/events">Weekly events</Link></p>
            <p><Link href="/gallery">Gallery</Link></p>
            <p><Link href="/archive">Archive</Link></p>
            <p><Link href="/reserve">Book a table</Link></p>
          </div>
          <div>
            <h4>Connect</h4>
            <a className="social" href={waLink("Hello NOMAD Kampala, I would like some information.")} target="_blank" rel="noopener noreferrer" aria-label={`Chat with us on WhatsApp ${WA_DISPLAY}`}>
              <WhatsAppIcon size={30} />
              <span><small>Chat on WhatsApp</small><b>{WA_DISPLAY}</b></span>
            </a>
            <a className="social" href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label={`NOMAD Kampala on Instagram ${SITE.instagramHandle}`}>
              <InstagramIcon size={30} />
              <span><small>Follow us on Instagram</small><b>{SITE.instagramHandle}</b></span>
            </a>
          </div>
        </div>
        <p className="small">&copy; {new Date().getFullYear()} NOMAD Kampala. All rights reserved. Please drink responsibly. 18+ only.</p>
      </div>
    </footer>
  );
}
