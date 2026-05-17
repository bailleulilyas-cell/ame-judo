import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getDisciplines, getSlots } from "@/lib/data";

export const metadata: Metadata = {
  title: "Les voies — Judo, Ju-jitsu, Taïso",
  description: "Découvrez les trois disciplines enseignées au club AME : judo, ju-jitsu et taïso.",
};

export default async function VoiesPage() {
  const [disciplines, slots] = await Promise.all([getDisciplines(), getSlots()]);

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>一</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">道 · Les voies</span>
            </div>
            <h1 className="page-hero-title">
              Trois <em>voies</em>, un même tatami.
            </h1>
            <p className="page-hero-sub">
              Au club AME, chaque discipline est enseignée par des professeurs gradés, dans le respect
              de la tradition japonaise et avec la pédagogie adaptée à chaque âge.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <ul className="voies-list">
              {disciplines.map((d, i) => {
                const dSlots = slots.filter((s) => String(s.discipline_id) === String(d.id));
                return (
                  <li key={d.id} className="voie">
                    <span className="voie-num" aria-hidden>
                      0{i + 1}
                    </span>
                    <span className="voie-kanji" lang="ja" aria-hidden>{d.kanji}</span>
                    <div className="voie-body">
                      <h2 className="voie-name">{d.nom}</h2>
                      <p className="voie-sens">{d.sens}</p>
                      <p className="voie-tagline">{d.tagline}</p>
                      <p className="voie-text">{d.body}</p>

                      {dSlots.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 10 }}>
                            Créneaux
                          </p>
                          <div className="voie-slots">
                            {dSlots.map((s) => (
                              <div key={s.id} style={{ fontSize: 13, color: "var(--sumi-soft)", fontFeatureSettings: "'tnum'" }}>
                                <span lang="ja" style={{ color: "var(--sumi)", marginRight: 8 }}>{s.jour_kanji}</span>
                                {s.heure_debut}–{s.heure_fin} · {s.niveau.split(" · ").slice(-1)[0]}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="voie-meta">
                        <span>{d.origine}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div style={{ marginTop: 64, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/horaires" className="btn btn-secondary btn-arrow">
                Tous les horaires
              </Link>
              <Link href="/adhesion" className="btn btn-primary">
                S&apos;inscrire
                <span className="btn-dot" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
