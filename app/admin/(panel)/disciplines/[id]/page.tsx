import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getDisciplineById, updateDiscipline } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Modifier une voie", robots: { index: false } };

export default async function DisciplineEdit({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getDisciplineById(id);
  if (!d) notFound();

  const update = updateDiscipline.bind(null, id);

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${d.nom}</em>`}
        backHref="/admin/disciplines"
        backLabel="Retour"
      />

      <form action={update} style={{ maxWidth: 920, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="kanji">Kanji</label>
            <input
              id="kanji" name="kanji" type="text" defaultValue={d.kanji}
              className="form-input"
              style={{ fontFamily: "var(--serif-jp)", fontSize: 24, textAlign: "center" }}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="nom">Nom</label>
            <input id="nom" name="nom" type="text" defaultValue={d.nom} className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="sens">Sens (traduction)</label>
            <input id="sens" name="sens" type="text" defaultValue={d.sens} className="form-input" />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="tagline">Tagline (phrase d'accroche)</label>
          <input id="tagline" name="tagline" type="text" defaultValue={d.tagline} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="body">Description complète</label>
          <textarea
            id="body" name="body"
            className="form-input"
            defaultValue={d.body}
            rows={6}
            style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.65, resize: "vertical" }}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="origine">Origine (date, fondateur…)</label>
          <input id="origine" name="origine" type="text" defaultValue={d.origine} className="form-input" />
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
          <button type="submit" className="btn btn-primary">
            Enregistrer
            <span className="btn-dot" aria-hidden />
          </button>
        </div>
      </form>
    </>
  );
}
