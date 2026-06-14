import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import { createFormule } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Nouvelle formule", robots: { index: false } };

export default async function NewFormulePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <AdminPageHeader
        title="Nouvelle <em>formule</em>"
        backHref="/admin/formules"
        backLabel="Toutes les formules"
      />

      <form action={createFormule} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div className="form-error" role="alert" style={{ padding: "12px 16px", background: "rgba(200,51,42,0.08)", borderLeft: "3px solid var(--red)" }}>
            {error}
          </div>
        )}

        <p style={{ fontSize: 13, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic", margin: 0 }}>
          Ces formules sont les tarifs affichés sur la page Adhésion. Les champs d&apos;âge servent
          seulement à générer la tranche d&apos;âge affichée — laissez-les vides et remplissez
          «&nbsp;Texte affiché&nbsp;» si vous préférez. L&apos;inscription se fait ensuite via HelloAsso.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="kanji">Kanji</label>
            <input id="kanji" name="kanji" type="text" className="form-input" style={{ fontFamily: "var(--serif-jp)", fontSize: 24, textAlign: "center" }} placeholder="人" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="nom">Nom</label>
            <input id="nom" name="nom" type="text" className="form-input" required placeholder="Senior" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="age_min">Âge minimum <span style={{ color: "var(--stone)", fontWeight: 400 }}>(facultatif)</span></label>
            <input id="age_min" name="age_min" type="number" min={0} max={120} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="age_max">Âge maximum <span style={{ color: "var(--stone)", fontWeight: 400 }}>(vide = pas de max)</span></label>
            <input id="age_max" name="age_max" type="number" min={0} max={120} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="tranche_age">Texte affiché <span style={{ color: "var(--stone)", fontWeight: 400 }}>(auto si vide)</span></label>
            <input id="tranche_age" name="tranche_age" type="text" className="form-input" placeholder="Ex. 14 ans et +" />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="prix">Prix annuel (en euros)</label>
          <input id="prix" name="prix" type="number" min={0} step={0.01} defaultValue={0} className="form-input" required style={{ maxWidth: 200 }} />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="italique">Phrase descriptive (italique)</label>
          <input id="italique" name="italique" type="text" className="form-input" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }} placeholder="Pratique complète, compétition au choix." />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="slots_texte">Créneaux (texte libre)</label>
          <input id="slots_texte" name="slots_texte" type="text" className="form-input" placeholder="Lundi · Jeudi · Samedi soir" />
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
          <button type="submit" className="btn btn-primary">
            Créer la formule
            <span className="btn-dot" aria-hidden />
          </button>
        </div>
      </form>
    </>
  );
}
