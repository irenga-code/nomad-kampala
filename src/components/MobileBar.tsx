import Link from "next/link";
import { SITE, waLink } from "@/lib/site";

export default function MobileBar() {
  const wa = waLink("Hello NOMAD Kampala, I would like to reserve a table.");
  return (
    <div className="mobilebar">
      <a href={`tel:${SITE.phones[0]}`}>Call</a>
      <Link href="/menu">Menu</Link>
      <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <Link href="/reserve">Reserve</Link>
    </div>
  );
}
