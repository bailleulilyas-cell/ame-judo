import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import MaitreForm from "@/components/MaitreForm";
import { getMaitreById, updateMaitre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Modifier un maître", robots: { index: false } };

export default async function EditMaitre({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const maitre = await getMaitreById(id);
  if (!maitre) notFound();
  const update = updateMaitre.bind(null, id);

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${maitre.nom}</em>`}
        backHref="/admin/maitres"
        backLabel="Tous les maîtres"
      />
      <MaitreForm action={update} maitre={maitre} mode="edit" />
    </>
  );
}
