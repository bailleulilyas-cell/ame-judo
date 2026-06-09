import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import GalerieForm from "@/components/GalerieForm";
import { createGaleriePhoto } from "@/lib/actions/galerie";

export const metadata: Metadata = { title: "Ajouter une photo — Admin", robots: { index: false } };

export default async function NewGaleriePhotoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <AdminPageHeader
        title="Ajouter une <em>photo</em>"
        backHref="/admin/galerie"
        backLabel="Retour à la galerie"
      />
      <GalerieForm action={createGaleriePhoto} mode="create" error={error} />
    </>
  );
}
