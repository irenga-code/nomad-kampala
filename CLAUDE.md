# NOMAD Kampala website

Premium night club website for NOMAD Kampala (Bunga - Ggaba Road, opposite Shell, Kampala, Uganda).
Goal: look professional and rank for searches like "night club in Kampala" / "night clubs in Uganda".

## Stack
Next.js 14 (App Router, TypeScript), NO database for now: `src/lib/db.ts` serves events, gallery, archive and menu from local data files; orders/reservations are stubs in `src/lib/storage.ts` (API returns 503 until Supabase is connected), plain CSS in `src/app/globals.css`.

## Images (IMPORTANT: where Claude Code finds the pictures)
- Cleaned, web-ready images: `public/images/` (served at `/images/<file>`). Use these only.
- Original Instagram screenshots (with arrows, dots, dates, event text): `originals/`. Do NOT use on the site.
- Logo (white, transparent PNG, extracted from the club's own artwork): `public/images/nomad-logo.png`. Never remove or alter it.
- Cleaning script: `tools/clean.py` (OpenCV). Re-run it if originals change.
- The gallery table is auto-filled from `public/images/NN-*.jpg`, so new numbered jpgs appear in the gallery after the DB row is added (delete `data/nomad.db` to reseed).

## Business facts (from the club's posters; verify with the client)
- Reservations: +256 778 522 316 / +256 748 653 547
- Address: Opposite Shell, Bunga - Ggaba Road
- Weekly nights seeded: Tipsy Tuesday, Run The City (Thursday is a guess), Just Between Saturday (2AM Concepts), Sunday School. Edit in `src/lib/db.ts` seed or the `events` table.
- Partner brands seen in photos: Martell, Johnnie Walker, Don Julio.

## SEO already in place
Per-page titles/descriptions/canonicals, Open Graph, `NightClub` JSON-LD in `layout.tsx`, `sitemap.xml`, `robots.txt`, descriptive alt text, keyword-rich headings.

## Design (v2)
Dark luxury theme (black, gold, cream) in `src/app/globals.css`. Home page: split hero with rotating photos and a live "Tonight / Next" badge (computed in Kampala time from the events table), brand marquee, nights grid, experience section, lightbox gallery, FAQ (with FAQPage schema), CTA band. Per-event pages at `/events/[slug]` with recurring `Event` schema. Fixed Call / WhatsApp / Reserve bar on mobile. Reference site studied by screenshot only: mezonoir.co.ug.

## Next steps
1. Set the real domain in `SITE_URL` (see `.env.example`), set `ADMIN_PASSWORD`; admin lives at `/admin` (HTTP Basic auth).
2. Replace seed text with the club's real descriptions, hours, and prices.
3. Add per-event pages and a dated upcoming-events list (use `Event` JSON-LD).
4. Add WhatsApp click-to-chat button and email/WhatsApp notification on new reservations.
5. Off-site SEO (matters most for ranking): Google Business Profile, Google Maps listing, Instagram link-back, listings on Kampala nightlife directories, reviews.
6. Deploy (Vercel will not keep SQLite files; use a VPS/Railway/Fly volume, or swap to Postgres/Supabase).

## Commands
`npm install` · `npm run dev` · `npm run build` · `npm start`


## Update (Nov 2026): 5 nights, Archive, international artists
- Weekly nights: Tue Tipsy Tuesday, Thu Run The City, Fri Swift Fridays (African Simba Events), Sat The After Dark (Just Between Friends), Sun Sunday School.
- Swift Fridays and The After Dark use finished poster banners (`public/images/banners/`, events.banner=1: title is on the artwork, so the card text is hidden).
- Archive: `/archive`, data in `src/lib/archive-data.ts`, posters in `public/images/archive/` (named YYYY-MM-DD-title.jpg; dates kept on posters, only Instagram UI removed). `country` set => shown as "International artist" (Eivin Cena, France; Afrique, Rwanda).
- To add a night: drop the cleaned poster in `public/images/archive/`, add an entry to ARCHIVE, nothing else needed (db.ts reads the file directly).
- Image cleaning scripts: `tools/uiclean.py` (removes Instagram arrows/dots/icons) and `tools/clean3.py` (job list with manual coordinates). Originals in `originals/batch2/`. Paths inside are absolute to the original machine: edit before reuse.

## Update (Nov 21 2026, batch 3)
- Hero is a full-bleed Ken Burns photo slideshow (`HeroSlider.tsx`, slides listed in `src/app/page.tsx`).
- Instagram: SITE.instagram in `src/lib/site.ts` (https://www.instagram.com/nomad_kampala/), linked in header, footer, contact, archive, home band, and JSON-LD sameAs.
- Batch 3 posters cleaned by `tools/clean4.py` (originals in `originals/batch3/`). International: Deobi (Nigeria), DJ Sonia and Chef Amandine (Rwanda), Eivin Cena (France), Afrique (Rwanda).
- VERCEL: the filesystem is read-only except /tmp, so the SQLite DB lives in /tmp there and reservations are NOT persistent. Move reservations to Vercel Postgres / Turso / Supabase before relying on them. The reserve form offers a WhatsApp confirm button as a fallback.

## Update (Nov 21 2026, Menu / Shop)
- `/menu`: Bottle Service, Cocktails & Drinks, Kitchen & Bites with tabs, search, UGX prices. Items live in `src/lib/menu-data.ts` (PRICES ARE ESTIMATES: confirm with NOMAD, no re-seed step; menu ids are list positions, so only append items).
- Cart: `components/CartProvider.tsx` (context, localStorage, drawer, floating bar). Checkout posts to `/api/orders`, which re-prices from the DB (never trusts client totals), saves to `orders`, and for "Table reservation" also inserts a row in `reservations`. WhatsApp link is built client-side with the itemised list.
- Admin (`/admin`) shows reservations and menu orders.
- Spinning bottles: `components/BottleRing.tsx` (pure CSS 3D ring) with transparent cutouts in `public/images/menu/` made by `tools/cutout.py`.

- Vercel: reservations/orders are in /tmp and not persistent. Move to a hosted DB (Supabase, Turso or Vercel Postgres) before relying on them.

## Update (Nov 21 2026, later): no prices, WhatsApp-first
- NO PRICES anywhere on the site. Each menu card has "Ask price" (opens WhatsApp for that item); the cart sends an itemised "please send prices" message.
- ONE WhatsApp number: WA_NUMBER in `src/lib/site.ts` (256778522316). Used by the floating bottom-right button (`WhatsAppFab`), menu, cart, reservation form, contact page, footer and mobile bar. Change it in that one place.
- Bottle ring replaced by a flat scrolling strip (`BottleMarquee.tsx`).

- Bottle strip and menu cards now use the club's ORIGINAL bottle pictures unchanged (`public/images/bottles/`), scrolling flat (`BottleMarquee.tsx`). The old cutout PNGs and `tools/cutout.py` are no longer used.
- Footer: 'Connect' block with green WhatsApp badge (clickable number → wa.me) and gradient Instagram icon (unique gradient id per instance).
- Hero background: 6 stage-light photos (public/images/hero), one at a time, 5.5s crossfade, NO zoom; portrait shots shown whole over blurred copy. 'Tonight' tag removed from event cards.
- Hero uses only full-cover landscape light photos (3). Home gallery = auto-advancing one-photo slider (GallerySlider, arrows/dots, pauses on hover) + 'See full gallery' button to /gallery grid.
- 'The experience' photo is a PicSlider: black-label photo, sparklers, confetti fade one after another.
- Home gallery ('Inside our nights') = endless auto-scrolling strip of rounded photo cards like africansimbaevents.com (GalleryStrip, pauses on hover, click opens lightbox) + 'See full gallery'.
- Sound feature removed entirely (no toggle, no sounds). Hero photos: lasers, beams, projectors, stage (landscape only).
- Menu: added Luc Belaire Luxe, Belaire Rare Rosé (Alcohol-Removed), Belaire Collection (5-bottle photo kept whole), Clase Azul Reposado (gift-box version removed); also in BottleMarquee.
- International artists cards = endless passing marquee (pauses on hover).

## Security hardening (applied)
- Next upgraded to 14.2.35; images.unoptimized (no next/image used); security headers + CSP in next.config.mjs (CSP allows google.com iframe for the contact map).
- /admin: middleware AND the page both call lib/admin-auth.ts (constant-time, no default username, password must be 12+ chars; set ADMIN_USER/ADMIN_PASSWORD in Vercel or admin returns 503).
- API routes use lib/validate.ts: JSON-only, same-origin, 8 KB cap, strict date/phone/slug checks, rate limit (best-effort, in memory), generic errors.
- JSON-LD escaped via toLd(); cart localStorage validated; window.open opener detached; db.ts is "server-only".
- STILL TODO: move the database off /tmp (Supabase/Turso/Vercel Postgres); add Vercel Firewall rate limits; `npm audit` still lists advisories for the whole Next 14 line (a move to a patched newer Next major is the long-term fix).
- CSP: 'unsafe-eval' and no upgrade-insecure-requests ONLY in dev (NODE_ENV!=production); without this, 'next dev' blocked hydration and all JS sliders froze.

- better-sqlite3 removed (Vercel native build). TODO: connect Supabase in src/lib/storage.ts (saveOrder/saveReservation) and db.ts (listOrders/listReservations); gallery photos are listed in src/lib/gallery-files.ts (add new numbered jpgs there).
