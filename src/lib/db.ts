import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { ARCHIVE } from "./archive-data";
import { MENU } from "./menu-data";

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

// Bump this to re-seed events, gallery and archive (reservations are never touched).
const SCHEMA_VERSION = 8;

let db: Database.Database | null = null;

export function getDb() {
  if (db) return db;
  // Vercel only allows writing to /tmp (not persistent between deployments or cold starts).
  const dir = process.env.VERCEL ? path.join("/tmp", "nomad-data") : path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  db = new Database(path.join(dir, "nomad.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      kind TEXT NOT NULL,
      date TEXT,
      guests INTEGER,
      event_slug TEXT,
      notes TEXT,
      items TEXT NOT NULL,
      total INTEGER NOT NULL,
      reservation_id INTEGER,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      event_slug TEXT,
      date TEXT NOT NULL,
      guests INTEGER NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  const row = db.prepare("SELECT value FROM meta WHERE key='schema'").get() as { value: string } | undefined;
  if (Number(row?.value ?? 0) < SCHEMA_VERSION) {
    db.exec(`
      DROP TABLE IF EXISTS events;
      DROP TABLE IF EXISTS gallery;
      DROP TABLE IF EXISTS archive;
      DROP TABLE IF EXISTS menu_items;
      CREATE TABLE menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sub TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        tag TEXT,
        available INTEGER NOT NULL DEFAULT 1,
        sort INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        day TEXT NOT NULL,
        tagline TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        banner INTEGER NOT NULL DEFAULT 0,
        sort INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        src TEXT UNIQUE NOT NULL,
        alt TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE archive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        night TEXT,
        headline TEXT NOT NULL,
        details TEXT NOT NULL,
        country TEXT,
        images TEXT NOT NULL
      );
    `);
    seed(db);
    db.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('schema',?)").run(String(SCHEMA_VERSION));
  }
  return db;
}

function seed(d: Database.Database) {
  const ins = d.prepare(
    "INSERT INTO events (slug,title,day,tagline,description,image,banner,sort) VALUES (?,?,?,?,?,?,?,?)"
  );
  const rows: [string, string, string, string, string, string, number, number][] = [
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
  for (const r of rows) ins.run(...r);

  const dir = path.join(process.cwd(), "public", "images");
  const files = fs.readdirSync(dir).filter((f) => /^\d\d-.*\.jpg$/.test(f)).sort();
  const g = d.prepare("INSERT INTO gallery (src,alt,sort) VALUES (?,?,?)");
  files.forEach((f, i) => {
    const alt = f.replace(/^\d\d-/, "").replace(/\.jpg$/, "").replace(/-/g, " ");
    g.run(`/images/${f}`, `NOMAD Kampala night club - ${alt}`, i);
  });

  const mi = d.prepare(
    "INSERT INTO menu_items (slug,name,category,sub,description,image,tag,sort) VALUES (?,?,?,?,?,?,?,?)"
  );
  MENU.forEach((m, i) => mi.run(m.slug, m.name, m.category, m.sub, m.desc, m.image, m.tag, i));

  const a = d.prepare(
    "INSERT INTO archive (slug,title,date,night,headline,details,country,images) VALUES (?,?,?,?,?,?,?,?)"
  );
  for (const e of ARCHIVE) {
    a.run(e.slug, e.title, e.date, e.night, e.headline, e.details, e.country, JSON.stringify(e.images));
  }
}

export const listEvents = () =>
  getDb().prepare("SELECT * FROM events ORDER BY sort").all() as NightEvent[];

export const listGallery = () =>
  getDb().prepare("SELECT * FROM gallery ORDER BY sort").all() as { id: number; src: string; alt: string }[];

export function listArchive(): ArchiveEntry[] {
  const rows = getDb().prepare("SELECT * FROM archive ORDER BY date DESC, id DESC").all() as Array<
    Omit<ArchiveEntry, "images" | "intl" | "alt"> & { images: string }
  >;
  return rows.map((r) => ({
    ...r,
    images: JSON.parse(r.images) as string[],
    intl: !!r.country,
    alt: `${r.title} poster, ${r.date}, NOMAD Kampala night club`,
  }));
}

export type MenuItem = {
  id: number; slug: string; name: string; category: "bottle" | "drinks" | "kitchen"; sub: string;
  description: string; image: string | null; tag: string | null; available: number;
};
export const listMenu = () =>
  getDb().prepare("SELECT * FROM menu_items WHERE available=1 ORDER BY sort").all() as MenuItem[];

export type OrderRow = {
  id: number; name: string; phone: string; kind: string; date: string | null; guests: number | null;
  event_slug: string | null; notes: string | null; items: string; total: number; reservation_id: number | null;
  status: string; created_at: string;
};
export const listOrders = () =>
  getDb().prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 300").all() as OrderRow[];

export const listReservations = () =>
  getDb().prepare("SELECT * FROM reservations ORDER BY id DESC LIMIT 300").all() as Reservation[];

export function dateLabel(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}
