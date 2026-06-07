import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du club de judo AME-JUDO (Ermont) — éditeur, hébergeur, propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <>
      <Nav />
      <main id="main">
        <article className="container article">
          <Link href="/" className="article-back">← Accueil</Link>

          <h1 className="article-title">Mentions légales</h1>

          <div className="article-body">
            <h2 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12, marginTop: 32, fontFamily: "var(--sans)", fontWeight: 500 }}>
              Éditeur du site
            </h2>
            <p>
              <strong>Association AME-JUDO — Arts Martiaux Ermontois</strong><br />
              Association loi du 1ᵉʳ juillet 1901<br />
              N° RNA : W951008210<br />
              Complexe Sportif Saint-Exupéry<br />
              Rue Kvot et Leydekkers, 95120 Ermont<br />
              <a href="mailto:amejudoermont@gmail.com" style={{ borderBottom: "1px solid var(--hair-strong)" }}>amejudoermont@gmail.com</a>
            </p>

            <h2 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12, marginTop: 32, fontFamily: "var(--sans)", fontWeight: 500 }}>
              Directeur de publication
            </h2>
            <p>Thierry Bailleul, Président de l&apos;association AME-JUDO.</p>

            <h2 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12, marginTop: 32, fontFamily: "var(--sans)", fontWeight: 500 }}>
              Hébergement
            </h2>
            <p>
              Vercel Inc.<br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723, États-Unis
            </p>

            <h2 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12, marginTop: 32, fontFamily: "var(--sans)", fontWeight: 500 }}>
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images, logo) sont la propriété exclusive
              de l&apos;association AME-JUDO. Toute reproduction ou diffusion sans autorisation est interdite.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
