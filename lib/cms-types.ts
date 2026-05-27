// Types CMS (contenu éditable depuis l'admin).
// Séparé de `lib/actions/cms.ts` car un fichier "use server" ne peut
// exporter QUE des fonctions async — pas des interfaces.

export interface HeroContent {
  id: number;
  proverbe_jp: string;
  proverbe_fr: string;
  eyebrow: string;
  titre: string;
  sous_titre: string;
  stat1_num: string; stat1_label: string;
  stat2_num: string; stat2_label: string;
  stat3_num: string; stat3_label: string;
}

export interface AboutContent {
  id: number;
  citation: string;
  attribution: string;
  titre: string;
  paragraphes: string;
}
