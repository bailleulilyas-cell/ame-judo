import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SocialIcon from "@/components/SocialIcon";
import { getSettings, getSocialLinks, getBureau } from "@/lib/data";
import { SOCIAL_PLATFORMS } from "@/lib/socials";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez le club AME-JUDO — adresse, email, horaires de permanence.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — AME-JUDO Ermont",
    description: "Contactez le club de judo AME-JUDO — adresse, email, permanence.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const [s, socials, bureau] = await Promise.all([getSettings(), getSocialLinks(), getBureau()]);

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

        {bureau.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-header">
                <span className="section-header-dot" aria-hidden />
                <span className="section-header-num" lang="ja" aria-hidden>会</span>
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">会 · Le bureau</span>
              </div>
              <h2 className="title-lg" style={{ marginBottom: 16 }}>
                Les femmes et les hommes <em>du club</em>.
              </h2>
              <p className="lead" style={{ marginBottom: 40 }}>
                Le bureau, ce sont les bénévoles qui font vivre AME-JUDO au quotidien —
                administration, événements, lien avec les familles.
              </p>

              <div className="bureau-grid">
                {bureau.map((m) => (
                  <article key={m.id} className="bureau-card">
                    <div className="bureau-photo">
                      {m.photo_url ? (
                        <Image
                          src={m.photo_url}
                          alt={`${m.prenom} ${m.nom}`}
                          fill
                          sizes="(max-width: 880px) 50vw, 25vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <span className="bureau-photo-initials" aria-hidden>
                          {(m.prenom[0] ?? "") + (m.nom[0] ?? "")}
                        </span>
                      )}
                    </div>
                    <p className="bureau-poste">{m.poste}</p>
                    <h3 className="bureau-name">{m.prenom} {m.nom}</h3>
                    {m.description && <p className="bureau-desc">{m.description}</p>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

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
                  title="Localisation du dojo AME-JUDO"
                  src="https://maps.google.com/maps?q=Dojo+des+arts+martiaux+ermontois&output=embed&hl=fr&z=17"
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

              {socials.length > 0 && (
                <>
                  <div className="section-header" style={{ marginTop: 32 }}>
                    <span className="section-header-rule" aria-hidden />
                    <span className="section-header-label">Suivez-nous</span>
                  </div>
                  <div className="contact-socials">
                    {socials.map((soc) => (
                      <a
                        key={soc.id}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-social"
                        aria-label={SOCIAL_PLATFORMS[soc.plateforme].label}
                      >
                        <SocialIcon platform={soc.plateforme} size={22} />
                        <span>{SOCIAL_PLATFORMS[soc.plateforme].label}</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
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
