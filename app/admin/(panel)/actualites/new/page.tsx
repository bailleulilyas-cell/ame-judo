import type { Metadata } from "next";
import Link from "next/link";
import { createActualite } from "@/lib/actions/actualites";
import ActualiteForm from "@/components/ActualiteForm";

export const metadata: Metadata = {
  title: "Nouvelle actualité",
  robots: { index: false },
};

export default function NewActualitePage() {
  return (
    <>
      <Link
        href="/admin/actualites"
        style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 24, display: "inline-block" }}
      >
        ← Toutes les actualités
      </Link>
      <h1 className="admin-h1">Nouvelle actualité</h1>
      <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", marginBottom: 40, marginTop: -16 }}>
        Vous pouvez enregistrer comme brouillon (non visible) et publier plus tard.
      </p>
      <ActualiteForm action={createActualite} mode="create" />
    </>
  );
}
