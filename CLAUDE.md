@AGENTS.md

# AME-JUDO — Guide projet

Site web du club de judo **AME-JUDO** (Arts Martiaux Ermontois), Ermont (95120).
Direction artistique « Japandi Martial ». Site vitrine public + back-office admin
pour le bureau (éditeur final non-technique → interfaces simples, en français, sans jargon).

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack) — voir AGENTS.md, ce n'est PAS le Next.js habituel |
| Langage | TypeScript strict, React 19 |
| DB | MySQL mutualisé Hostinger (`u430582688_AME_Judo` @ `srv1787.hstgr.io`) — PAS Supabase |
| Auth admin | JWT (jose, HS256) + bcrypt(12), mot de passe unique en DB, token versioning |
| Emails | Resend (plus utilisé depuis le passage de l'adhésion à HelloAsso — clé conservée) |
| Upload images | Vercel Blob en prod (si `BLOB_READ_WRITE_TOKEN`), filesystem local `/public/uploads/AAAA/MM/` en dev |
| Images | next/image (AVIF/WebP), remotePatterns autorise `*.public.blob.vercel-storage.com` |
| CSS | Tailwind v4 + CSS custom (tokens + composants dans `app/globals.css`, ~2700 lignes) |
| Rich text | Tiptap v3 (éditeur d'actualités, nœud FigureImage custom) |
| Hébergement | Vercel (app, auto-deploy sur push `main`) + Hostinger (MySQL) |

## Conventions clés

- **Fallback démo** : `DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME)`.
  Si absent → `lib/data.ts` renvoie des données de démo (le site reste navigable sans DB).
- **SQL** : toujours requêtes paramétrées via `query` / `queryOne` de `lib/db.ts`. Jamais de concaténation.
- **Server Actions** : dans `lib/actions/`, chacune appelle `requireAuth()` (défense en profondeur,
  en plus du `layout.tsx` admin qui vérifie `isAuthenticated()`). Pas de `middleware.ts`.
- **Migrations DB** : fichiers `db/migration_*.sql`, à exécuter UNE FOIS dans phpMyAdmin → SQL.
  `db/schema.sql` est la source de vérité du schéma.
- **Validation côté client AVANT server action** : en prod Next.js masque les messages d'erreur
  des server actions → valider dans le composant (ex. `ActualiteEditor` titre/extrait).
- **SITE_URL** = `https://ame-judo.fr` (codé en dur ; domaine pas encore acheté = frein SEO connu).
- **Marque** : afficher « AME-JUDO » partout dans les textes (le `alternateName` JSON-LD reste « AME »).

## Architecture

- **Public** : `/`, `/judo`, `/horaires`, `/maitres`, `/adhesion` (tarifs + **bouton HelloAsso** + Documents),
  `/competition`, `/actualites` (+ `[slug]`), `/galerie`, `/contact`, `/mentions-legales`, `/rgpd`.
- **Admin** : `/admin/login` + groupe `(panel)` (sidebar) et `(editor)` (plein écran).
  Sections : dashboard, actualités, galerie, horaires, enseignants (`/admin/maitres`),
  bureau, formules, documents, réseaux sociaux, paramètres (footer/contact), mot de passe.
- **Contenus NON éditables en admin** (modifiables uniquement par le dev en base/code) :
  le hero et le bloc « âme » de l'accueil (toujours lus via `getHeroContent`/`getAboutContent`
  dans `lib/data.ts` et affichés), et toute la page `/judo` (en dur). Les pages admin
  hero/about/disciplines ont été **retirées** (textes obsolètes, peu d'usage pour le bureau).
  La table `disciplines` subsiste : elle sert de catégorie interne aux créneaux d'horaires.
- **Adhésion** : passe par le **bouton HelloAsso** sur `/adhesion` (cf. `components/HelloAssoWidget.tsx`,
  URL de campagne dans `app/adhesion/page.tsx`). L'ancien formulaire de pré-inscription
  (form + `api/preregistrations` + admin + table `preregistrations`) a été **supprimé**.
- **API** : `api/admin/upload`, `api/admin/logout`.

## Modules notables

- **Réseaux sociaux** : table `reseaux_sociaux`, CRUD `/admin/reseaux`. Plateformes + logos
  officiels dans `lib/socials.ts` (facebook/instagram/whatsapp/tiktok/youtube/x/linkedin),
  composant `SocialIcon`. Affichés dans le Footer (rendu async) + page Contact.
- **Actualités / Compétition** : catégorie « Compétition » → champs structurés
  (`compet_pole`, médailles or/argent/bronze) alimentant `/competition`.
- **Image de couverture + point focal** : `photo_url` (toutes catégories) + `photo_focus`
  (object-position « X% Y% »). Vignette recadrée sans déformation dans la liste actualités
  (sélecteur de point focal cliquable dans l'éditeur).

## État (juin 2026)

Site complet en production sur Vercel. Données réelles en MySQL.

**Actions manuelles restantes (hors code) :**
- Variables d'env Vercel en Production (DB_*, AUTH_SECRET, RESEND_API_KEY, FROM_EMAIL, BUREAU_EMAIL, BLOB_READ_WRITE_TOKEN) — faites
- Vercel Blob activé — fait
- Migrations SQL (`dimanche`, `competition_adhesion`, `actualites_focus`, `reseaux`) — exécutées
- Achat du domaine `ame-judo.fr` (frein SEO) — à faire
- `BUREAU_EMAIL` à renseigner quand le bureau communique son adresse
