import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import DocumentForm from "@/components/DocumentForm";
import { createDocument } from "@/lib/actions/documents";

export const metadata: Metadata = { title: "Nouveau document — Admin", robots: { index: false } };

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <AdminPageHeader
        title="Nouveau <em>document</em>"
        description="Ajoutez un document que les futurs adhérents pourront télécharger."
        backHref="/admin/documents"
        backLabel="Retour à la liste"
      />
      <DocumentForm action={createDocument} error={error} />
    </>
  );
}
