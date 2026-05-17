import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActualiteById,
  updateActualite,
} from "@/lib/actions/actualites";
import ActualiteForm from "@/components/ActualiteForm";

export const metadata: Metadata = {
  title: "Modifier une actualité",
  robots: { index: false },
};

export default async function EditActualitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actualite = await getActualiteById(id);
  if (!actualite) notFound();

  const update = updateActualite.bind(null, id);

  return (
    <>
      <Link
        href="/admin/actualites"
        style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 24, display: "inline-block" }}
      >
        ← Toutes les actualités
      </Link>
      <h1 className="admin-h1">Modifier l&apos;actualité</h1>
      <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", marginBottom: 24, marginTop: -16 }}>
        <Link href={`/actualites/${actualite.slug}`} target="_blank" style={{ borderBottom: "1px solid var(--hair-strong)" }}>
          Voir sur le site public ↗
        </Link>
      </p>
      <ActualiteForm action={update} actualite={actualite} mode="edit" />
    </>
  );
}
