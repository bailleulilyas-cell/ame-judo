"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import type { GaleriePhoto } from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Non autorisé.");
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/galerie");
  revalidatePath("/admin/galerie");
}

export async function getGalerieAdmin(): Promise<GaleriePhoto[]> {
  if (!DB_READY) return [];
  try { return await query<GaleriePhoto>("SELECT id, ordre, url, legende FROM galerie ORDER BY ordre, id"); }
  catch { return []; }
}

export async function getGaleriePhotoById(id: string): Promise<GaleriePhoto | null> {
  if (!DB_READY) return null;
  try { return await queryOne<GaleriePhoto>("SELECT id, ordre, url, legende FROM galerie WHERE id = ?", [id]); }
  catch { return null; }
}

function fields(formData: FormData): { ok: true; url: string; legende: string | null; ordre: number } | { ok: false; error: string } {
  const url = String(formData.get("url") ?? "").trim();
  const legende = String(formData.get("legende") ?? "").trim() || null;
  const ordreRaw = String(formData.get("ordre") ?? "").trim();
  if (!url) return { ok: false, error: "Aucune photo. Téléversez une image." };
  const ordre = ordreRaw === "" ? 0 : Number(ordreRaw);
  if (!Number.isFinite(ordre)) return { ok: false, error: "Ordre invalide." };
  return { ok: true, url, legende, ordre };
}

export async function createGaleriePhoto(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");
  const f = fields(formData);
  if (!f.ok) redirect(`/admin/galerie/new?error=${encodeURIComponent(f.error)}`);

  // Ordre auto : la nouvelle photo passe en premier (ordre le plus petit).
  let ordre = f.ordre;
  if (ordre === 0) {
    const rows = await query<{ min_ordre: number | null }>("SELECT MIN(ordre) AS min_ordre FROM galerie");
    ordre = (rows[0]?.min_ordre ?? 1) - 1;
  }

  await query("INSERT INTO galerie (ordre, url, legende) VALUES (?, ?, ?)", [ordre, f.url, f.legende]);
  refresh();
  redirect("/admin/galerie?saved=1");
}

export async function updateGaleriePhoto(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");
  const f = fields(formData);
  if (!f.ok) redirect(`/admin/galerie/${id}?error=${encodeURIComponent(f.error)}`);

  await query("UPDATE galerie SET ordre = ?, url = ?, legende = ? WHERE id = ?", [f.ordre, f.url, f.legende, id]);
  refresh();
  redirect("/admin/galerie?saved=1");
}

export async function deleteGaleriePhoto(id: string) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");
  await query("DELETE FROM galerie WHERE id = ?", [id]);
  refresh();
  redirect("/admin/galerie?deleted=1");
}
