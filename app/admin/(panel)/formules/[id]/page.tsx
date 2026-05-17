import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getFormuleById, updateFormule } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Modifier une formule", robots: { index: false } };

export default async function FormuleEdit({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = await getFormuleById(id);
  if (!f) notFound();
  const update = updateFormule.bind(null, id);

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${f.nom}</em>`}
        backHref="/admin/formules"
        backLabel="Toutes les formules"
      />

      <form action={update} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="kanji">Kanji</label>
            <input id="kanji" name="kanji" type="text" defaultValue={f.kanji} className="form-input" style={{ fontFamily: "var(--serif-jp)", fontSize: 24, textAlign: "center" }} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="nom">Nom</label>
            <input id="nom" name="nom" type="text" defaultValue={f.nom} className="form-input" required />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="age_min">Âge minimum</label>
            <input id="age_min" name="age_min" type="number" min={0} max={120} defaultValue={f.age_min ?? ""} className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="age_max">Âge maximum <span style={{ color: "var(--stone)", fontWeight: 400 }}>(vide = pas de max)</span></label>
            <input id="age_max" name="age_max" type="number" min={0} max={120} defaultValue={f.age_max ?? ""} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="tranche_age">Texte affiché <span style={{ color: "var(--stone)", fontWeight: 400 }}>(auto si vide)</span></label>
            <input id="tranche_age" name="tranche_age" type="text" defaultValue={f.tranche_age} className="form-input" placeholder="Ex. 4 – 5 ans" />
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic", margin: 0 }}>
          ↳ L&apos;âge minimum et maximum déterminent automatiquement quelle formule est proposée selon la date de naissance saisie par l&apos;inscrit·e.
        </p>

        <div className="form-field">
          <label className="form-label" htmlFor="prix">Prix annuel (en euros)</label>
          <input
            id="prix" name="prix" type="number" min={0} step={10}
            defaultValue={f.prix}
            className="form-input"
            required
            style={{ maxWidth: 200 }}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="italique">Phrase descriptive (italique)</label>
          <input
            id="italique" name="italique" type="text"
            defaultValue={f.italique}
            className="form-input"
            style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="slots_texte">Créneaux (texte libre)</label>
          <input
            id="slots_texte" name="slots_texte" type="text"
            placeholder="Mercredi 17h-19h · Samedi 11h45"
            defaultValue={f.slots_texte}
            className="form-input"
          />
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
