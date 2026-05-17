import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Shippori_Mincho } from "next/font/google";
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
    default: "AME — Arts Martiaux Ermontois · Judo, Ju-jitsu, Taïso à Ermont",
    template: "%s — AME",
  },
  description:
    "Club de judo, ju-jitsu et taïso à Ermont (95). Fondé en 1978. Cours pour enfants et adultes, deux séances d'essai gratuites.",
  keywords: ["judo Ermont", "ju-jitsu Ermont", "taïso 95", "arts martiaux Ermont", "club judo Val d'Oise", "AME"],
  authors: [{ name: "AME — Arts Martiaux Ermontois" }],
  creator: "AME",
  publisher: "AME",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AME — Arts Martiaux Ermontois",
    description: "Club de judo, ju-jitsu et taïso à Ermont depuis 1978.",
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "AME — Arts Martiaux Ermontois",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "AME — Arts Martiaux Ermontois" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AME — Arts Martiaux Ermontois",
    description: "Club de judo, ju-jitsu et taïso à Ermont depuis 1978.",
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
  name: "AME — Arts Martiaux Ermontois",
  alternateName: "AME",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: "Club de judo, ju-jitsu et taïso à Ermont depuis 1978.",
  foundingDate: "1978",
  sport: ["Judo", "Ju-jitsu", "Taïso"],
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
  areaServed: { "@type": "City", name: "Ermont" },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "17:00", closes: "20:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "11:00", closes: "13:00" },
  ],
  email: "amejudoermont@gmail.com",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
      </body>
    </html>
  );
}
