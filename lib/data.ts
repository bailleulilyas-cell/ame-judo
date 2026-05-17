/**
 * Couche d'accès aux données.
 *
 * Si MySQL est configuré (variables d'env présentes), on lit la base.
 * Sinon, on retourne les données de démo — utile en dev avant d'avoir
 * une base prête, et pour que le site reste navigable.
 */
import { query } from "@/lib/db";
import type {
  Discipline, ScheduleSlot, HorairesNote, Maitre,
  Formule, Actualite, FooterContent
} from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

// ─── Données de démo (fallback) ─────────────────────────────
const DEMO_DISCIPLINES: Discipline[] = [
  { id: "1", ordre: 1, kanji: "柔道", nom: "Judo", sens: "La voie de la souplesse",
    tagline: "Céder pour mieux vaincre.",
    body: "Discipline olympique fondée par Jigoro Kano en 1882. Au club, nous enseignons les randoris debout (nage-waza), le travail au sol (katame-waza) et les formes (kata). Tous niveaux de ceinture, enfants à partir de 6 ans.",
    origine: "Japon · 1882 · Jigoro Kano" },
  { id: "2", ordre: 2, kanji: "柔術", nom: "Ju-jitsu", sens: "La technique de la souplesse",
    tagline: "Le judo avant la simplification — une grammaire complète.",
    body: "Art martial traditionnel japonais, ancêtre du judo. Techniques debout et au sol, clés de bras et d'épaule, projections, étranglements. Idéal pour les adultes cherchant une pratique complète et réaliste.",
    origine: "Japon · antiquité · diverses écoles" },
  { id: "3", ordre: 3, kanji: "体操", nom: "Taïso", sens: "La gymnastique traditionnelle",
    tagline: "Souplesse, équilibre, coordination.",
    body: "Ensemble d'exercices de corps issus de la tradition martiale japonaise. Le taïso améliore la souplesse, renforce les articulations et développe la coordination. Accessible à tous les âges, il complète idéalement le judo et le ju-jitsu.",
    origine: "Japon · tradition · pratique quotidienne du dojo" },
];

const DEMO_SLOTS: ScheduleSlot[] = [
  { id: "1", discipline_id: "1", jour: "lundi",    jour_kanji: "月", heure_debut: "19:00", heure_fin: "20:30", niveau: "Judo · Adultes +14 ans", ordre: 1 },
  { id: "2", discipline_id: "1", jour: "mercredi", jour_kanji: "水", heure_debut: "17:00", heure_fin: "18:00", niveau: "Judo · 6/7 ans",         ordre: 1 },
  { id: "3", discipline_id: "1", jour: "mercredi", jour_kanji: "水", heure_debut: "18:00", heure_fin: "19:15", niveau: "Judo · 8/11 ans",        ordre: 2 },
  { id: "4", discipline_id: "3", jour: "mercredi", jour_kanji: "水", heure_debut: "19:30", heure_fin: "20:30", niveau: "Taïso · Tous niveaux",   ordre: 3 },
  { id: "5", discipline_id: "2", jour: "jeudi",    jour_kanji: "木", heure_debut: "19:30", heure_fin: "21:00", niveau: "Ju-jitsu · Adultes",     ordre: 1 },
  { id: "6", discipline_id: "1", jour: "samedi",   jour_kanji: "土", heure_debut: "11:45", heure_fin: "12:45", niveau: "Judo · 8/11 ans",        ordre: 1 },
  { id: "7", discipline_id: "2", jour: "samedi",   jour_kanji: "土", heure_debut: "18:30", heure_fin: "19:30", niveau: "Ju-jitsu · Adultes +14 ans", ordre: 2 },
];

const DEMO_MAITRES: Maitre[] = [
  { id: "1", ordre: 1, nom: "Hiroshi Tanaka", role: "Professeur principal",      grade: "5ᵉ Dan · Judo",                    annees: 32, citation: "La chute n'est pas une défaite. C'est une leçon que le tatami vous offre.", photo_url: null },
  { id: "2", ordre: 2, nom: "Marc Lefebvre",  role: "Professeur · Judo & Ju-jitsu", grade: "4ᵉ Dan Judo · 3ᵉ Dan Ju-jitsu", annees: 18, citation: "Le ju-jitsu ne cherche pas à dominer. Il cherche à comprendre.",            photo_url: null },
  { id: "3", ordre: 3, nom: "Sophie Renard",  role: "Professeure · Taïso & Éveil",  grade: "2ᵉ Dan · Judo",                annees: 11, citation: "Enseigner aux enfants, c'est leur offrir une façon de se connaître eux-mêmes.", photo_url: null },
];

const DEMO_FORMULES: Formule[] = [
  { id: "1", ordre: 1, kanji: "子", nom: "Baby Judo", tranche_age: "4 – 5 ans",   age_min: 4,  age_max: 5,    prix: 120, italique: "Éveil aux arts martiaux par le jeu.",       slots_texte: "Mercredi 17h · Samedi 10h",         plan_key: "baby" },
  { id: "2", ordre: 2, kanji: "少", nom: "Benjamin",  tranche_age: "6 – 13 ans",  age_min: 6,  age_max: 13,   prix: 170, italique: "La voie des jeunes guerriers.",             slots_texte: "Mercredi 17h-19h · Samedi 11h45",   plan_key: "benjamin" },
  { id: "3", ordre: 3, kanji: "人", nom: "Senior",    tranche_age: "14 ans et +", age_min: 14, age_max: null, prix: 210, italique: "Pratique complète, compétition au choix.",  slots_texte: "Lundi · Jeudi · Samedi soir",       plan_key: "senior" },
];

const DEMO_ACTUS: Actualite[] = [
  { id: "1", kanji: "祭", categorie: "Stage",       date_publication: "2026-04-12", titre: "Stage de printemps — compte-rendu",                 slug: "stage-printemps-2026",          extrait: "Trente-deux participants, deux jours de travail intensif sur les projections arrière.", body: "Trente-deux participants, deux jours de travail intensif sur les projections arrière. Le tatami a beaucoup parlé ce week-end.\n\nNos élèves ont travaillé les techniques suivantes : o-soto-gari, o-uchi-gari, ko-uchi-gari, et les enchaînements debout-sol.\n\nLe prochain stage est prévu en juillet.",   photo_url: null, statut: "published", created_at: "", updated_at: "" },
  { id: "2", kanji: "新", categorie: "Actualité",   date_publication: "2026-03-01", titre: "Rentrée 2026-2027 — inscriptions ouvertes",          slug: "rentree-2026-2027",             extrait: "Les pré-inscriptions pour la saison 2026-2027 sont désormais ouvertes.",                                                                                                                                                                                                                                                                                                                                                                                  body: "Les pré-inscriptions pour la saison 2026-2027 sont désormais ouvertes. Venez faire vos deux séances d'essai avant de vous engager.", photo_url: null, statut: "published", created_at: "", updated_at: "" },
  { id: "3", kanji: "勝", categorie: "Compétition", date_publication: "2026-02-10", titre: "Résultats — Championnat départemental benjamins",   slug: "championnat-departemental-2026", extrait: "Nos jeunes judokas ont brillé : trois médailles d'or, deux d'argent.",                                                                                                                                                                                                                                                                                                                                                          body: "Nos jeunes judokas ont brillé au championnat départemental. Trois médailles d'or, deux d'argent. Félicitations à tous.",            photo_url: null, statut: "published", created_at: "", updated_at: "" },
];

type Param = string | number | boolean | Date | null;

async function tryQuery<T>(sql: string, params: Param[] = []): Promise<T[] | null> {
  if (!DB_READY) return null;
  try {
    return await query<T>(sql, params);
  } catch (err) {
    console.warn("[data] MySQL indisponible, fallback démo:", (err as Error).message);
    return null;
  }
}

// ─── API ────────────────────────────────────────────────────
export async function getDisciplines(): Promise<Discipline[]> {
  const rows = await tryQuery<Discipline>("SELECT * FROM disciplines ORDER BY ordre");
  return rows ?? DEMO_DISCIPLINES;
}

export async function getDisciplineBySlug(slug: string): Promise<Discipline | null> {
  const rows = await tryQuery<Discipline>("SELECT * FROM disciplines WHERE slug = ?", [slug]);
  if (rows) return rows[0] ?? null;
  return DEMO_DISCIPLINES.find((d) => d.nom.toLowerCase().replace(/[^a-z]/g, "") === slug.replace(/[^a-z]/g, "")) ?? null;
}

export async function getSlots(): Promise<ScheduleSlot[]> {
  const rows = await tryQuery<ScheduleSlot & { discipline?: string }>(
    "SELECT id, discipline_id, jour, jour_kanji, heure_debut, heure_fin, CONCAT(discipline, ' · ', niveau) AS niveau, ordre FROM schedule_slots ORDER BY FIELD(jour,'lundi','mercredi','jeudi','samedi'), ordre"
  );
  return rows ?? DEMO_SLOTS;
}

export async function getSlotsByDiscipline(disciplineId: string): Promise<ScheduleSlot[]> {
  const all = await getSlots();
  return all.filter((s) => String(s.discipline_id) === String(disciplineId));
}

export async function getHorairesNote(): Promise<HorairesNote | null> {
  const rows = await tryQuery<HorairesNote>("SELECT id, texte, active FROM horaires_note WHERE id = 1");
  if (!rows) return null;
  const row = rows[0];
  return row && row.active ? row : null;
}

export async function getMaitres(): Promise<Maitre[]> {
  const rows = await tryQuery<Maitre>("SELECT * FROM maitres ORDER BY ordre");
  return rows ?? DEMO_MAITRES;
}

export async function getFormules(): Promise<Formule[]> {
  const rows = await tryQuery<Formule>("SELECT * FROM formules ORDER BY ordre");
  return rows ?? DEMO_FORMULES;
}

export async function getActualites(limit = 50): Promise<Actualite[]> {
  const rows = await tryQuery<Actualite>(
    "SELECT * FROM actualites WHERE statut = 'published' ORDER BY date_publication DESC LIMIT ?",
    [limit]
  );
  return rows ?? DEMO_ACTUS.slice(0, limit);
}

export async function getActualiteBySlug(slug: string): Promise<Actualite | null> {
  const rows = await tryQuery<Actualite>(
    "SELECT * FROM actualites WHERE slug = ? AND statut = 'published' LIMIT 1",
    [slug]
  );
  if (rows) return rows[0] ?? null;
  return DEMO_ACTUS.find((a) => a.slug === slug) ?? null;
}

// ─── Hero & About (singleton tables) ─────────────────────────
export async function getHeroContent() {
  const rows = await tryQuery<{
    proverbe_jp: string; proverbe_fr: string; eyebrow: string;
    titre: string; sous_titre: string;
    stat1_num: string; stat1_label: string;
    stat2_num: string; stat2_label: string;
    stat3_num: string; stat3_label: string;
  }>("SELECT * FROM hero_content WHERE id = 1");
  return rows?.[0] ?? {
    proverbe_jp: "礼に始まり、礼に終わる",
    proverbe_fr: "Tout commence par un salut, tout s'achève par un salut",
    eyebrow: "Ermont · Val-d'Oise",
    titre: "Apprendre à <em>saluer</em>,<br>à <em>vaincre</em>.",
    sous_titre: "Club d'arts martiaux ermontois depuis 1978. Judo, ju-jitsu et taïso — enseignés dans la rigueur et la sérénité, pour les enfants comme pour les adultes.",
    stat1_num: "47", stat1_label: "Années",
    stat2_num: "3",  stat2_label: "Disciplines",
    stat3_num: "2",  stat3_label: "Essais gratuits",
  };
}

export async function getAboutContent() {
  const rows = await tryQuery<{
    citation: string; attribution: string; titre: string; paragraphes: string;
  }>("SELECT * FROM about_content WHERE id = 1");
  return rows?.[0] ?? {
    citation: "Le tatami ne ment jamais. C'est sa première leçon, et sa dernière.",
    attribution: "Tradition AME",
    titre: "Une <em>maison</em> avant d'être un club.",
    paragraphes:
      "Le club AME a ouvert ses portes à Ermont il y a près de cinquante ans. Il en reste aujourd'hui la même règle : on entre en saluant, on part en saluant.\n\nNos trois voies ne sont pas de simples sports : ce sont des disciplines de corps et d'esprit, pratiquées par des enfants de six ans comme par des adultes qui reviennent après vingt ans d'absence.",
  };
}

export async function getSettings(): Promise<FooterContent> {
  const rows = await tryQuery<FooterContent>("SELECT * FROM settings WHERE id = 1");
  return rows?.[0] ?? {
    id: "1",
    adresse_ligne1: "Complexe Sportif Saint-Exupéry",
    adresse_ligne2: "Rue Kvot et Leydekkers",
    adresse_ligne3: "95120 Ermont",
    email: "amejudoermont@gmail.com",
    permanence: "Mercredi 17h–20h30 · Samedi 11h–13h",
    signature_jp: "一礼",
    signature_fr: "un salut",
  };
}
