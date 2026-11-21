import Link from "next/link";
import { SITE } from "@/lib/site";
import InstagramIcon from "./InstagramIcon";
import { CartButton } from "./CartProvider";

export default function Header() {
  return (
    <header className="site">
      <div className="container">
        <Link href="/" aria-label="NOMAD Kampala home">
          <img src="/images/nomad-logo.png" alt="NOMAD Kampala logo" width={60} height={56} />
        </Link>
        <nav aria-label="Main">
          <ul>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/archive">Archive</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><a className="ig-link" href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="NOMAD Kampala on Instagram"><InstagramIcon /></a></li>
            <li className="hdr-tools"><CartButton /></li>
            <li><Link className="btn solid" href="/reserve">Reserve</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
