import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import BureauForm from "@/components/BureauForm";
import { getBureauMembreById, updateBureauMembre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Modifier un membre du bureau", robots: { index: false } };

export default async function EditBureauMembre({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const membre = await getBureauMembreById(id);
  if (!membre) notFound();
  const update = updateBureauMembre.bind(null, id);

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${membre.prenom} ${membre.nom}</em>`}
        backHref="/admin/bureau"
        backLabel="Tout le bureau"
      />
      <BureauForm action={update} membre={membre} mode="edit" />
    </>
  );
}
