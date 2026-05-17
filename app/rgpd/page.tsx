import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

const SECTIONS = [
  { titre: "Données collectées", texte: "Lors de votre pré-inscription, nous collectons : votre nom complet, votre adresse email et la date de naissance de la personne souhaitant pratiquer. Aucune donnée bancaire n'est collectée." },
  { titre: "Finalité du traitement", texte: "Ces données sont utilisées exclusivement pour vous contacter au sujet de votre demande de pré-inscription et organiser votre venue au dojo pour les séances d'essai." },
  { titre: "Base légale", texte: "Le traitement est fondé sur votre consentement (art. 6.1.a du RGPD), que vous exprimez en soumettant le formulaire." },
  { titre: "Durée de conservation", texte: "Vos données sont conservées pendant 1 saison sportive (environ 12 mois). À l'issue de cette période, elles sont supprimées." },
  { titre: "Vos droits", texte: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à amejudoermont@gmail.com." },
  { titre: "Cookies", texte: "Ce site n'utilise pas de cookies à des fins publicitaires ou de tracking. Des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés." },
];

export default function RGPD() {
  return (
    <>
      <Nav />
      <main id="main">
        <article className="container article">
          <Link href="/" className="article-back">← Accueil</Link>

          <h1 className="article-title">Politique de confidentialité</h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", marginBottom: 40, marginTop: -28 }}>
            Mise à jour : mai 2026
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
