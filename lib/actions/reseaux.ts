"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { isSocialPlatform } from "@/lib/socials";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Non autorisé.");
}

function refresh() {
  // Le pied de page apparaît sur toutes les pages : on rafraîchit tout.
  revalidatePath("/", "layout");
  revalidatePath("/admin/reseaux");
}

interface SocialFields {
  plateforme: string;
  url: string;
  ordre: number;
  active: boolean;
}

function extractFields(formData: FormData): { ok: true; data: SocialFields } | { ok: false; error: string } {
  const plateforme = String(formData.get("plateforme") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const ordreRaw = String(formData.get("ordre") ?? "0").trim();
  const active = formData.get("active") === "on" || formData.get("active") === "1";

  if (!isSocialPlatform(plateforme)) return { ok: false, error: "Plateforme invalide." };
  if (!url) return { ok: false, error: "L'URL est obligatoire." };
  if (url.length > 500) return { ok: false, error: "URL trop longue (max 500 caractères)." };
  if (!/^https?:\/\//i.test(url)) return { ok: false, error: "L'URL doit commencer par http:// ou https://" };

  const ordre = Number(ordreRaw);
  if (!Number.isFinite(ordre)) return { ok: false, error: "Ordre invalide." };

  return { ok: true, data: { plateforme, url, ordre, active } };
}

export async function createSocialLink(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");

  const parsed = extractFields(formData);
  if (!parsed.ok) {
    redirect(`/admin/reseaux/new?error=${encodeURIComponent(parsed.error)}`);
  }
  const d = parsed.data;

  await query(
    "INSERT INTO reseaux_sociaux (plateforme, url, ordre, active) VALUES (?, ?, ?, ?)",
    [d.plateforme, d.url, d.ordre, d.active ? 1 : 0]
  );

  refresh();
  redirect("/admin/reseaux?saved=1");
}

export async function updateSocialLink(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");

  const parsed = extractFields(formData);
  if (!parsed.ok) {
    redirect(`/admin/reseaux/${id}?error=${encodeURIComponent(parsed.error)}`);
  }
  const d = parsed.data;

  await query(
    "UPDATE reseaux_sociaux SET plateforme = ?, url = ?, ordre = ?, active = ? WHERE id = ?",
    [d.plateforme, d.url, d.ordre, d.active ? 1 : 0, id]
  );

  refresh();
  redirect("/admin/reseaux?saved=1");
}

export async function deleteSocialLink(id: string) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");

  await query("DELETE FROM reseaux_sociaux WHERE id = ?", [id]);
  refresh();
  redirect("/admin/reseaux?deleted=1");
}
