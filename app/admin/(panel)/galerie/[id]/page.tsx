import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import GalerieForm from "@/components/GalerieForm";
import { getGaleriePhotoById, updateGaleriePhoto } from "@/lib/actions/galerie";

export const metadata: Metadata = { title: "Modifier une photo — Admin", robots: { index: false } };

export default async function EditGaleriePhoto({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const photo = await getGaleriePhotoById(id);
  if (!photo) notFound();

  return (
    <>
      <AdminPageHeader
        title="Modifier une <em>photo</em>"
        backHref="/admin/galerie"
        backLabel="Retour à la galerie"
      />
      <GalerieForm action={updateGaleriePhoto.bind(null, id)} photo={photo} mode="edit" error={error} />
    </>
  );
}
