import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getHero, updateHero } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Hero — Admin", robots: { index: false } };

export default async function HeroEditPage({
  searchParams,
}: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const hero = await getHero();

  if (!hero) {
    return (
      <>
        <AdminPageHeader title="Accueil <em>(Hero)</em>" />
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Base MySQL non configurée — connectez la base pour éditer cette section.
        </p>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Accueil <em>(Hero)</em>"
        description="Tout ce qui s'affiche tout en haut de la page d'accueil."
        saved={!!ok}
      />

      <form action={updateHero} style={{ maxWidth: 920, display: "flex", flexDirection: "column", gap: 24 }}>
        <Field label="Eyebrow (texte au-dessus du titre)" name="eyebrow" defaultValue={hero.eyebrow} />
        <Field
          label="Titre principal"
          help="Utilisez <em>texte</em> pour mettre en italique rouge, <br> pour un retour à la ligne."
          name="titre"
          defaultValue={hero.titre}
          textarea
          rows={3}
        />
        <Field label="Sous-titre / description" name="sous_titre" defaultValue={hero.sous_titre} textarea rows={3} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Proverbe japonais" name="proverbe_jp" defaultValue={hero.proverbe_jp} jpFont />
          <Field label="Traduction française" name="proverbe_fr" defaultValue={hero.proverbe_fr} />
        </div>

        <fieldset style={{ border: "1px solid var(--hair-color)", padding: 24, margin: 0 }}>
          <legend style={{ padding: "0 8px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)" }}>
            Trois chiffres clés
          </legend>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, marginBottom: 12 }}>
              <Field label="Chiffre" name={`stat${i}_num`} defaultValue={hero[`stat${i}_num` as keyof typeof hero] as string} small />
              <Field label="Légende" name={`stat${i}_label`} defaultValue={hero[`stat${i}_label` as keyof typeof hero] as string} small />
            </div>
          ))}
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

function Field({
  label, name, defaultValue, help, textarea, rows, jpFont, small,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  help?: string;
  textarea?: boolean;
  rows?: number;
  jpFont?: boolean;
  small?: boolean;
}) {
  const baseStyle: React.CSSProperties = jpFont
    ? { fontFamily: "var(--serif-jp)", fontSize: 18 }
    : {};
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={name} style={small ? { fontSize: 9 } : undefined}>{label}</label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          className="form-input"
          rows={rows ?? 3}
          style={{ ...baseStyle, resize: "vertical" }}
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          defaultValue={defaultValue}
          className="form-input"
          style={baseStyle}
        />
      )}
      {help && <p style={{ fontSize: 11, color: "var(--stone)", margin: "4px 0 0" }}>{help}</p>}
    </div>
  );
}
