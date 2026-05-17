import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getFormulesAdmin } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Formules — Admin", robots: { index: false } };

export default async function FormulesAdminList() {
  const formules = await getFormulesAdmin();

  return (
    <>
      <AdminPageHeader
        title="Formules d&apos;<em>adhésion</em>"
        description="Trois formules fixes (Baby, Benjamin, Senior). Les tarifs et descriptions sont modifiables ; l'ajout/suppression nécessite une intervention technique."
      />

      {formules.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Base MySQL non configurée.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {formules.map((f) => (
            <Link
              key={f.id}
              href={`/admin/formules/${f.id}`}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 120px auto",
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
              <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--sumi)" }}>
                Modifier →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
