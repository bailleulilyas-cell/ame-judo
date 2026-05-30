import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getMaitres } from "@/lib/data";

export const metadata: Metadata = {
  title: "Les maîtres — Équipe enseignante",
  description:
    "L'équipe enseignante du club de judo AME à Ermont (95) — des professeurs diplômés d'État, gradés ceinture noire, formés à la pédagogie de l'enfant comme de l'adulte.",
  alternates: { canonical: "/maitres" },
};

export default async function MaitresPage() {
  const maitres = await getMaitres();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>三</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">師範 · Maîtres</span>
            </div>
            <h1 className="page-hero-title">
              L&apos;encadrement qui <em>transmet</em>.
            </h1>
            <p className="page-hero-sub">
              Des professeurs diplômés d&apos;État, formés dans la tradition et ouverts à tous les niveaux.
              Leur grade n&apos;est pas un titre — c&apos;est une promesse de rigueur.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="maitres-grid">
              {maitres.map((m) => (
                <article key={m.id} className="maitre">
                  <div className="maitre-photo">
                    {m.photo_url && (
                      <Image
                        src={m.photo_url}
                        alt={`Portrait de ${m.nom}`}
                        fill
                        sizes="(max-width: 880px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="maitre-rule" aria-hidden />
                  <p className="maitre-role">{m.role}</p>
                  <h2 className="maitre-name">{m.nom}</h2>
                  <p className="maitre-grade">{m.grade}</p>
                  <p className="maitre-annees">{m.annees} ans de pratique</p>
                  <p className="maitre-citation">« {m.citation} »</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
