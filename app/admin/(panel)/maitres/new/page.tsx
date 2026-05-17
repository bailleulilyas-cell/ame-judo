import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import MaitreForm from "@/components/MaitreForm";
import { createMaitre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Nouveau maître", robots: { index: false } };

export default function NewMaitrePage() {
  return (
    <>
      <AdminPageHeader
        title="Nouveau <em>maître</em>"
        backHref="/admin/maitres"
        backLabel="Tous les maîtres"
      />
      <MaitreForm action={createMaitre} mode="create" />
    </>
  );
}
