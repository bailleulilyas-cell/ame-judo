import type { Metadata } from "next";
import Link from "next/link";
import { query, queryOne } from "@/lib/db";
import type { ScheduleSlot, HorairesNote } from "@/types";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import { deleteSlot, updateHorairesNote, updateHorairesFrequences } from "@/lib/actions/cms";
import { getHorairesFrequences } from "@/lib/data";

export const metadata: Metadata = { title: "Horaires — Admin", robots: { index: false } };

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

const JOURS = [
  { key: "lundi", label: "Lundi", kanji: "月" },
  { key: "mercredi", label: "Mercredi", kanji: "水" },
  { key: "jeudi", label: "Jeudi", kanji: "木" },
  { key: "samedi", label: "Samedi", kanji: "土" },
  { key: "dimanche", label: "Dimanche", kanji: "日" },
];

export default async function HorairesAdminPage({
  searchParams,
}: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;

  if (!DB_READY) {
    return (
      <>
        <AdminPageHeader title="Horaires" />
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>Base MySQL non configurée.</p>
      </>
    );
  }

  const [slots, note, frequences] = await Promise.all([
    query<ScheduleSlot>("SELECT * FROM schedule_slots ORDER BY FIELD(jour,'lundi','mercredi','jeudi','samedi','dimanche'), ordre"),
    queryOne<HorairesNote>("SELECT * FROM horaires_note WHERE id = 1"),
    getHorairesFrequences(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Horaires des cours"
        description="Gérez les créneaux par jour. Une note temporaire peut être affichée en haut du tableau (ex. fermeture pour les vacances)."
        action={
          <Link href="/admin/horaires/new" className="btn btn-primary">
            + Nouveau créneau
            <span className="btn-dot" aria-hidden />
          </Link>
        }
        saved={!!ok}
      />

      {/* ─── Note temporaire ─── */}
      <fieldset style={{ border: "1px solid var(--hair-color)", padding: 24, margin: "0 0 40px" }}>
        <legend style={{ padding: "0 8px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
          Note temporaire
        </legend>
        <form action={updateHorairesNote} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}>
            <input
              type="checkbox"
              name="active"
              defaultChecked={!!note?.active}
            />
            <span>Afficher la note sur le site public</span>
          </label>
          <textarea
            name="texte"
            className="form-input"
            placeholder="Ex : Pas de cours du 22 au 28 décembre — bonnes fêtes !"
            defaultValue={note?.texte ?? ""}
            rows={2}
            style={{ fontFamily: "var(--serif)", fontStyle: "italic", resize: "vertical" }}
          />
          <button type="submit" className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
            Enregistrer la note
          </button>
        </form>
      </fieldset>

      {/* ─── Fréquence des cours par catégorie d'âge ─── */}
      <fieldset style={{ border: "1px solid var(--hair-color)", padding: 24, margin: "0 0 40px" }}>
        <legend style={{ padding: "0 8px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
          Cours par semaine (par catégorie)
        </legend>
        <form action={updateHorairesFrequences} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--stone)", lineHeight: 1.5 }}>
            Une ligne par catégorie, au format «&nbsp;<strong>Catégorie (années) : X cours par semaine</strong>&nbsp;».
            Ce bloc s&apos;affiche sous les horaires sur le site.
          </p>
          <textarea
            name="texte"
            className="form-input"
            defaultValue={frequences}
            rows={9}
            style={{ resize: "vertical", lineHeight: 1.6 }}
          />
          <button type="submit" className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
            Enregistrer les fréquences
          </button>
        </form>
      </fieldset>

      {/* ─── Slots par jour ─── */}
      {JOURS.map((jour) => {
        const list = slots.filter((s) => s.jour === jour.key);
        return (
          <section key={jour.key} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22, margin: "0 0 12px", display: "flex", gap: 12, alignItems: "baseline" }}>
              <span lang="ja" style={{ fontFamily: "var(--serif-jp)" }}>{jour.kanji}</span>
              {jour.label}
              <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
                {list.length} créneau{list.length > 1 ? "x" : ""}
              </span>
            </h2>

            {list.length === 0 ? (
              <p style={{ color: "var(--stone)", fontStyle: "italic", fontFamily: "var(--serif)", marginLeft: 4 }}>
                Aucun créneau ce jour-là.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr 1fr auto auto",
                      gap: 12,
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "var(--paper)",
                      border: "1px solid var(--hair-color)",
                    }}
                  >
                    <span style={{ fontFeatureSettings: "'tnum'", fontWeight: 500 }}>{s.heure_debut} – {s.heure_fin}</span>
                    <span>{(s as ScheduleSlot & { discipline?: string }).discipline ?? ""}</span>
                    <span style={{ color: "var(--stone)" }}>{s.niveau}</span>
                    <Link
                      href={`/admin/horaires/${s.id}`}
                      style={{
                        fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                        padding: "6px 12px", border: "1px solid var(--hair-strong)",
                      }}
                    >
                      Modifier
                    </Link>
                    <form action={deleteSlot} style={{ display: "inline", position: "relative" }}>
                      <input type="hidden" name="id" value={s.id} />
                      <DeleteButton
                        message="Supprimer ce créneau ?"
                        itemName={`${(s as ScheduleSlot & { discipline?: string }).discipline ?? "Créneau"} · ${s.heure_debut}–${s.heure_fin}`}
                      />
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
