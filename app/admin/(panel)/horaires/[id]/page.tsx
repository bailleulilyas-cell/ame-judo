import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import type { ScheduleSlot } from "@/types";
import AdminPageHeader from "@/components/AdminPageHeader";
import SlotForm from "@/components/SlotForm";
import { updateSlot, getDisciplinesAdmin } from "@/lib/actions/cms";

export const metadata: Metadata = { title: "Modifier un créneau", robots: { index: false } };

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

async function getSlot(id: string): Promise<ScheduleSlot | null> {
  if (!DB_READY) return null;
  try { return await queryOne<ScheduleSlot>("SELECT * FROM schedule_slots WHERE id = ?", [id]); }
  catch { return null; }
}

export default async function EditSlotPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [slot, disciplines] = await Promise.all([getSlot(id), getDisciplinesAdmin()]);
  if (!slot) notFound();
  const update = updateSlot.bind(null, id);

  return (
    <>
      <AdminPageHeader
        title="Modifier un <em>créneau</em>"
        backHref="/admin/horaires"
        backLabel="Tous les créneaux"
      />
      <SlotForm action={update} slot={slot} disciplines={disciplines} mode="edit" />
    </>
  );
}
