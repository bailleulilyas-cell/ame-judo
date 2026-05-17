"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import type { Actualite } from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritiques (accents) après NFD
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "actualite";
}

async function requireAuth() {
  if (!(await isAuthenticated())) {
    throw new Error("Non autorisé.");
  }
}

function refreshPublicCache() {
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  const sql = excludeId
    ? "SELECT id FROM actualites WHERE slug = ? AND id <> ? LIMIT 1"
    : "SELECT id FROM actualites WHERE slug = ? LIMIT 1";
  const params = excludeId ? [slug, excludeId] : [slug];
  const existing = await query<{ id: string }>(sql, params);
  return existing.length > 0 ? `${slug}-${Date.now().toString(36)}` : slug;
}

function extractFields(formData: FormData) {
  const titre = (formData.get("titre") as string)?.trim() ?? "";
  if (!titre) throw new Error("Le titre est obligatoire.");
  if (titre.length > 255) throw new Error("Le titre ne doit pas dépasser 255 caractères.");

  const extrait = ((formData.get("extrait") as string) ?? "").trim();
  if (!extrait) throw new Error("L'extrait est obligatoire (1 à 2 phrases visibles sur la liste).");

  const body = ((formData.get("body") as string) ?? "").trim();
  if (!body) throw new Error("Le contenu de l'article est obligatoire.");

  const datePub = ((formData.get("date_publication") as string) ?? "").trim();
  // Vérifie le format YYYY-MM-DD si fourni
  if (datePub && !/^\d{4}-\d{2}-\d{2}$/.test(datePub)) {
    throw new Error("Format de date invalide (attendu : AAAA-MM-JJ).");
  }

  return {
    titre,
    kanji: ((formData.get("kanji") as string) ?? "").trim().slice(0, 2) || "報",
    categorie: ((formData.get("categorie") as string) ?? "").trim() || "Actualité",
    date_publication: datePub || new Date().toISOString().slice(0, 10),
    extrait,
    body,
    photo_url: ((formData.get("photo_url") as string) ?? "").trim() || null,
    statut: (formData.get("statut") as string) === "published" ? "published" as const : "draft" as const,
    slugInput: ((formData.get("slug") as string) ?? "").trim(),
  };
}

export async function createActualite(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base MySQL non configurée — voir README.");

  const f = extractFields(formData);
  const slug = await ensureUniqueSlug(f.slugInput || slugify(f.titre));

  await query(
    "INSERT INTO actualites (kanji, categorie, date_publication, titre, slug, extrait, body, photo_url, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [f.kanji, f.categorie, f.date_publication, f.titre, slug, f.extrait, f.body, f.photo_url, f.statut]
  );

  refreshPublicCache();
  redirect("/admin/actualites");
}

export async function updateActualite(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base MySQL non configurée.");

  const f = extractFields(formData);
  const slug = await ensureUniqueSlug(f.slugInput || slugify(f.titre), id);

  await query(
    `UPDATE actualites SET kanji = ?, categorie = ?, date_publication = ?, titre = ?, slug = ?, extrait = ?, body = ?, photo_url = ?, statut = ? WHERE id = ?`,
    [f.kanji, f.categorie, f.date_publication, f.titre, slug, f.extrait, f.body, f.photo_url, f.statut, id]
  );

  refreshPublicCache();
  redirect("/admin/actualites");
}

export async function togglePublishActualite(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base MySQL non configurée.");
  const id = formData.get("id") as string;
  await query(
    "UPDATE actualites SET statut = IF(statut = 'published', 'draft', 'published') WHERE id = ?",
    [id]
  );
  refreshPublicCache();
}

export async function deleteActualite(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base MySQL non configurée.");
  const id = formData.get("id") as string;
  await query("DELETE FROM actualites WHERE id = ?", [id]);
  refreshPublicCache();
}

export async function getActualiteById(id: string): Promise<Actualite | null> {
  if (!DB_READY) return null;
  try {
    return await queryOne<Actualite>("SELECT * FROM actualites WHERE id = ? LIMIT 1", [id]);
  } catch {
    return null;
  }
}

export async function getAllActualitesAdmin(): Promise<Actualite[]> {
  if (!DB_READY) return [];
  try {
    return await query<Actualite>("SELECT * FROM actualites ORDER BY date_publication DESC, id DESC");
  } catch {
    return [];
  }
}
