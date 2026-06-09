import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import BureauForm from "@/components/BureauForm";
import { createBureauMembre } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Nouveau membre du bureau", robots: { index: false } };

export default function NewBureauMembrePage() {
  return (
    <>
      <AdminPageHeader
        title="Nouveau <em>membre du bureau</em>"
        backHref="/admin/bureau"
        backLabel="Tout le bureau"
      />
      <BureauForm action={createBureauMembre} mode="create" />
    </>
  );
}
