export const SITE = {
  name: "NOMAD Kampala",
  url: process.env.SITE_URL || "https://www.nomadkampala.com",
  phones: ["+256778522316", "+256748653547"],
  phoneLabels: ["+256 778 522 316", "+256 748 653 547"],
  instagram: "https://www.instagram.com/nomad_kampala/",
  instagramHandle: "@nomad_kampala",
  address: "Opposite Shell, Bunga - Ggaba Road, Kampala, Uganda",
  description:
    "NOMAD Kampala is a premium night club in Kampala, Uganda. Live bands, top artists, resident DJs, VIP bottle service and table reservations on Bunga - Ggaba Road.",
};

export const NIGHTS = [
  { slug: "tipsy-tuesday", label: "Tuesday: Tipsy Tuesday" },
  { slug: "run-the-city", label: "Thursday: Run The City" },
  { slug: "swift-fridays", label: "Friday: Swift Fridays" },
  { slug: "the-after-dark", label: "Saturday: The After Dark" },
  { slug: "sunday-school", label: "Sunday: Sunday School" },
];

// The ONE WhatsApp number used everywhere on the site (floating button, menu, cart, reservations).
export const WA_NUMBER = "256778522316";
export const WA_DISPLAY = "+256 778 522316";
export const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

// Safe JSON-LD: escape "<" so a string can never close the <script> tag.
export const toLd = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
