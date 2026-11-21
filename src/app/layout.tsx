import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import WhatsAppFab from "@/components/WhatsAppFab";
import CartProvider, { CartDrawer, CartFab } from "@/components/CartProvider";
import { SITE, toLd } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "NOMAD Kampala | Best Night Club in Kampala, Uganda",
    template: "%s | NOMAD Kampala Night Club",
  },
  description: SITE.description,
  keywords: [
    "night club in Kampala", "best night club Kampala", "Kampala nightlife",
    "night clubs in Uganda", "Bunga Ggaba Road night club", "VIP table reservation Kampala", "bottle service Kampala", "Martell Hennessy Kampala", "club menu Kampala",
    "live music Kampala", "NOMAD Kampala",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: SITE.name, locale: "en_UG", url: SITE.url,
    title: "NOMAD Kampala | Best Night Club in Kampala, Uganda",
    description: SITE.description,
    images: [{ url: "/images/10-artist-green-jacket.jpg", width: 609, height: 737, alt: "Live artist performing at NOMAD Kampala" }],
  },
  twitter: { card: "summary_large_image", title: "NOMAD Kampala Night Club", description: SITE.description },
  robots: { index: true, follow: true },
  icons: { icon: "/images/nomad-logo.png" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/images/nomad-logo.png`,
  description: SITE.description,
  telephone: SITE.phones[0],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bunga - Ggaba Road, opposite Shell",
    addressLocality: "Kampala",
    addressCountry: "UG",
  },
  sameAs: [SITE.instagram],
  areaServed: "Kampala, Uganda",
  priceRange: "$$",
  hasMenu: `${SITE.url}/menu`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toLd(jsonLd) }} />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBar />
          <CartFab />
          <WhatsAppFab />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
