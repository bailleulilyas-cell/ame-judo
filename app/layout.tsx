import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Shippori_Mincho } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSocialLinks, getSettings } from "@/lib/data";
import { club } from "@/club.config";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#F5F1EA",
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

const SITE_URL = club.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: club.seo.titleDefault,
    template: club.seo.titleTemplate,
  },
  description: club.seo.description,
  keywords: [...club.seo.keywords],
  authors: [{ name: club.legalName }],
  creator: club.name,
  publisher: club.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: club.seo.ogTitle,
    description: club.seo.ogDescription,
    type: "website",
    locale: club.locale,
    url: SITE_URL,
    siteName: club.legalName,
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: club.legalName },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: club.seo.ogTitle,
    description: club.seo.ogDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

// JSON-LD — données structurées pour Google (SportsClub / LocalBusiness)
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": ["SportsClub", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: club.legalName,
  alternateName: club.alternateName,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: club.seo.descriptionOrg,
  slogan: club.slogan,
  foundingDate: club.foundingYear,
  sport: club.sport,
  knowsAbout: [...club.seo.knowsAbout],
  priceRange: club.seo.priceRange,
  currenciesAccepted: "EUR",
  knowsLanguage: "fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${club.address.venue}, ${club.address.street}`,
    addressLocality: club.address.locality,
    postalCode: club.address.postalCode,
    addressRegion: club.address.region,
    addressCountry: club.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: club.geo.latitude,
    longitude: club.geo.longitude,
  },
  hasMap: club.mapUrl,
  // Zone de recrutement réelle du club : ville + communes limitrophes.
  areaServed: club.seo.areaServed.map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: club.seo.openingHours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.dayOfWeek,
    opens: h.opens,
    closes: h.closes,
  })),
  email: club.email,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // sameAs : profils sociaux officiels du club (aide Google à relier le site aux réseaux).
  const [socials, settings] = await Promise.all([getSocialLinks(), getSettings()]);
  const organizationJsonLd = {
    ...ORGANIZATION_JSONLD,
    email: settings.email,
    ...(socials.length > 0 ? { sameAs: socials.map((s) => s.url) } : {}),
  };

  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${shippori.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Aller au contenu principal
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
