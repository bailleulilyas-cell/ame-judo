"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import type { Discipline, ScheduleSlot, Maitre, Formule } from "@/types";
import type { HeroContent, AboutContent } from "@/lib/cms-types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Non autorisé.");
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/judo");
  revalidatePath("/horaires");
  revalidatePath("/maitres");
  revalidatePath("/adhesion");
  revalidatePath("/contact");
}

// ═══════════════════════════════════════════════════════════
// HERO (singleton)
// ═══════════════════════════════════════════════════════════
export async function getHero(): Promise<HeroContent | null> {
  if (!DB_READY) return null;
  try {
    return await queryOne<HeroContent>("SELECT * FROM hero_content WHERE id = 1");
  } catch { return null; }
}

export async function updateHero(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query(
    `UPDATE hero_content SET
      proverbe_jp = ?, proverbe_fr = ?, eyebrow = ?, titre = ?, sous_titre = ?,
      stat1_num = ?, stat1_label = ?, stat2_num = ?, stat2_label = ?, stat3_num = ?, stat3_label = ?
     WHERE id = 1`,
    [
      String(formData.get("proverbe_jp") ?? "").trim(),
      String(formData.get("proverbe_fr") ?? "").trim(),
      String(formData.get("eyebrow") ?? "").trim(),
      String(formData.get("titre") ?? "").trim(),
      String(formData.get("sous_titre") ?? "").trim(),
      String(formData.get("stat1_num") ?? "").trim(),
      String(formData.get("stat1_label") ?? "").trim(),
      String(formData.get("stat2_num") ?? "").trim(),
      String(formData.get("stat2_label") ?? "").trim(),
      String(formData.get("stat3_num") ?? "").trim(),
      String(formData.get("stat3_label") ?? "").trim(),
    ]
  );
  refresh();
  redirect("/admin/hero?ok=1");
}

// ═══════════════════════════════════════════════════════════
// ABOUT (singleton)
// ═══════════════════════════════════════════════════════════
export async function getAbout(): Promise<AboutContent | null> {
  if (!DB_READY) return null;
  try {
    return await queryOne<AboutContent>("SELECT * FROM about_content WHERE id = 1");
  } catch { return null; }
}

export async function updateAbout(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query(
    `UPDATE about_content SET citation = ?, attribution = ?, titre = ?, paragraphes = ? WHERE id = 1`,
    [
      String(formData.get("citation") ?? "").trim(),
      String(formData.get("attribution") ?? "").trim(),
      String(formData.get("titre") ?? "").trim(),
      String(formData.get("paragraphes") ?? "").trim(),
    ]
  );
  refresh();
  redirect("/admin/about?ok=1");
}

// ═══════════════════════════════════════════════════════════
// SETTINGS (footer / contact)
// ═══════════════════════════════════════════════════════════
export async function updateSettings(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query(
    `UPDATE settings SET
       adresse_ligne1 = ?, adresse_ligne2 = ?, adresse_ligne3 = ?,
       email = ?, telephone = ?, permanence = ?
     WHERE id = 1`,
    [
      String(formData.get("adresse_ligne1") ?? "").trim(),
      String(formData.get("adresse_ligne2") ?? "").trim(),
      String(formData.get("adresse_ligne3") ?? "").trim(),
      String(formData.get("email") ?? "").trim(),
      String(formData.get("telephone") ?? "").trim() || null,
      String(formData.get("permanence") ?? "").trim(),
    ]
  );
  refresh();
  redirect("/admin/parametres?ok=1");
}

// ═══════════════════════════════════════════════════════════
// DISCIPLINES (3 fixes, édition seulement)
// ═══════════════════════════════════════════════════════════
export async function getDisciplinesAdmin(): Promise<Discipline[]> {
  if (!DB_READY) return [];
  try { return await query<Discipline>("SELECT * FROM disciplines ORDER BY ordre"); }
  catch { return []; }
}

export async function getDisciplineById(id: string): Promise<Discipline | null> {
  if (!DB_READY) return null;
  try { return await queryOne<Discipline>("SELECT * FROM disciplines WHERE id = ?", [id]); }
  catch { return null; }
}

export async function updateDiscipline(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query(
    `UPDATE disciplines SET kanji = ?, nom = ?, sens = ?, tagline = ?, body = ?, origine = ? WHERE id = ?`,
    [
      String(formData.get("kanji") ?? "").trim(),
      String(formData.get("nom") ?? "").trim(),
      String(formData.get("sens") ?? "").trim(),
      String(formData.get("tagline") ?? "").trim(),
      String(formData.get("body") ?? "").trim(),
      String(formData.get("origine") ?? "").trim(),
      id,
    ]
  );
  refresh();
  redirect("/admin/disciplines");
}

// ═══════════════════════════════════════════════════════════
// HORAIRES — slots CRUD + note
// ═══════════════════════════════════════════════════════════
export async function getSlotsAdmin(): Promise<ScheduleSlot[]> {
  if (!DB_READY) return [];
  try {
    return await query<ScheduleSlot>(
      "SELECT * FROM schedule_slots ORDER BY FIELD(jour,'lundi','mercredi','jeudi','samedi'), ordre"
    );
  } catch { return []; }
}

const JOUR_KANJI: Record<string, string> = { lundi: "月", mercredi: "水", jeudi: "木", samedi: "土" };

export async function createSlot(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  const jour = String(formData.get("jour") ?? "").trim();
  await query(
    `INSERT INTO schedule_slots (discipline_id, jour, jour_kanji, heure_debut, heure_fin, discipline, niveau, ordre)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Number(formData.get("discipline_id")) || null,
      jour,
      JOUR_KANJI[jour] ?? "",
      String(formData.get("heure_debut") ?? "").trim(),
      String(formData.get("heure_fin") ?? "").trim(),
      String(formData.get("discipline") ?? "").trim(),
      String(formData.get("niveau") ?? "").trim(),
      Number(formData.get("ordre")) || 0,
    ]
  );
  refresh();
  redirect("/admin/horaires");
}

export async function updateSlot(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  const jour = String(formData.get("jour") ?? "").trim();
  await query(
    `UPDATE schedule_slots SET
       discipline_id = ?, jour = ?, jour_kanji = ?, heure_debut = ?, heure_fin = ?,
       discipline = ?, niveau = ?, ordre = ?
     WHERE id = ?`,
    [
      Number(formData.get("discipline_id")) || null,
      jour,
      JOUR_KANJI[jour] ?? "",
      String(formData.get("heure_debut") ?? "").trim(),
      String(formData.get("heure_fin") ?? "").trim(),
      String(formData.get("discipline") ?? "").trim(),
      String(formData.get("niveau") ?? "").trim(),
      Number(formData.get("ordre")) || 0,
      id,
    ]
  );
  refresh();
  redirect("/admin/horaires");
}

export async function deleteSlot(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query("DELETE FROM schedule_slots WHERE id = ?", [String(formData.get("id"))]);
  refresh();
}

export async function updateHorairesNote(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query(
    `UPDATE horaires_note SET texte = ?, active = ? WHERE id = 1`,
    [
      String(formData.get("texte") ?? "").trim(),
      formData.get("active") === "on" ? 1 : 0,
    ]
  );
  refresh();
  redirect("/admin/horaires?ok=1");
}

// ═══════════════════════════════════════════════════════════
// MAÎTRES
// ═══════════════════════════════════════════════════════════
export async function getMaitresAdmin(): Promise<Maitre[]> {
  if (!DB_READY) return [];
  try { return await query<Maitre>("SELECT * FROM maitres ORDER BY ordre"); }
  catch { return []; }
}

export async function getMaitreById(id: string): Promise<Maitre | null> {
  if (!DB_READY) return null;
  try { return await queryOne<Maitre>("SELECT * FROM maitres WHERE id = ?", [id]); }
  catch { return null; }
}

function maitreFields(formData: FormData) {
  return {
    ordre: Number(formData.get("ordre")) || 0,
    nom: String(formData.get("nom") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    grade: String(formData.get("grade") ?? "").trim(),
    annees: Number(formData.get("annees")) || 0,
    citation: String(formData.get("citation") ?? "").trim(),
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
  };
}

export async function createMaitre(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  const f = maitreFields(formData);
  await query(
    `INSERT INTO maitres (ordre, nom, role, grade, annees, citation, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [f.ordre, f.nom, f.role, f.grade, f.annees, f.citation, f.photo_url]
  );
  refresh();
  redirect("/admin/maitres");
}

export async function updateMaitre(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  const f = maitreFields(formData);
  await query(
    `UPDATE maitres SET ordre = ?, nom = ?, role = ?, grade = ?, annees = ?, citation = ?, photo_url = ? WHERE id = ?`,
    [f.ordre, f.nom, f.role, f.grade, f.annees, f.citation, f.photo_url, id]
  );
  refresh();
  redirect("/admin/maitres");
}

export async function deleteMaitre(formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  await query("DELETE FROM maitres WHERE id = ?", [String(formData.get("id"))]);
  refresh();
}

// ═══════════════════════════════════════════════════════════
// FORMULES (3 fixes, édition seulement)
// ═══════════════════════════════════════════════════════════
export async function getFormulesAdmin(): Promise<Formule[]> {
  if (!DB_READY) return [];
  try { return await query<Formule>("SELECT * FROM formules ORDER BY ordre"); }
  catch { return []; }
}

export async function getFormuleById(id: string): Promise<Formule | null> {
  if (!DB_READY) return null;
  try { return await queryOne<Formule>("SELECT * FROM formules WHERE id = ?", [id]); }
  catch { return null; }
}

function formatTrancheAge(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `${min} – ${max} ans`;
  if (min !== null) return `${min} ans et +`;
  if (max !== null) return `Jusqu'à ${max} ans`;
  return "Tous âges";
}

export async function updateFormule(id: string, formData: FormData) {
  await requireAuth();
  if (!DB_READY) throw new Error("Base non configurée.");
  const ageMinRaw = String(formData.get("age_min") ?? "").trim();
  const ageMaxRaw = String(formData.get("age_max") ?? "").trim();
  const ageMin = ageMinRaw === "" ? null : Number(ageMinRaw);
  const ageMax = ageMaxRaw === "" ? null : Number(ageMaxRaw);
  if (ageMin !== null && ageMax !== null && ageMin > ageMax) {
    throw new Error("L'âge minimum doit être inférieur ou égal à l'âge maximum.");
  }
  const trancheTexte = String(formData.get("tranche_age") ?? "").trim() || formatTrancheAge(ageMin, ageMax);

  await query(
    `UPDATE formules SET kanji = ?, nom = ?, tranche_age = ?, age_min = ?, age_max = ?, prix = ?, italique = ?, slots_texte = ? WHERE id = ?`,
    [
      String(formData.get("kanji") ?? "").trim(),
      String(formData.get("nom") ?? "").trim(),
      trancheTexte,
      ageMin,
      ageMax,
      Number(formData.get("prix")) || 0,
      String(formData.get("italique") ?? "").trim(),
      String(formData.get("slots_texte") ?? "").trim(),
      id,
    ]
  );
  refresh();
  redirect("/admin/formules");
}
