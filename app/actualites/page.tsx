import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getActualites } from "@/lib/data";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Toutes les actualités du club AME-JUDO — stages, compétitions, événements.",
  alternates: { canonical: "/actualites" },
  openGraph: {
    title: "Actualités — AME-JUDO Ermont",
    description: "Stages, compétitions et événements du club AME-JUDO.",
    url: "/actualites",
  },
};

export default async function ActualitesPage() {
  const actus = await getActualites();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>五</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">報 · Actualités</span>
            </div>
            <h1 className="page-hero-title">
              La vie du <em>dojo</em>.
            </h1>
            <p className="page-hero-sub">
              Stages, compétitions, événements et nouvelles du club — tout ce qui se passe sur et autour du tatami.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {actus.length === 0 ? (
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
                Les actualités arrivent bientôt.
              </p>
            ) : (
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
                      <h2 className="actu-title">{a.titre}</h2>
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
