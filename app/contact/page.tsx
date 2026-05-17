import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez le club AME — adresse, email, horaires de permanence.",
};

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>六</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">便 · Contact</span>
            </div>
            <h1 className="page-hero-title">
              Nous <em>écrire</em>, nous <em>trouver</em>.
            </h1>
            <p className="page-hero-sub">
              Une question, une remarque, ou simplement envie de venir voir le dojo —
              n&apos;hésitez pas à passer ou à nous écrire.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container contact-grid">
            <div>
              <div className="section-header">
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">Adresse</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
                {s.adresse_ligne1}<br />
                {s.adresse_ligne2}<br />
                {s.adresse_ligne3}
              </p>

              <div className="section-header">
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">Email</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 32 }}>
                <a href={`mailto:${s.email}`} style={{ borderBottom: "1px solid var(--hair-strong)" }}>
                  {s.email}
                </a>
              </p>

              <div className="section-header">
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">Permanence</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 18 }}>
                {s.permanence}
              </p>
            </div>

            <div style={{ background: "var(--paper)", border: "1px solid var(--hair-color)", padding: "clamp(28px, 3vw, 48px)" }}>
              <h2 className="title-md" style={{ marginBottom: 8 }}>
                Pré-<em>inscription</em> ?
              </h2>
              <p style={{ fontFamily: "var(--serif)", color: "var(--sumi-soft)", marginBottom: 24, fontSize: 16, lineHeight: 1.55 }}>
                Pour une demande d&apos;inscription au club, utilisez le formulaire dédié — c&apos;est plus simple et plus rapide.
              </p>
              <Link href="/adhesion" className="btn btn-primary">
                Formulaire de pré-inscription
                <span className="btn-dot" aria-hidden />
              </Link>

              <hr style={{ border: "none", borderTop: "1px solid var(--hair-color)", margin: "32px 0" }} />

              <h2 className="title-md" style={{ marginBottom: 8 }}>
                Venir au <em>dojo</em>.
              </h2>
              <p style={{ fontFamily: "var(--serif)", color: "var(--sumi-soft)", marginBottom: 24, fontSize: 16, lineHeight: 1.55 }}>
                Aucun rendez-vous nécessaire — venez juste avec votre tenue de sport pendant un créneau de votre niveau.
              </p>
              <Link href="/horaires" className="btn btn-secondary btn-arrow">
                Voir les horaires
              </Link>
            </div>
          </div>
        </section>

        <section aria-label="Localisation" style={{ marginTop: "clamp(48px, 6vw, 80px)" }}>
          <div className="container" style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">Nous trouver</span>
            </div>
          </div>
          <div style={{ width: "100%", aspectRatio: "16/5", minHeight: 260, maxHeight: 440 }}>
            <iframe
              title="Localisation du club AME — Complexe Sportif Saint-Exupéry, Ermont"
              src="https://maps.google.com/maps?q=Complexe+Sportif+Saint+Exupery+Rue+Kuot+95120+Ermont+France&output=embed&hl=fr&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", filter: "grayscale(20%) contrast(1.05)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
