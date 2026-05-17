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

export const metadata: Metadata = {
  metadataBase: new URL("https://ame-judo.fr"),
  title: {
    default: "AME — Arts Martiaux Ermontois · Judo, Ju-jitsu, Taïso à Ermont",
    template: "%s — AME",
  },
  description:
    "Club de judo, ju-jitsu et taïso à Ermont (95). Fondé en 1978. Cours pour enfants et adultes, deux séances d'essai gratuites.",
  keywords: ["judo Ermont", "ju-jitsu", "taïso", "arts martiaux 95", "club judo", "AME"],
  openGraph: {
    title: "AME — Arts Martiaux Ermontois",
    description: "Club de judo, ju-jitsu et taïso à Ermont depuis 1978.",
    type: "website",
    locale: "fr_FR",
  },
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
      </body>
    </html>
  );
}
