import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";
import DeleteButton from "@/components/DeleteButton";
import SocialIcon from "@/components/SocialIcon";
import { getSocialLinksAdmin } from "@/lib/data";
import { deleteSocialLink } from "@/lib/actions/reseaux";
import { SOCIAL_PLATFORMS } from "@/lib/socials";

export const metadata: Metadata = { title: "Réseaux sociaux — Admin", robots: { index: false } };

export default async function ReseauxAdminList({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const links = await getSocialLinksAdmin();

  return (
    <>
      <AdminPageHeader
        title="Réseaux <em>sociaux</em>"
        description="Les liens affichés dans le pied de page du site. Choisissez la plateforme, collez l'URL — le logo apparaît automatiquement."
        action={
          <Link href="/admin/reseaux/new" className="btn btn-primary">
            + Nouveau réseau
          </Link>
        }
        saved={sp.saved === "1" || sp.deleted === "1"}
      />

      {links.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          Aucun réseau social. Cliquez sur « Nouveau réseau » pour en ajouter un.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {links.map((l) => (
            <div
              key={l.id}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr auto auto",
                gap: 20,
                padding: "18px 24px",
                background: "var(--paper)",
                border: "1px solid var(--hair-color)",
                alignItems: "center",
                opacity: l.active ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--sumi)", color: "var(--bg)",
                }}
                aria-hidden
              >
                <SocialIcon platform={l.plateforme} size={22} />
              </span>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 19, margin: 0 }}>
                  {SOCIAL_PLATFORMS[l.plateforme].label}
                  {!l.active && (
                    <span style={{ marginLeft: 10, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)", border: "1px solid var(--hair-color)", padding: "2px 8px", verticalAlign: "middle" }}>
                      Masqué
                    </span>
                  )}
                </h2>
                <p style={{ fontSize: 12, color: "var(--stone)", margin: "2px 0 0", wordBreak: "break-all" }}>
                  {l.url}
                </p>
              </div>
              <Link
                href={`/admin/reseaux/${l.id}`}
                style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--sumi)" }}
              >
                Modifier →
              </Link>
              <form action={deleteSocialLink.bind(null, l.id)}>
                <DeleteButton label="Supprimer" itemName={SOCIAL_PLATFORMS[l.plateforme].label} />
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
