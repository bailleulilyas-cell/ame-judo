import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import { getGalerieAdmin, deleteGaleriePhoto } from "@/lib/actions/galerie";

export const metadata: Metadata = { title: "Galerie — Admin", robots: { index: false } };

export default async function GalerieAdminList({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const photos = await getGalerieAdmin();

  return (
    <>
      <AdminPageHeader
        title="La <em>galerie</em>"
        description="Les photos du club, affichées sur l'accueil (les 6 premières) et sur la page Galerie. Toutes orientations acceptées."
        action={
          <Link href="/admin/galerie/new" className="btn btn-primary">
            + Ajouter une photo
          </Link>
        }
        saved={sp.saved === "1" || sp.deleted === "1"}
      />

      {photos.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Aucune photo. Cliquez sur « Ajouter une photo ».
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {photos.map((p) => (
            <div key={p.id} style={{ border: "1px solid var(--hair-color)", background: "var(--paper)" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: "var(--bg-warm)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.legende ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(10,10,10,0.7)", color: "#fff", fontSize: 11, padding: "2px 7px", borderRadius: 4 }}>
                  #{p.ordre}
                </span>
              </div>
              <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <Link href={`/admin/galerie/${p.id}`} style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sumi)" }}>
                  Modifier
                </Link>
                <form action={deleteGaleriePhoto.bind(null, p.id)}>
                  <DeleteButton label="Suppr." itemName={p.legende || "cette photo"} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
