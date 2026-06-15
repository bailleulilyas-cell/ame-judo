# INFRA — Hébergement, bases de données, domaines

Note de référence pour la gestion technique des sites de clubs (modèle « sites séparés »,
un projet/base/domaine par club). **Tous les comptes sont détenus par le prestataire
(Le Relais Web).** Les clubs sont « locataires » de l'infra.

> ⚠️ Ce fichier ne contient AUCUN mot de passe. Les identifiants vivent dans un
> gestionnaire de mots de passe (Bitwarden / 1Password), pas dans le code.

---

## Architecture (par club)

| Brique | Fournisseur | Détail |
|---|---|---|
| Application (site) | **Vercel** | Déploiement auto depuis GitHub (push `main`) |
| Base de données | **MySQL Hostinger** (mutualisé) | 1 base par club |
| Images uploadées | **Vercel Blob** (prod) / `/public/uploads` (dev) | Galerie, actus, photos bureau |
| Nom de domaine | **Hostinger** | DNS pointant vers Vercel |
| Adhésion / paiement | **HelloAsso** | Hors infra : campagne propre au club |

---

## Coûts récurrents (vue d'ensemble)

| Poste | Coût | Mutualisé ? |
|---|---|---|
| Vercel **Pro** | ~20 $/mois **par membre d'équipe**, pas par site | ✅ 1 abo pour TOUS les clubs |
| Hostinger (plan Business/Cloud) | 1 plan | ✅ plusieurs bases sur le même plan |
| Vercel Blob (images) | gratuit au début (~1 Go inclus) | ✅ partagé — surveiller à plusieurs clubs |
| Domaine | ~10-15 €/an | ❌ 1 par club |

**Coût marginal pour ajouter un club ≈ juste le domaine (~12 €/an).** Le reste est mutualisé.

### Notes
- **Vercel Hobby vs Pro** : Hobby = usage non commercial. Dès qu'on est payé pour
  héberger un site client → passer en **Pro**. Pro se facture par membre, donc 1 seul
  abonnement couvre tous les sites de clubs (tant qu'on reste dans les quotas inclus —
  largement le cas pour des petits clubs).
- **MySQL Hostinger** : la limite est le nombre de connexions simultanées, pas le
  stockage. Jamais atteint à l'échelle « club de quartier ».
- **Images** : poste qui grossit le plus vite. Si Blob sature → alternative
  **Cloudflare R2** (~10 Go gratuits) ou stockage sur Hostinger.
- **Domaines** : Hostinger = simple (tout au même endroit). Cloudflare Registrar =
  moins cher au renouvellement, mais 1 compte de plus à gérer.

---

## Responsabilités du modèle « je possède tout »

1. **Point de défaillance unique** → gestionnaire de mots de passe + 2FA sur chaque compte.
2. **Avance de frais** → la facturation client (abo annuel) doit couvrir les coûts récurrents.
3. **Départ d'un client à prévoir** :
   - Domaine au nom du club → prévoir le **transfert**.
   - Contenus dans MySQL → **export** possible (dump SQL).
   - Mettre les conditions par écrit (prix, sortie) dans un mini-contrat.
4. **Continuité** si le prestataire s'arrête → accès documentés + personne de confiance.

---

## Suivi par club (à remplir)

| Club | Domaine | Projet Vercel | Base MySQL (Hostinger) | Campagne HelloAsso | Mis en ligne le | Abo annuel | Statut |
|---|---|---|---|---|---|---|---|
| AME-JUDO | ame-judo.fr | `ame-judo` (Hobby) | `u430582688_AME_Judo` @ srv1787.hstgr.io | adhesion-2026-2027-ame-judo | 2026 | — | ✅ en prod |
| … | | | | | | | |

---

## Checklist : mettre en ligne un nouveau club

1. **Code** : copier le dossier TEMPLATE → renommer.
2. **`club.config.ts`** : remplir toutes les valeurs du club.
3. **Images** : remplacer `/public/logo.png`, `/public/icon.png` (et `logo-relais-web.png` reste).
4. **GitHub** : nouveau dépôt, push.
5. **Hostinger** : créer une base MySQL pour le club + importer `db/schema.sql` (phpMyAdmin).
   Exécuter les migrations `db/migration_*.sql`.
6. **Vercel** : nouveau projet lié au dépôt + variables d'env
   (DB_*, AUTH_SECRET, BLOB_READ_WRITE_TOKEN, etc.).
7. **Blob** : activer le store images sur le projet Vercel.
8. **Domaine** : acheter sur Hostinger + pointer le DNS vers Vercel.
9. **HelloAsso** : récupérer l'URL du bouton de la campagne du club → `club.config.ts`.
10. **Admin** : se connecter, changer le mot de passe, saisir les contenus réels.
11. **Vérifs** : `/sitemap.xml`, `/robots.txt`, mentions légales, pied de page (crédit), SEO.
