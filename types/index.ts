export interface Discipline {
  id: string;
  ordre: number;
  kanji: string;
  nom: string;
  sens: string;
  tagline: string;
  body: string;
  origine: string;
  slug?: string;
}

export interface ScheduleSlot {
  id: string;
  discipline_id: string;
  jour: "lundi" | "mercredi" | "jeudi" | "samedi";
  jour_kanji: string;
  heure_debut: string;
  heure_fin: string;
  niveau: string;
  ordre: number;
}

export interface HorairesNote {
  id: string;
  texte: string;
  active: boolean;
}

export interface Maitre {
  id: string;
  ordre: number;
  nom: string;
  role: string;
  grade: string;
  annees: number;
  citation: string;
  photo_url: string | null;
}

export interface Formule {
  id: string;
  ordre: number;
  kanji: string;
  nom: string;
  tranche_age: string;
  age_min: number | null;
  age_max: number | null;
  prix: number;
  italique: string;
  slots_texte: string;
  plan_key: "baby" | "benjamin" | "senior";
}

export interface FooterContent {
  id: string;
  adresse_ligne1: string;
  adresse_ligne2: string;
  adresse_ligne3: string;
  email: string;
  permanence: string;
  telephone?: string | null;
  signature_jp?: string;
  signature_fr?: string;
}

export interface Actualite {
  id: string;
  kanji: string;
  categorie: string;
  date_publication: string;
  titre: string;
  slug: string;
  extrait: string;
  body: string;
  photo_url: string | null;
  statut: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Preregistration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  plan: "baby" | "benjamin" | "senior";
  status: "pending" | "contacted" | "accepted" | "rejected";
  notes: string | null;
  parent_name: string | null;
  parent_relation: string | null;
  submitted_at: string;
  updated_at: string;
}
