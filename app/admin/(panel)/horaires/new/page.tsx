import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import SlotForm from "@/components/SlotForm";
import { createSlot, getDisciplinesAdmin } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Nouveau créneau", robots: { index: false } };

export default async function NewSlotPage() {
  const disciplines = await getDisciplinesAdmin();
  return (
    <>
      <AdminPageHeader
        title="Nouveau <em>créneau</em>"
        backHref="/admin/horaires"
        backLabel="Tous les créneaux"
      />
      <SlotForm action={createSlot} disciplines={disciplines} mode="create" />
    </>
  );
}
