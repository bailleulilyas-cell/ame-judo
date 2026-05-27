"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Non autorisé.");
}

function refresh() {
  revalidatePath("/adhesion");
  revalidatePath("/admin/documents");
}

interface DocFields {
  nom: string;
  description: string;
  kanji: string;
  url: string;
  ordre: number;
  active: boolean;
}

function extractFields(formData: FormData): { ok: true; data: DocFields } | { ok: false; error: string } {
  const nom = String(formData.get("nom") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const kanji = String(formData.get("kanji") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const ordreRaw = String(formData.get("ordre") ?? "0").trim();
  const active = formData.get("active") === "on" || formData.get("active") === "1";

  if (!nom) return { ok: false, error: "Le nom est obligatoire." };
  if (nom.length > 120) return { ok: false, error: "Le nom est trop long (max 120 caractères)." };
  if (!url) return { ok: false, error: "L'URL ou le fichier est obligatoire." };
  if (url.length > 500) return { ok: false, error: "URL trop longue." };
  if (kanji.length > 8) return { ok: false, error: "Le kanji ne peut excéder 8 caractères." };

  const ordre = Number(ordreRaw);
  if (!Number.isFinite(ordre)) return { ok: false, error: "Ordre invalide." };

  return { ok: true, data: { nom, description, kanji, url, ordre, active } };
}

export async function createDocument(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");

  const parsed = extractFields(formData);
  if (!parsed.ok) {
    redirect(`/admin/documents/new?error=${encodeURIComponent(parsed.error)}`);
  }
  const d = parsed.data;

  await query(
    "INSERT INTO documents (ordre, nom, description, kanji, url, active) VALUES (?, ?, ?, ?, ?, ?)",
    [d.ordre, d.nom, d.description || null, d.kanji || null, d.url, d.active ? 1 : 0]
  );

  refresh();
  redirect("/admin/documents?saved=1");
}

export async function updateDocument(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");

  const parsed = extractFields(formData);
  if (!parsed.ok) {
    redirect(`/admin/documents/${id}?error=${encodeURIComponent(parsed.error)}`);
  }
  const d = parsed.data;

  await query(
    "UPDATE documents SET ordre = ?, nom = ?, description = ?, kanji = ?, url = ?, active = ? WHERE id = ?",
    [d.ordre, d.nom, d.description || null, d.kanji || null, d.url, d.active ? 1 : 0, id]
  );

  refresh();
  redirect("/admin/documents?saved=1");
}

export async function deleteDocument(id: string) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base de données indisponible.");

  await query("DELETE FROM documents WHERE id = ?", [id]);
  refresh();
  redirect("/admin/documents?deleted=1");
}
