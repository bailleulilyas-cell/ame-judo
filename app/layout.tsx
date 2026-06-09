import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Shippori_Mincho } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSocialLinks, getSettings } from "@/lib/data";
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

const SITE_URL = "https://ame-judo.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AME-JUDO — Club de Judo à Ermont (95) · Arts Martiaux Ermontois",
    template: "%s — AME-JUDO",
  },
  description:
    "Club de judo à Ermont (95), fondé en 1978. Cours pour enfants, ados et adultes — du baby-judo aux ceintures noires. Deux séances d'essai gratuites.",
  keywords: ["judo Ermont", "club judo 95", "judo Val d'Oise", "cours judo enfants", "baby judo Ermont", "AME-JUDO judo"],
  authors: [{ name: "AME-JUDO — Arts Martiaux Ermontois" }],
  creator: "AME-JUDO",
  publisher: "AME-JUDO",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AME-JUDO — Club de judo à Ermont",
    description: "Club de judo à Ermont depuis 1978. Enfants, ados, adultes.",
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "AME-JUDO — Arts Martiaux Ermontois",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "AME-JUDO — Arts Martiaux Ermontois" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AME-JUDO — Club de judo à Ermont",
    description: "Club de judo à Ermont depuis 1978. Enfants, ados, adultes.",
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
  name: "AME-JUDO — Arts Martiaux Ermontois",
  alternateName: "AME",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description:
    "Club de judo à Ermont (Val-d'Oise) depuis 1978. Cours enfants, ados et adultes, du baby-judo aux ceintures noires.",
  slogan: "Apprendre à saluer, à vaincre.",
  foundingDate: "1978",
  sport: "Judo",
  knowsAbout: ["Judo", "Baby judo", "Arts martiaux", "Self-défense", "Taïso"],
  priceRange: "€€",
  currenciesAccepted: "EUR",
  knowsLanguage: "fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Complexe Sportif Saint-Exupéry, Rue Kvot et Leydekkers",
    addressLocality: "Ermont",
    postalCode: "95120",
    addressRegion: "Val-d'Oise",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.9949,
    longitude: 2.2477,
  },
  hasMap: "https://www.google.com/maps?q=Complexe+Sportif+Saint-Exupéry+Ermont+95120",
  // Zone de recrutement réelle du club : Ermont et communes limitrophes du Val-d'Oise.
  areaServed: [
    { "@type": "City", name: "Ermont" },
    { "@type": "City", name: "Eaubonne" },
    { "@type": "City", name: "Sannois" },
    { "@type": "City", name: "Franconville" },
    { "@type": "City", name: "Saint-Leu-la-Forêt" },
    { "@type": "City", name: "Taverny" },
    { "@type": "City", name: "Montmorency" },
    { "@type": "City", name: "Le Plessis-Bouchard" },
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "17:00", closes: "20:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "11:00", closes: "13:00" },
  ],
  email: "amejudoermont@gmail.com",
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
