import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import { getFormulesAdmin, deleteFormule } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Formules — Admin", robots: { index: false } };

export default async function FormulesAdminList() {
  const formules = await getFormulesAdmin();

  return (
    <>
      <AdminPageHeader
        title="Formules d&apos;<em>adhésion</em>"
        description="Les formules d'adhésion proposées sur la page Adhésion. Modifiez, ajoutez ou supprimez librement."
        action={
          <Link href="/admin/formules/new" className="btn btn-primary">
            + Nouvelle formule
          </Link>
        }
      />

      {formules.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Aucune formule. Cliquez sur « Nouvelle formule » pour en ajouter une.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {formules.map((f) => (
            <div
              key={f.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 110px auto auto",
                gap: 24,
                padding: "20px 24px",
                background: "var(--paper)", border: "1px solid var(--hair-color)",
                alignItems: "center",
              }}
            >
              <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 36, textAlign: "center" }}>{f.kanji}</span>
              <div>
                <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 20, margin: 0 }}>{f.nom}</h2>
                <p style={{ color: "var(--stone)", margin: "2px 0 0", fontSize: 13 }}>{f.tranche_age}</p>
                <p style={{ color: "var(--stone)", margin: "4px 0 0", fontSize: 12, fontStyle: "italic" }}>{f.italique}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, fontFeatureSettings: "'tnum'" }}>
                  {f.prix}<span style={{ fontSize: 14, color: "var(--stone)" }}>€</span>
                </span>
              </div>
              <Link
                href={`/admin/formules/${f.id}`}
                style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--sumi)" }}
              >
                Modifier →
              </Link>
              <form action={deleteFormule.bind(null, f.id)}>
                <DeleteButton label="Supprimer" itemName={f.nom} />
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
