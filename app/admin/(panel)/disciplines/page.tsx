import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getDisciplinesAdmin } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Le judo — Admin", robots: { index: false } };

export default async function DisciplinesAdminList() {
  const disciplines = await getDisciplinesAdmin();
  return (
    <>
      <AdminPageHeader
        title="Le <em>judo</em>"
        description="Présentation de la discipline enseignée au club. Texte modifiable."
      />

      {disciplines.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Base MySQL non configurée.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {disciplines.map((d) => (
            <Link
              key={d.id}
              href={`/admin/disciplines/${d.id}`}
              style={{
                display: "flex", gap: 24, padding: "20px 24px",
                background: "var(--paper)", border: "1px solid var(--hair-color)",
                alignItems: "center",
              }}
            >
              <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 36 }}>{d.kanji}</span>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22, margin: 0 }}>{d.nom}</h2>
                <p style={{ color: "var(--stone)", fontStyle: "italic", margin: "2px 0 0", fontSize: 14 }}>{d.sens}</p>
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
