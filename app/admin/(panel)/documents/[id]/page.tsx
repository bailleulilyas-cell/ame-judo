import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import DocumentForm from "@/components/DocumentForm";
import { getDocumentById } from "@/lib/data";
import { updateDocument } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "Modifier document — Admin", robots: { index: false } };

export default async function EditDocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const doc = await getDocumentById(id);
  if (!doc) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${doc.nom}</em>`}
        backHref="/admin/documents"
        backLabel="Retour à la liste"
      />
      <DocumentForm
        document={doc}
        action={updateDocument.bind(null, id)}
        error={error}
      />
    </>
  );
}
