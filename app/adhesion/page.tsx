import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HelloAssoWidget from "@/components/HelloAssoWidget";
import ScrollReveal from "@/components/ScrollReveal";
import { getFormules, getDocuments } from "@/lib/data";

const SITE_URL = "https://ame-judo.fr";

// URL du bouton d'adhésion HelloAsso (campagne en cours).
// À mettre à jour chaque saison quand le club crée une nouvelle campagne.
const HELLOASSO_BUTTON_URL =
  "https://www.helloasso.com/associations/arts-martiaux-ermontois-judo/adhesions/adhesion-2026-2027-ame-judo/widget-bouton";

export const metadata: Metadata = {
  title: "Adhésion judo Ermont — Tarifs & inscription en ligne",
  description:
    "Tarifs et inscription en ligne au club de judo AME-JUDO à Ermont (95) : baby-judo, enfants, ados, adultes. Deux séances d'essai gratuites.",
  alternates: { canonical: "/adhesion" },
  openGraph: {
    title: "Adhésion & tarifs — AME-JUDO Ermont",
    description: "Tarifs et inscription en ligne au club de judo AME-JUDO à Ermont (95). Deux séances d'essai gratuites.",
    url: "/adhesion",
  },
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
    name: "Formules d'adhésion — Judo AME-JUDO Ermont",
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
              Adhésion <em>en ligne</em>.
            </h1>
            <p className="page-hero-sub">
              Adhérez et réglez votre licence en quelques minutes, en toute sécurité — paiement géré par HelloAsso.
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

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="premier-cours">
              <h2 className="premier-cours-title">Votre premier cours</h2>
              <ul className="premier-cours-grid">
                <li><strong>Dès 4 ans</strong><span>Baby-judo, enfants, ados et adultes — tous les niveaux.</span></li>
                <li><strong>2 séances d&apos;essai gratuites</strong><span>Sans engagement — venez essayer avant d&apos;adhérer.</span></li>
                <li><strong>En tenue de sport</strong><span>Pas besoin de kimono pour la première séance.</span></li>
                <li><strong>Sans rendez-vous</strong><span>Présentez-vous simplement à un créneau de votre âge.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <a
              className="ffjda"
              href="https://www.francejudo.fr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Site de France Judo (FFJDA) — nouvel onglet"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Image src="/ffjda.webp" alt="Club affilié à France Judo (FFJDA)" width={96} height={180} className="ffjda-logo" />
              <div>
                <h2 className="ffjda-title">Club affilié à France&nbsp;Judo (FFJDA)&nbsp;↗</h2>
                <p className="ffjda-text">
                  Notre club est affilié à la Fédération Française de Judo. La licence comprend
                  l&apos;<strong>assurance</strong>{" "}du pratiquant et donne accès aux passages de grades
                  ainsi qu&apos;aux compétitions officielles.
                </p>
              </div>
            </a>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 28 }}>
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>入</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">入会 · Adhérer</span>
            </div>
            <h2 className="title-lg" style={{ marginBottom: 28 }}>
              Nos <em>formules</em>.
            </h2>

            <div className="cards-grid" style={{ marginBottom: 48 }}>
              {formules.map((f) => (
                <div key={f.id} className="card">
                  <span className="card-kanji" lang="ja" aria-hidden>{f.kanji}</span>
                  <h3 className="card-title">{f.nom}</h3>
                  <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", margin: 0 }}>
                    {f.tranche_age}
                  </p>
                  <p style={{ fontFamily: "var(--serif)", fontWeight: 300, fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em", margin: "8px 0", fontFeatureSettings: "'tnum'" }}>
                    {f.prix}<span style={{ fontSize: 22, color: "var(--stone)", marginLeft: 4 }}>€</span>
                  </p>
                  <p className="card-text">{f.italique}</p>
                </div>
              ))}
            </div>

            <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", background: "var(--paper)", border: "1px solid var(--hair-color)", padding: "clamp(28px, 4vw, 44px)" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2vw, 26px)", color: "var(--sumi)", margin: "0 0 10px" }}>
                Envie de rejoindre le club&nbsp;?
              </p>
              <p style={{ fontFamily: "var(--serif)", color: "var(--sumi-soft)", fontSize: 15, lineHeight: 1.55, margin: "0 0 26px" }}>
                L&apos;inscription et le règlement se font en ligne, en quelques minutes et en toute sécurité.
              </p>
              <div style={{ maxWidth: 340, margin: "0 auto" }}>
                <HelloAssoWidget src={HELLOASSO_BUTTON_URL} height={70} title="Adhérer en ligne — HelloAsso" />
              </div>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
                Paiement 100&nbsp;% sécurisé via HelloAsso. Une question&nbsp;?{" "}
                <a href="/contact" style={{ borderBottom: "1px solid var(--hair-strong)", color: "var(--sumi)" }}>contactez le bureau</a>.
              </p>
            </div>
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
                au dojo. Nous restons à votre disposition pour toute question.
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
