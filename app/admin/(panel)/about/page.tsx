import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getAbout, updateAbout } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "L'âme — Admin", robots: { index: false } };

export default async function AboutEditPage({
  searchParams,
}: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const about = await getAbout();

  if (!about) {
    return (
      <>
        <AdminPageHeader title="L'âme du club" />
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Base MySQL non configurée.
        </p>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="L'âme du <em>club</em>"
        description="Le bloc 'philosophie' affiché sur la page d'accueil."
        saved={!!ok}
      />

      <form action={updateAbout} style={{ maxWidth: 920, display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="citation">Citation</label>
          <textarea
            id="citation"
            name="citation"
            className="form-input"
            defaultValue={about.citation}
            rows={2}
            style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16, resize: "vertical" }}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="attribution">Attribution</label>
          <input
            id="attribution"
            name="attribution"
            type="text"
            className="form-input"
            defaultValue={about.attribution}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="titre">Titre du bloc</label>
          <p style={{ fontSize: 11, color: "var(--stone)", margin: "0 0 6px" }}>
            Utilisez <code style={{ background: "var(--paper)", padding: "1px 5px" }}>&lt;em&gt;mot&lt;/em&gt;</code> pour mettre en italique rouge.
          </p>
          <input
            id="titre"
            name="titre"
            type="text"
            className="form-input"
            defaultValue={about.titre}
            style={{ fontFamily: "var(--serif)", fontSize: 18 }}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="paragraphes">Paragraphes</label>
          <p style={{ fontSize: 11, color: "var(--stone)", margin: "0 0 6px" }}>
            Séparez chaque paragraphe par une <strong>ligne vide</strong>.
          </p>
          <textarea
            id="paragraphes"
            name="paragraphes"
            className="form-input"
            defaultValue={about.paragraphes}
            rows={10}
            style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.7, resize: "vertical" }}
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
