import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AdhesionForm from "@/components/AdhesionForm";
import ScrollReveal from "@/components/ScrollReveal";
import { getFormules } from "@/lib/data";

export const metadata: Metadata = {
  title: "Adhésion — Pré-inscription",
  description: "Pré-inscrivez-vous au club AME en quelques instants. Deux séances d'essai gratuites.",
  alternates: { canonical: "/adhesion" },
};

export default async function AdhesionPage() {
  const formules = await getFormules();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>四</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">入門 · Adhésion</span>
            </div>
            <h1 className="page-hero-title">
              Pré-<em>inscription</em>.
            </h1>
            <p className="page-hero-sub">
              Choisissez votre formule et remplissez le formulaire — un membre du bureau vous recontactera dans les 48 heures.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <AdhesionForm formules={formules} />
          </div>
        </section>

        {/* ─── Documents à fournir ─────────────────────────────
            ⚠️ Liens à compléter — placer les PDF dans public/documents/
            puis remplacer les href="#" par /documents/nom-du-fichier.pdf
        */}
        <ScrollReveal as="section" className="section section--paper">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>書</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">書類 · Documents</span>
            </div>
            <h2 className="title-lg" style={{ marginBottom: 16 }}>
              Les documents <em>à fournir</em>.
            </h2>
            <p className="lead" style={{ marginBottom: 40 }}>
              Pour finaliser votre inscription, voici les documents nécessaires.
              Vous pouvez les télécharger ici, les remplir et les apporter au dojo.
            </p>

            <ul className="docs-list">
              <li>
                <a href="#" className="doc-card">
                  <span className="doc-kanji" lang="ja" aria-hidden>証</span>
                  <div className="doc-body">
                    <h3>Bulletin d&apos;adhésion</h3>
                    <p>Formulaire d&apos;inscription au club (saison 2026/2027).</p>
                  </div>
                  <span className="doc-cta">Télécharger</span>
                </a>
              </li>
              <li>
                <a href="#" className="doc-card">
                  <span className="doc-kanji" lang="ja" aria-hidden>医</span>
                  <div className="doc-body">
                    <h3>Certificat médical</h3>
                    <p>Modèle à faire compléter par votre médecin.</p>
                  </div>
                  <span className="doc-cta">Télécharger</span>
                </a>
              </li>
              <li>
                <a href="#" className="doc-card">
                  <span className="doc-kanji" lang="ja" aria-hidden>規</span>
                  <div className="doc-body">
                    <h3>Règlement intérieur</h3>
                    <p>Les règles de vie du dojo et du club.</p>
                  </div>
                  <span className="doc-cta">Télécharger</span>
                </a>
              </li>
              <li>
                <a href="#" className="doc-card">
                  <span className="doc-kanji" lang="ja" aria-hidden>親</span>
                  <div className="doc-body">
                    <h3>Autorisation parentale</h3>
                    <p>Pour les pratiquants mineurs.</p>
                  </div>
                  <span className="doc-cta">Télécharger</span>
                </a>
              </li>
            </ul>

            <p style={{ marginTop: 28, fontSize: 13, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
              Une question sur un document ? Contactez le bureau du club.
            </p>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
