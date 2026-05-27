import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import { getDocumentsAdmin } from "@/lib/data";
import { deleteDocument } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "Documents — Admin", robots: { index: false } };

export default async function DocumentsAdminList({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const documents = await getDocumentsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Documents <em>à fournir</em>"
        description="Les documents que les futurs adhérents peuvent télécharger depuis la page Adhésion."
        action={
          <Link href="/admin/documents/new" className="btn btn-primary">
            + Nouveau document
          </Link>
        }
        saved={sp.saved === "1" || sp.deleted === "1"}
      />

      {documents.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Aucun document. Cliquez sur « Nouveau document » pour en ajouter.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {documents.map((d) => (
            <div
              key={d.id}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr auto auto",
                gap: 20,
                padding: "18px 24px",
                background: "var(--paper)",
                border: "1px solid var(--hair-color)",
                alignItems: "center",
                opacity: d.active ? 1 : 0.5,
              }}
            >
              <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 32, color: "var(--red)", textAlign: "center" }}>
                {d.kanji || "•"}
              </span>
              <div>
                <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 19, margin: 0 }}>
                  {d.nom}
                  {!d.active && (
                    <span style={{ marginLeft: 10, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)", border: "1px solid var(--hair-color)", padding: "2px 8px", verticalAlign: "middle" }}>
                      Inactif
                    </span>
                  )}
                </h2>
                <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", margin: "2px 0 4px", fontSize: 14 }}>
                  {d.description || "Pas de description."}
                </p>
                <p style={{ fontSize: 11, color: "var(--stone-soft, #B8B0A0)", margin: 0, wordBreak: "break-all" }}>
                  {d.url === "#" ? "⚠ Lien à compléter" : d.url}
                </p>
              </div>
              <Link
                href={`/admin/documents/${d.id}`}
                style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--sumi)" }}
              >
                Modifier →
              </Link>
              <form action={deleteDocument.bind(null, d.id)}>
                <DeleteButton label="Supprimer" itemName={d.nom} />
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
