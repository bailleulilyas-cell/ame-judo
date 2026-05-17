import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getSettings } from "@/lib/data";
import { updateSettings } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Paramètres — Admin", robots: { index: false } };

export default async function ParametresPage({
  searchParams,
}: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const s = await getSettings();

  return (
    <>
      <AdminPageHeader
        title="Contact / <em>Pied de page</em>"
        description="Toutes les coordonnées affichées dans le footer et sur la page Contact."
        saved={!!ok}
      />

      <form action={updateSettings} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
        <fieldset style={{ border: "1px solid var(--hair-color)", padding: 24, margin: 0 }}>
          <legend style={{ padding: "0 8px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
            Adresse du dojo
          </legend>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field name="adresse_ligne1" label="Ligne 1" defaultValue={s.adresse_ligne1} />
            <Field name="adresse_ligne2" label="Ligne 2" defaultValue={s.adresse_ligne2} />
            <Field name="adresse_ligne3" label="Code postal et ville" defaultValue={s.adresse_ligne3} />
          </div>
        </fieldset>

        <fieldset style={{ border: "1px solid var(--hair-color)", padding: 24, margin: 0 }}>
          <legend style={{ padding: "0 8px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
            Contact
          </legend>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field name="email" label="Email du bureau" defaultValue={s.email} type="email" />
            <Field name="telephone" label="Téléphone (optionnel)" defaultValue={s.telephone ?? ""} />
            <Field name="permanence" label="Horaires de permanence" defaultValue={s.permanence} />
          </div>
        </fieldset>

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

function Field({ name, label, defaultValue, type = "text" }: { name: string; label: string; defaultValue: string; type?: string }) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="form-input" defaultValue={defaultValue} />
    </div>
  );
}
