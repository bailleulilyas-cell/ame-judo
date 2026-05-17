import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllActualitesAdmin,
  togglePublishActualite,
  deleteActualite,
} from "@/lib/actions/actualites";
import DeleteButton from "@/components/DeleteButton";

export const metadata: Metadata = {
  title: "Actualités — Admin",
  robots: { index: false },
};

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

export default async function AdminActualitesList() {
  const actus = await getAllActualitesAdmin();

  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <h1 className="admin-h1" style={{ margin: 0 }}>Actualités</h1>
        <Link href="/admin/actualites/new" className="btn btn-primary">
          + Nouvelle actualité
          <span className="btn-dot" aria-hidden />
        </Link>
      </div>

      {!DB_READY && (
        <div style={{ background: "rgba(200,51,42,0.06)", borderLeft: "3px solid var(--red)", padding: "16px 20px", marginBottom: 32, fontFamily: "var(--serif)", fontSize: 14 }}>
          <strong>Base MySQL non configurée.</strong> Renseignez DB_HOST / DB_NAME dans <code style={{ background: "var(--paper)", padding: "2px 6px" }}>.env.local</code>, puis importez <code style={{ background: "var(--paper)", padding: "2px 6px" }}>db/schema.sql</code>.
        </div>
      )}

      {actus.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", marginTop: 24 }}>
          {DB_READY
            ? "Aucune actualité. Cliquez sur « Nouvelle actualité » pour publier la première."
            : "Aucune actualité ne peut s'afficher tant que la base n'est pas connectée."}
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hair-strong)" }}>
                {["", "Titre", "Catégorie", "Date", "Statut", "Actions"].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: i === 5 ? "right" : "left",
                      padding: "10px 14px",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--stone)",
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actus.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid var(--hair-color)" }}>
                  <td style={{ padding: "14px", fontFamily: "var(--serif-jp)", fontSize: 22 }} lang="ja">{a.kanji}</td>
                  <td style={{ padding: "14px" }}>
                    <Link href={`/admin/actualites/${a.id}`} style={{ fontWeight: 500 }}>
                      {a.titre}
                    </Link>
                    <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2, fontFamily: "ui-monospace, monospace" }}>
                      /{a.slug}
                    </div>
                  </td>
                  <td style={{ padding: "14px", color: "var(--stone)" }}>{a.categorie}</td>
                  <td style={{ padding: "14px", color: "var(--stone)", fontFeatureSettings: "'tnum'" }}>
                    {new Date(a.date_publication).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                        color: a.statut === "published" ? "#2D7D46" : "var(--stone)",
                        padding: "3px 8px",
                        background: a.statut === "published" ? "rgba(45,125,70,0.08)" : "var(--paper)",
                        border: `1px solid ${a.statut === "published" ? "rgba(45,125,70,0.25)" : "var(--hair-color)"}`,
                      }}
                    >
                      {a.statut === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/actualites/${a.id}`}
                        style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sumi)", padding: "6px 10px", border: "1px solid var(--hair-strong)" }}
                      >
                        Modifier
                      </Link>
                      <form action={togglePublishActualite} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={a.id} />
                        <button
                          type="submit"
                          style={{
                            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                            background: a.statut === "published" ? "var(--paper)" : "var(--sumi)",
                            color: a.statut === "published" ? "var(--sumi)" : "var(--bg)",
                            padding: "6px 10px",
                            border: "1px solid var(--sumi)",
                            cursor: "pointer",
                          }}
                        >
                          {a.statut === "published" ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                      <ConfirmDeleteForm id={String(a.id)} titre={a.titre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ConfirmDeleteForm({ id, titre }: { id: string; titre: string }) {
  return (
    <form action={deleteActualite} style={{ display: "inline", position: "relative" }}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton message="Supprimer définitivement cette actualité ?" itemName={titre} />
    </form>
  );
}
