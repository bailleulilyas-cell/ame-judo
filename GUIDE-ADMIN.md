# Guide d'utilisation — Admin AME

Ce guide explique comment le bureau du club peut **modifier le site lui-même**,
sans toucher au code.

---

## 1. Se connecter

1. Allez sur **`https://ame-judo.fr/admin/login`** (ou `localhost:3000/admin/login` en local).
2. Entrez le **mot de passe administrateur** (configuré dans `.env.local`, variable `ADMIN_PASSWORD`).
3. Vous êtes connecté pour 7 jours sur cet appareil.

> **Important :** le mot de passe est unique pour tout le bureau.
> Pour le changer, modifier `ADMIN_PASSWORD` dans le fichier `.env.local` puis redémarrer le serveur.

---

## 2. Publier une nouvelle actualité

C'est la fonctionnalité la plus utilisée. Une actualité = un article sur la page **Actualités**.

### Étapes

1. Connectez-vous à `/admin`.
2. Cliquez sur **« Publier une actualité »** (ou allez dans **Actualités** → **+ Nouvelle actualité**).
3. Remplissez le formulaire :

| Champ | À renseigner | Exemple |
|---|---|---|
| **Titre** | Le titre complet de l'article | *Stage de printemps — compte-rendu* |
| **Kanji** | Un caractère japonais pour l'illustrer | 祭 (stage), 新 (nouveau), 勝 (victoire), 休 (fermeture) |
| **Catégorie** | Type d'article | Stage, Compétition, Information, Fermeture, Événement |
| **Date de publication** | Date affichée sur l'article | par défaut : aujourd'hui |
| **Slug** | L'URL de l'article | laissez vide → généré automatiquement à partir du titre |
| **Extrait** | 1-2 phrases résumées | affichées sur la liste des actualités |
| **Contenu complet** | Le texte intégral | séparez les paragraphes par une **ligne vide** |
| **Photo de couverture** | URL d'une image | optionnel — laissez vide si pas de photo |
| **Statut** | Brouillon (caché) ou Publié (visible) | choisir « Publié » pour rendre visible |

4. Cliquez sur **« Créer l'actualité »**.

> 💡 **Astuce** : commencez en **brouillon** pour rédiger tranquillement.
> Quand c'est prêt, retournez sur l'article et passez-le en **publié**.

---

## 3. Modifier une actualité existante

1. **Actualités** dans la barre latérale.
2. Cliquez sur le titre de l'article OU sur **« Modifier »**.
3. Changez ce que vous voulez.
4. Cliquez sur **« Enregistrer les modifications »**.

Le site public est mis à jour automatiquement.

---

## 4. Publier / Dépublier une actualité

Dans la liste des actualités, chaque ligne a un bouton :

- Si l'article est **publié** → le bouton dit **« Dépublier »** (le retire du site)
- Si l'article est **brouillon** → le bouton dit **« Publier »** (le rend visible)

Un seul clic, c'est instantané.

---

## 5. Supprimer une actualité

⚠️ **Action définitive et irréversible.**

1. Cliquez sur **« Supprimer »** dans la ligne de l'article.
2. Confirmez la boîte de dialogue.

L'article est définitivement effacé de la base. Pas de corbeille.

> 💡 **Préférez « Dépublier »** si vous voulez juste cacher l'article sans le perdre.

---

## 6. Suivre les pré-inscriptions

Quand un visiteur remplit le formulaire de pré-inscription, la demande arrive
**par email** (au bureau) et est enregistrée dans la base.

### Pour les consulter

1. Cliquez sur **Pré-inscriptions** dans la barre latérale.
2. Vous voyez la liste avec :
   - Date de la demande
   - Nom du candidat
   - Email (cliquez pour répondre directement)
   - Formule choisie
   - Statut (Nouveau / Contacté / Accepté / Refusé)

---

## 7. Comment écrire un bon article

Le site a une identité visuelle « Japandi » — sobre et littéraire. Quelques règles :

- **Titres courts** : 5-10 mots maximum. Évitez les majuscules en pagaille.
- **Extrait punchy** : 1 à 2 phrases qui donnent envie de cliquer. Pas plus.
- **Paragraphes aérés** : entre 2 et 5 lignes chacun. Séparez-les par une ligne vide dans le champ « Contenu ».
- **Kanji bien choisi** : il donne le ton de l'article. Voir suggestions ci-dessous.

### Kanjis recommandés selon le sujet

| Sujet | Kanji | Sens |
|---|---|---|
| Stage | 祭 | Fête / Stage |
| Compétition | 勝 | Victoire |
| Inscription / Saison | 新 | Nouveau |
| Information générale | 報 | Annonce |
| Vacances / Fermeture | 休 | Repos |
| Apprentissage | 学 | Étude |
| Événement | 会 | Réunion |

---

## 8. En cas de problème

| Problème | Solution |
|---|---|
| Je ne peux pas me connecter | Vérifiez le mot de passe. Sinon contactez le développeur. |
| L'article que je viens de créer n'apparaît pas sur le site | Vérifiez qu'il est en statut **« Publié »** (pas « Brouillon »). |
| « Base MySQL non configurée » | Le serveur n'arrive pas à se connecter à la base. Contactez le dev. |
| Je veux modifier autre chose (horaires, formules, maîtres) | **Pas encore implémenté côté admin** — contactez le dev pour ces modifications. |

---

## Ce qui n'est PAS encore éditable depuis l'admin

Pour le MVP, seules les **actualités** sont gérables depuis l'interface. Les autres
contenus (texte du Hero, horaires des cours, formules d'adhésion, maîtres, etc.)
sont actuellement stockés en base mais sans formulaire d'édition.

**Si besoin de modifier ces contenus, deux options :**

1. **Demander au développeur** une mise à jour ponctuelle.
2. **Étendre l'admin** : ajouter les pages d'édition (horaires, maîtres, formules) — environ
   1-2 jours de développement supplémentaire.

---

*Document mis à jour : mai 2026 · v1.0*
