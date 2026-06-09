import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getActualites, getFormules, getHeroContent, getAboutContent, getGaleriePhotos } from "@/lib/data";
import { sanitizeInlineTitle } from "@/lib/sanitize";

export default async function HomePage() {
  const [formules, actus, hero, about, galerie] = await Promise.all([
    getFormules(),
    getActualites(3),
    getHeroContent(),
    getAboutContent(),
    getGaleriePhotos(6),
  ]);

  return (
    <>
      <Nav />
      <main id="main">
        {/* ─── HERO ─── */}
        <section className="container" style={{ position: "relative" }}>
          <span
            className="hero-kanji-bg"
            aria-hidden
            lang="ja"
          >
            道
          </span>
          <div className="hero">
            <div>
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-jp" lang="ja">{hero.proverbe_jp}</span>
                <span className="hero-eyebrow-rule" aria-hidden />
                <span>{hero.eyebrow}</span>
              </p>
              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: sanitizeInlineTitle(hero.titre) }} />
              <p className="hero-sub">{hero.sous_titre}</p>
              <div className="hero-actions">
                <Link href="/adhesion" className="btn btn-primary">
                  Pré-inscription
                  <span className="btn-dot" aria-hidden />
                </Link>
                <Link href="/judo" className="btn btn-secondary btn-arrow">
                  Découvrir le judo
                </Link>
              </div>

              <div className="hero-stats">
                <div>
                  <div className="hero-stat-num">{hero.stat1_num}</div>
                  <div className="hero-stat-label">{hero.stat1_label}</div>
                </div>
                <div>
                  <div className="hero-stat-num">{hero.stat2_num}</div>
                  <div className="hero-stat-label">{hero.stat2_label}</div>
                </div>
                <div>
                  <div className="hero-stat-num">{hero.stat3_num}</div>
                  <div className="hero-stat-label">{hero.stat3_label}</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-disc" aria-hidden />
              <Image
                src="/logo.png"
                alt="Logo AME-JUDO — Arts Martiaux Ermontois"
                width={420}
                height={420}
                className="hero-visual-logo"
                sizes="(max-width: 880px) 200px, 420px"
                priority
              />
            </div>
          </div>
        </section>

        {/* ─── VIE DU DOJO (galerie masonry, alimentée par l'admin) ─── */}
        {galerie.length > 0 && (
          <ScrollReveal as="section" className="section">
            <div className="container">
              <div className="section-header">
                <span className="section-header-dot" aria-hidden />
                <span className="section-header-num" lang="ja" aria-hidden>写</span>
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">道場 · En images</span>
              </div>
              <h2 className="title-lg" style={{ marginBottom: 28 }}>
                La vie sur le <em>tatami</em>.
              </h2>
              <div className="home-photo-grid">
                {galerie.map((p) => (
                  <figure key={p.id} className="home-photo-item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.legende ?? "Photo du club AME-JUDO"} loading="lazy" />
                  </figure>
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <Link href="/galerie" className="btn btn-secondary btn-arrow">
                  Voir toute la galerie
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ─── LES VOIES (preview) ─── */}
        <ScrollReveal as="section" className="section section--paper home-judo-teaser">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>一</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">柔道 · La voie</span>
            </div>

            <div className="home-judo-grid">
              <div className="home-judo-visual" aria-hidden>
                <span className="home-judo-kanji" lang="ja">柔</span>
              </div>

              <div className="home-judo-body">
                <h2 className="title-lg">
                  Une seule voie,<br />
                  enseignée en <em>profondeur</em>.
                </h2>
                <p className="lead">
                  Au club AME-JUDO, nous avons fait le choix d&apos;une discipline et d&apos;une
                  seule : le <strong>judo</strong>. Discipline olympique fondée en 1882
                  par Jigoro Kano, elle se pratique du baby-judo aux adultes confirmés —
                  toujours dans la rigueur du geste et la bienveillance de la transmission.
                </p>
                <p className="lead" style={{ marginBottom: 32 }}>
                  Trois familles techniques, deux principes fondateurs, une vie
                  entière à explorer.
                </p>
                <Link href="/judo" className="btn btn-secondary btn-arrow">
                  Découvrir le judo
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── L'ÂME ─── */}
        <ScrollReveal as="section" className="section">
          <div className="container ame-grid">
            <div>
              <div className="section-header">
                <span className="section-header-dot" aria-hidden />
                <span className="section-header-num" lang="ja" aria-hidden>二</span>
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">魂 · L&apos;âme</span>
              </div>
              <blockquote style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(20px, 2vw, 28px)", lineHeight: 1.35, color: "var(--sumi)", margin: 0, maxWidth: 360 }}>
                « {about.citation} »
              </blockquote>
              <p style={{ marginTop: 16, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
                — {about.attribution}
              </p>
            </div>
            <div>
              <h2 className="title-lg" dangerouslySetInnerHTML={{ __html: sanitizeInlineTitle(about.titre) }} />
              {about.paragraphes.split("\n\n").map((p, i) => (
                <p key={i} style={{ fontFamily: "var(--serif)", fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.75, color: "var(--sumi-soft)", marginBottom: 20 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ─── ADHÉSION CTA ─── */}
        <ScrollReveal as="section" className="section section--sand">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>三</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">入門 · Rejoindre</span>
            </div>
            <h2 className="title-lg">
              Deux essais <em>gratuits</em>,<br />
              avant tout engagement.
            </h2>
            <p className="lead" style={{ marginBottom: 40 }}>
              Trois formules selon l&apos;âge et la pratique. Aucun paiement requis pour la pré-inscription —
              le règlement se fait au premier cours.
            </p>

            <div className="cards-grid" style={{ marginBottom: 40 }}>
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

            <Link href="/adhesion" className="btn btn-primary">
              Pré-inscrire — formulaire
              <span className="btn-dot" aria-hidden />
            </Link>
          </div>
        </ScrollReveal>

        {/* ─── ACTUALITÉS ─── */}
        <ScrollReveal as="section" className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>四</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">報 · Actualités</span>
            </div>
            <h2 className="title-lg">
              La vie du <em>dojo</em>.
            </h2>

            <div className="actus-list">
              {actus.map((a) => (
                <Link key={a.id} href={`/actualites/${a.slug}`} className="actu-row">
                  <span className="actu-kanji" lang="ja" aria-hidden>{a.kanji}</span>
                  <div className="actu-content">
                    <div className="actu-meta">
                      <span className="actu-cat-dot" aria-hidden />
                      <span>{a.categorie}</span>
                      <span>·</span>
                      <span>{new Date(a.date_publication).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <h3 className="actu-title">{a.titre}</h3>
                    <p className="actu-extrait">{a.extrait}</p>
                  </div>
                  {a.photo_url ? (
                    <div className="actu-thumb">
                      <Image
                        src={a.photo_url}
                        alt={a.titre}
                        fill
                        sizes="(max-width: 600px) 100vw, 140px"
                        style={{ objectFit: "cover", objectPosition: a.photo_focus || "50% 50%" }}
                      />
                    </div>
                  ) : (
                    <div className="actu-thumb actu-thumb--empty" aria-hidden>
                      <span className="actu-thumb-kanji" lang="ja">{a.kanji}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <Link href="/actualites" className="btn btn-secondary btn-arrow">
                Toutes les actualités
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
