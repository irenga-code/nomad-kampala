import WhatsAppIcon from "./WhatsAppIcon";
import { waLink } from "@/lib/site";

// Floating "chat with us" button, bottom-right on every page.
export default function WhatsAppFab() {
  return (
    <a className="wafab" href={waLink("Hello NOMAD Kampala, I would like some information.")} target="_blank" rel="noopener noreferrer" aria-label="Chat with NOMAD Kampala on WhatsApp">
      <span className="wa-tip">Chat on WhatsApp</span>
      <WhatsAppIcon size={32} color="#fff" />
    </a>
  );
}
