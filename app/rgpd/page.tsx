import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du club AME-JUDO — données collectées, finalité, durée de conservation et vos droits (RGPD).",
  alternates: { canonical: "/rgpd" },
  robots: { index: false },
};

function buildSections(email: string) {
  return [
    { titre: "Responsable du traitement", texte: `Le responsable du traitement des données est l'association AME-JUDO — Arts Martiaux Ermontois (loi 1901, RNA W951008210), représentée par son président, Thierry Bailleul. Contact : ${email}.` },
    { titre: "Données collectées", texte: "L'adhésion et le règlement de la licence se font en ligne via notre prestataire HelloAsso, qui recueille les informations nécessaires à votre inscription (identité, coordonnées, date de naissance) directement sur sa plateforme sécurisée. Le site ame-judo.fr ne collecte ni ne stocke lui-même de données d'inscription, et aucune donnée bancaire ne transite par le site." },
    { titre: "Finalité du traitement", texte: "Les données recueillies servent exclusivement à gérer votre adhésion au club et votre licence sportive, et à vous contacter au sujet de votre pratique." },
    { titre: "Sous-traitant", texte: "Le traitement des inscriptions et des paiements est assuré par HelloAsso, qui agit en qualité de sous-traitant et dispose de sa propre politique de confidentialité (helloasso.com/confidentialite)." },
    { titre: "Base légale", texte: "Le traitement repose sur l'exécution du contrat d'adhésion et sur votre consentement, exprimé au moment de votre inscription en ligne." },
    { titre: "Durée de conservation", texte: "Vos données sont conservées le temps de votre adhésion, puis pendant la durée imposée par nos obligations légales et comptables, avant d'être supprimées." },
    { titre: "Vos droits", texte: `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à ${email}.` },
    { titre: "Cookies", texte: "Ce site n'utilise pas de cookies à des fins publicitaires ou de tracking. Des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés." },
  ];
}

export default async function RGPD() {
  const { email } = await getSettings();
  const SECTIONS = buildSections(email);
  return (
    <>
      <Nav />
      <main id="main">
        <article className="container article">
          <Link href="/" className="article-back">← Accueil</Link>

          <h1 className="article-title">Politique de confidentialité</h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", marginBottom: 40, marginTop: -28 }}>
            Mise à jour : juin 2026
          </p>

          <div className="article-body">
            {SECTIONS.map(({ titre, texte }) => (
              <div key={titre}>
                <h2 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12, marginTop: 32, fontFamily: "var(--sans)", fontWeight: 500 }}>
                  {titre}
                </h2>
                <p>{texte}</p>
              </div>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
