import "server-only";
import { ARCHIVE } from "./archive-data";
import { GALLERY_FILES } from "./gallery-files";
import { MENU } from "./menu-data";

// Content is served from local data files (no database). Orders and reservations are NOT stored
// here yet: see lib/storage.ts (stub until Supabase is connected).

export type NightEvent = {
  id: number;
  slug: string;
  title: string;
  day: string;
  tagline: string;
  description: string;
  image: string;
  banner: number; // 1 = image is a finished poster/banner (title is already on it)
  sort: number;
};

export type ArchiveEntry = {
  id: number;
  slug: string;
  title: string;
  date: string;
  night: string | null;
  headline: string;
  details: string;
  country: string | null;
  intl: boolean;
  images: string[];
  alt: string;
};

export type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  event_slug: string | null;
  date: string;
  guests: number;
  notes: string | null;
  status: string;
  created_at: string;
};

const EVENT_ROWS: [string, string, string, string, string, string, number, number][] = [
    ["tipsy-tuesday", "Tipsy Tuesday", "Tuesday", "Start the week the Nomad way",
     "Live band energy, premium bottles and a crowd that refuses to wait for the weekend. Hosted by Roger Baros and Oscar Gadgets, with a live band and DJs on the decks.",
     "/images/05-live-band.jpg", 0, 1],
    ["run-the-city", "Run The City", "Thursday", "Artists live on the Kampala stage",
     "Live performances, bottle service and a packed dance floor every Thursday at NOMAD.",
     "/images/10-artist-green-jacket.jpg", 0, 2],
    ["swift-fridays", "Swift Fridays", "Friday", "Hosted by African Simba Events",
     "Swift Fridays, hosted by African Simba Events, brings top artists and DJs to NOMAD every Friday. Book your table and enjoy Martell Blue Swift.",
     "/images/banners/swift-fridays.jpg", 1, 3],
    ["the-after-dark", "The After Dark", "Saturday", "Just Between Friends presents",
     "The After Dark is NOMAD's Saturday late-night party, presented by Just Between Friends: top DJs, a full hype team and a packed floor.",
     "/images/banners/the-after-dark.jpg", 1, 4],
    ["sunday-school", "Sunday School", "Sunday", "Class is in session",
     "Close the weekend with premium cognac, tequila and the best vibes in Kampala. Hosted by Urban Ratibu.",
     "/images/07-don-julio-1942.jpg", 0, 5],
];

export const listEvents = (): NightEvent[] =>
  EVENT_ROWS.map(([slug, title, day, tagline, description, image, banner, sort], i) => ({
    id: i + 1, slug, title, day, tagline, description, image, banner, sort,
  })).sort((a, b) => a.sort - b.sort);

export const listGallery = (): { id: number; src: string; alt: string }[] =>
  GALLERY_FILES.map((f, i) => {
    const alt = f.replace(/^\d\d-/, "").replace(/\.jpg$/, "").replace(/-/g, " ");
    return { id: i + 1, src: `/images/${f}`, alt: `NOMAD Kampala night club - ${alt}` };
  });

export function listArchive(): ArchiveEntry[] {
  return ARCHIVE.map((e, i) => ({
    id: i + 1,
    slug: e.slug,
    title: e.title,
    date: e.date,
    night: e.night,
    headline: e.headline,
    details: e.details,
    country: e.country,
    images: [...e.images],
    intl: !!e.country,
    alt: `${e.title} poster, ${e.date}, NOMAD Kampala night club`,
  })).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
}

export type MenuItem = {
  id: number; slug: string; name: string; category: "bottle" | "drinks" | "kitchen"; sub: string;
  description: string; image: string | null; tag: string | null; available: number;
};

// Menu ids are the 1-based position in MENU (stable as long as items are only appended).
export const listMenu = (): MenuItem[] =>
  MENU.map((m, i) => ({
    id: i + 1, slug: m.slug, name: m.name, category: m.category, sub: m.sub,
    description: m.desc, image: m.image, tag: m.tag, available: 1,
  }));

export const getMenuItem = (id: number) => listMenu().find((m) => m.id === id);

export type OrderRow = {
  id: number; name: string; phone: string; kind: string; date: string | null; guests: number | null;
  event_slug: string | null; notes: string | null; items: string; total: number; reservation_id: number | null;
  status: string; created_at: string;
};

// Placeholders until Supabase is connected (nothing is persisted yet).
export const listOrders = (): OrderRow[] => [];
export const listReservations = (): Reservation[] => [];

export function dateLabel(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}
