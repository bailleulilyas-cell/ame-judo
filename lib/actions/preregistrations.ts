"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import type { Preregistration } from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);
const VALID_STATUS = ["pending", "contacted", "accepted", "rejected"] as const;
const VALID_PLANS = ["baby", "benjamin", "senior"] as const;

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Non autorisé.");
}

export async function getPreregistrationById(id: string): Promise<Preregistration | null> {
  if (!DB_READY) return null;
  try {
    return await queryOne<Preregistration>("SELECT * FROM preregistrations WHERE id = ?", [id]);
  } catch { return null; }
}

export async function updatePreregistration(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const birthDate = String(formData.get("birth_date") ?? "");
  const plan = String(formData.get("plan") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const parentName = String(formData.get("parent_name") ?? "").trim() || null;
  const parentRelation = String(formData.get("parent_relation") ?? "").trim() || null;

  if (!fullName) throw new Error("Nom requis.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email invalide.");
  if (!birthDate) throw new Error("Date de naissance requise.");
  if (!VALID_PLANS.includes(plan as typeof VALID_PLANS[number])) throw new Error("Formule invalide.");
  if (!VALID_STATUS.includes(status as typeof VALID_STATUS[number])) throw new Error("Statut invalide.");

  const souhaitCompetition = formData.get("souhait_competition") === "1" ? 1 : 0;

  await query(
    "UPDATE preregistrations SET full_name = ?, email = ?, phone = ?, birth_date = ?, plan = ?, status = ?, notes = ?, parent_name = ?, parent_relation = ?, souhait_competition = ? WHERE id = ?",
    [fullName, email, phone, birthDate, plan, status, notes, parentName, parentRelation, souhaitCompetition, id]
  );

  revalidatePath("/admin/preregistrations");
  redirect("/admin/preregistrations");
}

export async function updateStatus(id: string, status: string) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  if (!VALID_STATUS.includes(status as typeof VALID_STATUS[number])) throw new Error("Statut invalide.");

  await query("UPDATE preregistrations SET status = ? WHERE id = ?", [status, id]);
  revalidatePath("/admin/preregistrations");
}

export async function deletePreregistration(id: string) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query("DELETE FROM preregistrations WHERE id = ?", [id]);
  revalidatePath("/admin/preregistrations");
}
