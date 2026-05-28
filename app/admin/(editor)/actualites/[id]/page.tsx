import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActualiteEditor from "@/components/ActualiteEditor";
import { getActualiteById, updateActualite } from "@/lib/actions/actualites";

export const metadata: Metadata = {
  title: "Modifier l'actualité",
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
  return <ActualiteEditor mode="edit" actualite={actualite} action={update} />;
}
