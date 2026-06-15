import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";
import { club } from "@/club.config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du club de ${club.sport.toLowerCase()} ${club.name} (${club.city}) — éditeur, hébergeur, propriété intellectuelle.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default async function MentionsLegales() {
  const { email } = await getSettings();
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
              <strong>Association {club.legalName}</strong><br />
              {club.legal.associationType}<br />
              N° RNA : {club.legal.rna}<br />
              {club.address.venue}<br />
              {club.address.street}, {club.address.postalCode} {club.address.locality}<br />
              <a href={`mailto:${email}`} style={{ borderBottom: "1px solid var(--hair-strong)" }}>{email}</a>
            </p>

            <h2 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12, marginTop: 32, fontFamily: "var(--sans)", fontWeight: 500 }}>
              Directeur de publication
            </h2>
            <p>{club.legal.president}, Président de l&apos;association {club.name}.</p>

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
              de l&apos;association {club.name}. Toute reproduction ou diffusion sans autorisation est interdite.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
