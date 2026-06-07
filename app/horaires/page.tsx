import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSlots, getHorairesNote } from "@/lib/data";

export const metadata: Metadata = {
  title: "Horaires — Tous les créneaux",
  description: "Tous les créneaux de judo du club AME-JUDO — pour enfants, ados et adultes. Du baby-judo aux ceintures noires.",
  alternates: { canonical: "/horaires" },
  openGraph: {
    title: "Horaires des cours — AME-JUDO Ermont",
    description: "Tous les créneaux de judo du club AME-JUDO — enfants, ados et adultes.",
    url: "/horaires",
  },
};

const JOURS = [
  { key: "lundi",    kanji: "月", label: "Lundi" },
  { key: "mercredi", kanji: "水", label: "Mercredi" },
  { key: "jeudi",    kanji: "木", label: "Jeudi" },
  { key: "samedi",   kanji: "土", label: "Samedi" },
  { key: "dimanche", kanji: "日", label: "Dimanche" },
] as const;

export default async function HorairesPage() {
  const [slots, note] = await Promise.all([getSlots(), getHorairesNote()]);

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>二</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">時 · Horaires</span>
            </div>
            <h1 className="page-hero-title">
              Trouver <em>son créneau</em>.
            </h1>
            <p className="page-hero-sub">
              Quatre jours de pratique par semaine, sept créneaux. Le calendrier suit l&apos;année scolaire.
            </p>
            <p className="page-hero-sub" style={{ marginTop: 14, fontSize: 15 }}>
              <strong>Complexe Sportif Saint-Exupéry</strong> — Rue Kvot et Leydekkers, 95120 Ermont.{" "}
              <a
                href="https://www.google.com/maps?q=Complexe+Sportif+Saint-Exupéry+Ermont+95120"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: "1px solid var(--hair-strong)", color: "var(--sumi)" }}
              >
                Voir sur la carte ↗
              </a>
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="horaires-layout">
              <div>
                {note?.active && (
                  <div className="horaires-note" role="note">
                    {note.texte}
                  </div>
                )}

                {JOURS.map((jour) => {
                  const jourSlots = slots.filter((s) => s.jour === jour.key).sort((a, b) => a.ordre - b.ordre);
                  if (jourSlots.length === 0) return null;
                  return (
                    <div key={jour.key} className="h-day-group">
                      <h2 className="h-day-name">
                        <span className="h-day-kanji" lang="ja" aria-hidden>{jour.kanji}</span>
                        <span className="h-day-label">{jour.label}</span>
                      </h2>
                      <div className="h-slots">
                        {jourSlots.map((s) => {
                          const parts = s.niveau.split(" · ");
                          const discipline = parts[0];
                          const niveau = parts.slice(1).join(" · ");
                          return (
                            <div key={s.id} className="h-slot">
                              <span className="h-slot-time">{s.heure_debut} – {s.heure_fin}</span>
                              <span className="h-slot-info">
                                <span className="h-slot-discipline">{discipline}</span>
                                {niveau && <> · {niveau}</>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="horaires-aside">
                <p className="horaires-aside-jp" lang="ja">体験<br />二回<br />無料</p>
                <p className="horaires-aside-title">Deux essais gratuits.</p>
                <p className="horaires-aside-text">
                  Venez avec votre tenue de sport — pas besoin de kimono pour la première séance.
                  Aucun rendez-vous nécessaire.
                </p>
                <Link href="/adhesion" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Pré-inscription
                  <span className="btn-dot" aria-hidden />
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
