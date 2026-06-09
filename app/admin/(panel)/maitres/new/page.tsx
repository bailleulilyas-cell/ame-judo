import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import MaitreForm from "@/components/MaitreForm";
import { createMaitre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Nouvel enseignant", robots: { index: false } };

export default function NewMaitrePage() {
  return (
    <>
      <AdminPageHeader
        title="Nouvel <em>enseignant</em>"
        backHref="/admin/maitres"
        backLabel="Tous les enseignants"
      />
      <MaitreForm action={createMaitre} mode="create" />
    </>
  );
}
