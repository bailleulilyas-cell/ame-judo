import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AdhesionForm from "@/components/AdhesionForm";
import ScrollReveal from "@/components/ScrollReveal";
import { getFormules, getDocuments } from "@/lib/data";

const SITE_URL = "https://ame-judo.fr";

export const metadata: Metadata = {
  title: "Adhésion judo Ermont — Tarifs & pré-inscription",
  description:
    "Tarifs et pré-inscription au club de judo AME à Ermont (95) : baby-judo, enfants, ados, adultes. Deux séances d'essai gratuites.",
  alternates: { canonical: "/adhesion" },
};

// Slug pour ancrer un document dans l'URL
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function AdhesionPage() {
  const [formules, documents] = await Promise.all([getFormules(), getDocuments()]);

  // Construit la liste des liens à insérer dans le paragraphe contextuel
  const docAnchors = documents.map((d) => ({ ...d, anchor: `doc-${slugify(d.nom)}` }));

  // Données structurées : formules d'adhésion (tarifs réels) rattachées au club.
  const offerCatalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Formules d'adhésion — Judo AME Ermont",
    url: `${SITE_URL}/adhesion`,
    itemListElement: formules.map((f) => ({
      "@type": "Offer",
      name: `${f.nom} — judo ${f.tranche_age}`,
      description: f.italique,
      price: f.prix,
      priceCurrency: "EUR",
      category: "Adhésion annuelle",
      availability: "https://schema.org/InStock",
      offeredBy: { "@id": `${SITE_URL}/#organization` },
    })),
  };

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
            {docAnchors.length > 0 && (
              <p className="page-hero-sub" style={{ marginTop: 18 }}>
                Avant de venir au dojo, pensez à télécharger{" "}
                <a href="#documents-section" className="adhesion-inline-link">
                  les documents
                </a>
                {" "}— à compléter et apporter sur place.
              </p>
            )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <AdhesionForm formules={formules} />
          </div>
        </section>

        {/* ─── Documents à fournir ─── */}
        {docAnchors.length > 0 && (
          <ScrollReveal as="section" id="documents-section" className="section section--sand docs-section">
            <div className="container">
              <div className="section-header">
                <span className="section-header-dot" aria-hidden />
                <span className="section-header-num" lang="ja" aria-hidden>書</span>
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">書類 · Documents</span>
              </div>
              <h2 className="title-lg" style={{ marginBottom: 16 }}>
                Les documents<br />
                <em>à fournir</em>.
              </h2>
              <p className="lead" style={{ marginBottom: 48 }}>
                Téléchargez ces documents, remplissez-les, et apportez-les lors de votre venue
                au dojo. Tout est gratuit, et nous restons à votre disposition pour toute question.
              </p>

              <div className="docs-grid">
                {docAnchors.map((d, i) => {
                  const isPlaceholder = !d.url || d.url === "#";
                  return (
                    <a
                      key={d.id}
                      id={d.anchor}
                      href={isPlaceholder ? undefined : d.url}
                      target={isPlaceholder ? undefined : "_blank"}
                      rel={isPlaceholder ? undefined : "noopener noreferrer"}
                      className={`doc-card-v2${isPlaceholder ? " is-placeholder" : ""}`}
                      aria-disabled={isPlaceholder}
                    >
                      <div className="doc-card-v2-head">
                        <span className="doc-card-v2-num" aria-hidden>0{i + 1}</span>
                        <span className="doc-card-v2-kanji" lang="ja" aria-hidden>
                          {d.kanji || "・"}
                        </span>
                      </div>
                      <div className="doc-card-v2-body">
                        <h3 className="doc-card-v2-name">{d.nom}</h3>
                        {d.description && (
                          <p className="doc-card-v2-desc">{d.description}</p>
                        )}
                      </div>
                      <div className="doc-card-v2-cta">
                        {isPlaceholder ? (
                          <span>Bientôt disponible</span>
                        ) : (
                          <>
                            <span>Télécharger</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>

              <p style={{ marginTop: 32, fontSize: 14, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
                Une question sur un document ? <a href="/contact" style={{ borderBottom: "1px solid var(--hair-strong)", color: "var(--sumi)" }}>Contactez le bureau</a>.
              </p>
            </div>
          </ScrollReveal>
        )}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }}
      />
    </>
  );
}
