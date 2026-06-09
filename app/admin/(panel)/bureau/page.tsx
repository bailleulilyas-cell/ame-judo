import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import { getBureauAdmin, deleteBureauMembre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Bureau — Admin", robots: { index: false } };

export default async function BureauAdminList() {
  const membres = await getBureauAdmin();

  return (
    <>
      <AdminPageHeader
        title="Le <em>bureau</em>"
        description="Les membres du bureau affichés sur la page Contact. Vous pouvez ajouter, modifier et supprimer chaque profil."
        action={
          <Link href="/admin/bureau/new" className="btn btn-primary">
            + Nouveau membre
            <span className="btn-dot" aria-hidden />
          </Link>
        }
      />

      {membres.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Aucun membre du bureau pour l&apos;instant.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {membres.map((m) => (
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
                    alt={`${m.prenom} ${m.nom}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <div>
                <strong style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 17 }}>{m.prenom} {m.nom}</strong>
                <div style={{ fontSize: 13, color: "var(--stone)" }}>{m.poste}</div>
              </div>
              <Link
                href={`/admin/bureau/${m.id}`}
                style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid var(--hair-strong)" }}
              >
                Modifier
              </Link>
              <form action={deleteBureauMembre} style={{ display: "inline", position: "relative" }}>
                <input type="hidden" name="id" value={m.id} />
                <DeleteButton message="Supprimer ce membre ?" itemName={`${m.prenom} ${m.nom}`} />
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
