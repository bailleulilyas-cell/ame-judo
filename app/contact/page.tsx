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

        <section className="section">
          <div className="container contact-grid">
            <div>
              <div className="section-header">
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">Adresse</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.7, marginBottom: 20 }}>
                {s.adresse_ligne1}<br />
                {s.adresse_ligne2}<br />
                {s.adresse_ligne3}
              </p>
              <div style={{ marginBottom: 32, borderRadius: 4, overflow: "hidden", border: "1px solid var(--hair-color)" }}>
                <iframe
                  title="Localisation du dojo AME"
                  src="https://maps.google.com/maps?q=X7V2%2BXQ+Ermont+France&output=embed&hl=fr&z=17"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block", filter: "grayscale(15%)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

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
      </main>
      <Footer />
    </>
  );
}
