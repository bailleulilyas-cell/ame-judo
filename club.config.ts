// ──────────────────────────────────────────────────────────────────────────
//  CONFIGURATION DU CLUB — source unique de vérité « par club »
// ──────────────────────────────────────────────────────────────────────────
//
//  POUR DUPLIQUER CE SITE VERS UN NOUVEAU CLUB :
//  copie le projet entier, puis remplis CE fichier (+ remplace les images dans
//  /public : logo.png, icon.png). Tout le code (SEO, balises Google, mentions
//  légales, pied de page, liens, couleurs…) lit ces valeurs : tu n'as RIEN à
//  chercher ailleurs dans le code.
//
//  ⚠️ Ce qui N'EST PAS ici (volontairement) :
//   • Textes des pages, horaires, enseignants, bureau, actualités, tarifs,
//     documents, réseaux sociaux → éditables dans l'ADMIN (stockés en base).
//   • L'adresse / l'email / la permanence affichés dans le pied de page et la
//     page Contact → éditables dans l'ADMIN (Paramètres). Les valeurs ci-dessous
//     ne servent qu'au SEO (balises Google) et aux mentions légales, qui sont
//     codés en dur et donc renseignés ici.
// ──────────────────────────────────────────────────────────────────────────

export const club = {
  // ── Identité de marque ──
  name: "AME-JUDO", // nom court affiché partout
  legalName: "AME-JUDO — Arts Martiaux Ermontois", // raison sociale complète
  alternateName: "AME", // nom alternatif (JSON-LD)
  shortName: "AME-JUDO", // nom court PWA (écran d'accueil mobile)
  foundingYear: "1978",
  sport: "Judo",
  slogan: "Apprendre à saluer, à vaincre.",
  city: "Ermont",

  // ── Domaine / URL ──
  domain: "ame-judo.fr",
  url: "https://ame-judo.fr",
  locale: "fr_FR",
  lang: "fr-FR",

  // ── Contact (SEO + valeur par défaut ; l'email affiché vient de l'admin) ──
  email: "amejudoermont@gmail.com",

  // ── Adresse (SEO + mentions légales — codées en dur) ──
  address: {
    venue: "Complexe Sportif Saint-Exupéry",
    street: "Rue Kvot et Leydekkers",
    postalCode: "95120",
    locality: "Ermont",
    region: "Val-d'Oise",
    country: "FR",
  },
  geo: { latitude: 48.9949, longitude: 2.2477 },
  mapUrl: "https://www.google.com/maps?q=Complexe+Sportif+Saint-Exupéry+Ermont+95120",

  // ── Mentions légales ──
  legal: {
    associationType: "Association loi du 1ᵉʳ juillet 1901",
    rna: "W951008210",
    president: "Thierry Bailleul",
  },

  // ── SEO / référencement ──
  seo: {
    titleDefault: "AME-JUDO — Club de Judo à Ermont (95) · Arts Martiaux Ermontois",
    titleTemplate: "%s — AME-JUDO",
    description:
      "Club de judo à Ermont (95), fondé en 1978. Cours pour enfants, ados et adultes — du baby-judo aux ceintures noires. Deux séances d'essai gratuites.",
    descriptionOrg:
      "Club de judo à Ermont (Val-d'Oise) depuis 1978. Cours enfants, ados et adultes, du baby-judo aux ceintures noires.",
    ogTitle: "AME-JUDO — Club de judo à Ermont",
    ogDescription: "Club de judo à Ermont depuis 1978. Enfants, ados, adultes.",
    keywords: [
      "judo Ermont",
      "club judo 95",
      "judo Val d'Oise",
      "cours judo enfants",
      "baby judo Ermont",
      "AME-JUDO judo",
    ],
    knowsAbout: ["Judo", "Baby judo", "Arts martiaux", "Self-défense", "Taïso"],
    priceRange: "€€",
    // Zone de recrutement réelle : ville du club + communes limitrophes.
    areaServed: [
      "Ermont",
      "Eaubonne",
      "Sannois",
      "Franconville",
      "Saint-Leu-la-Forêt",
      "Taverny",
      "Montmorency",
      "Le Plessis-Bouchard",
    ],
    openingHours: [
      { dayOfWeek: "Wednesday", opens: "17:00", closes: "20:30" },
      { dayOfWeek: "Saturday", opens: "11:00", closes: "13:00" },
    ],
  },

  // ── Liens externes ──
  links: {
    // Bouton d'adhésion HelloAsso (campagne en cours — à MAJ chaque saison).
    helloAssoButton:
      "https://www.helloasso.com/associations/arts-martiaux-ermontois-judo/adhesions/adhesion-2026-2027-ame-judo/widget-bouton",
    // Fiche du club sur le site de la fédération (FFJDA).
    ffjda: "https://www.ffjudo.com/club-arts-martiaux-ermontois",
  },

  // ── Thème (les couleurs clés sont aussi dans globals.css) ──
  theme: {
    paper: "#F5F1EA", // fond clair + themeColor navigateur
    accent: "#C8332A", // rouge (kanji, marque)
    kanjiHero: "道", // grand idéogramme décoratif (image Open Graph)
  },

  // ── Image de partage (Open Graph) — textes affichés sur la vignette ──
  og: {
    eyebrow: "AME-JUDO · Depuis 1978",
    title: "Club de Judo · Ermont",
    subtitle: "Une voie. Une école. Depuis 1978.",
  },
} as const;

// ── Crédit agence (TA signature — à garder sur tous les sites livrés) ──
// logo : URL distante (mise à jour centralement pour tous les sites clients).
export const agency = {
  name: "Le Relais Web",
  url: "https://lerelaisweb.com",
  logo: "https://lerelaisweb.com/logo-relais-nav.webp",
} as const;
