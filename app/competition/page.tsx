import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getCompetitionResults } from "@/lib/data";
import type { Actualite } from "@/types";

export const metadata: Metadata = {
  title: "Compétition",
  description:
    "La compétition au club AME-JUDO, à son rythme. Pôle jeunes et pôle vétérans — la compétition n'a pas d'âge. Derniers résultats du dojo.",
  alternates: { canonical: "/competition" },
  openGraph: {
    title: "Compétition — AME-JUDO Ermont",
    description: "La compétition au club AME-JUDO. Pôle jeunes et pôle vétérans.",
    url: "/competition",
  },
};

function medals(a: Actualite) {
  return (a.compet_or ?? 0) + (a.compet_argent ?? 0) + (a.compet_bronze ?? 0);
}

function medalBreakdown(a: Actualite): string {
  const parts: string[] = [];
  if (a.compet_or) parts.push(`${a.compet_or} or`);
  if (a.compet_argent) parts.push(`${a.compet_argent} argent`);
  if (a.compet_bronze) parts.push(`${a.compet_bronze} bronze`);
  return parts.join(" · ");
}

function frDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CompetitionPage() {
  const results = await getCompetitionResults();

  const totalMedals = results.reduce((s, a) => s + medals(a), 0);
  const totalGold = results.reduce((s, a) => s + (a.compet_or ?? 0), 0);
  const hasStats = results.length > 0;

  return (
    <>
      <Nav />
      <main id="main">
        {/* ─── HERO ─── */}
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>競</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">競 · Compétition</span>
            </div>
            <h1 className="page-hero-title">
              Concourir, <em>à son rythme.</em>
            </h1>
            <p className="page-hero-sub">
              La compétition n’est jamais imposée au club. Pour celles et ceux qui choisissent le tatami du
              combat, deux voies ouvertes à tous — celle des jeunes guerriers, et celle d’une vie entière de judo.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container compet">
            {/* ─── STATS ─── */}
            {hasStats && (
              <ScrollReveal as="div" className="compet-stats">
                <div className="compet-stat">
                  <div className="compet-stat-num">{totalMedals}</div>
                  <div className="compet-stat-label">médailles rapportées</div>
                </div>
                <div className="compet-stat">
                  <div className="compet-stat-num">{totalGold}</div>
                  <div className="compet-stat-label">dont en or</div>
                </div>
                <div className="compet-stat">
                  <div className="compet-stat-num">{results.length}</div>
                  <div className="compet-stat-label">compétitions</div>
                </div>
              </ScrollReveal>
            )}

            {/* ─── DEUX PÔLES ─── */}
            <ScrollReveal as="div" className="compet-poles">
              <article className="compet-pole">
                <div className="compet-pole-head">
                  <span className="compet-pole-kanji" lang="ja" aria-hidden>少</span>
                  <span className="compet-pole-cat">Jeunes · 6–17 ans</span>
                </div>
                <h2 className="compet-pole-title">La voie des <em>jeunes guerriers.</em></h2>
                <p>
                  Premières confrontations bienveillantes, du départemental au régional. Encadrement dédié,
                  déplacements en groupe, esprit d’équipe.
                </p>
                <ul>
                  <li>Championnat départemental benjamins</li>
                  <li>Circuit régional minimes &amp; cadets</li>
                  <li>Animations et tournois inter-clubs</li>
                </ul>
                <Link className="compet-btn" href="/adhesion">Rejoindre le groupe compétition →</Link>
              </article>

              <article className="compet-pole is-veteran">
                <span className="compet-pole-badge">Jamais trop tard pour se lancer</span>
                <div className="compet-pole-head">
                  <span className="compet-pole-kanji" lang="ja" aria-hidden>達</span>
                  <span className="compet-pole-cat">Vétérans · 30 ans et +</span>
                </div>
                <h2 className="compet-pole-title">La compétition <em>n’a pas d’âge.</em></h2>
                <p>
                  Que vous montiez sur un tatami pour la première fois à 40 ans ou que vous n’en soyez jamais
                  descendu — les catégories M1 à M9 accueillent tous les parcours.
                </p>
                <ul>
                  <li>Championnat de France vétérans</li>
                  <li>Catégories M1 à M9 par tranche d’âge</li>
                  <li>Préparation adaptée, sans pression</li>
                </ul>
                <Link className="compet-btn" href="/adhesion">Rejoindre la compétition →</Link>
              </article>
            </ScrollReveal>

            {/* ─── RÉSULTATS ─── */}
            <ScrollReveal as="div" className="compet-results-wrap">
              <div className="compet-results-head">
                <div className="section-header">
                  <span className="section-header-dot" aria-hidden />
                  <span className="section-header-num" lang="ja" aria-hidden>報</span>
                  <span className="section-header-rule" aria-hidden />
                  <span className="section-header-label">報 · Derniers résultats</span>
                </div>
                <h2 className="compet-results-title">La fierté du <em>dojo.</em></h2>
              </div>

              {results.length === 0 ? (
                <p className="compet-empty">
                  Les premiers résultats de la saison seront publiés ici. Compétiteurs, à vos kimonos.
                </p>
              ) : (
                <>
                  <div className="compet-results">
                    {results.map((a) => {
                      const breakdown = medalBreakdown(a);
                      return (
                        <Link key={a.id} href={`/actualites/${a.slug}`} className="compet-result">
                          {a.photo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img className="compet-result-thumb" src={a.photo_url} alt="" />
                          ) : (
                            <span className="compet-medal" aria-hidden>{medals(a) || "•"}</span>
                          )}
                          <div className="compet-result-meta">
                            <div className="compet-result-t">{a.titre}</div>
                            <div className="compet-result-d">
                              {frDate(a.date_publication)}
                              {breakdown && <> · {breakdown}</>}
                            </div>
                          </div>
                          <span className={`compet-tag compet-tag--${a.compet_pole === "veteran" ? "veteran" : "jeunes"}`}>
                            {a.compet_pole === "veteran" ? "Vétérans" : "Jeunes"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="compet-results-foot">
                    <Link className="compet-btn compet-btn--ghost" href="/actualites">Toutes les actualités →</Link>
                  </div>
                </>
              )}
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
