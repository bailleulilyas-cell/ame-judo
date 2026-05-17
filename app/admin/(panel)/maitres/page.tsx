import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import { getMaitresAdmin, deleteMaitre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Maîtres — Admin", robots: { index: false } };

export default async function MaitresAdminList() {
  const maitres = await getMaitresAdmin();

  return (
    <>
      <AdminPageHeader
        title="Les <em>maîtres</em>"
        description="Équipe enseignante du club. Vous pouvez ajouter, modifier et supprimer chaque profil."
        action={
          <Link href="/admin/maitres/new" className="btn btn-primary">
            + Nouveau maître
            <span className="btn-dot" aria-hidden />
          </Link>
        }
      />

      {maitres.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Aucun maître pour l&apos;instant.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {maitres.map((m) => (
            <div
              key={m.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto auto",
                gap: 20,
                alignItems: "center",
                padding: 16,
                background: "var(--paper)",
                border: "1px solid var(--hair-color)",
              }}
            >
              <div
                style={{
                  width: 64, height: 64,
                  background: "var(--bg-warm)",
                  border: "1px solid var(--hair-color)",
                  overflow: "hidden",
                }}
              >
                {m.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo_url}
                    alt={m.nom}
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }}
                  />
                )}
              </div>
              <div>
                <strong style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 17 }}>{m.nom}</strong>
                <div style={{ fontSize: 13, color: "var(--stone)" }}>{m.role}</div>
                <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>{m.grade} · {m.annees} ans</div>
              </div>
              <Link
                href={`/admin/maitres/${m.id}`}
                style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid var(--hair-strong)" }}
              >
                Modifier
              </Link>
              <form action={deleteMaitre} style={{ display: "inline", position: "relative" }}>
                <input type="hidden" name="id" value={m.id} />
                <DeleteButton message="Supprimer ce maître ?" itemName={m.nom} />
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
