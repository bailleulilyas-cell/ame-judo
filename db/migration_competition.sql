-- ════════════════════════════════════════════════════════════════════
-- Migration : champs « Compétition » sur les actualités
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
--
-- Quand une actualité a pour catégorie « Compétition », l'éditeur affiche
-- des champs structurés (pôle + médailles). Ces colonnes les stockent.
-- Toutes nullables → aucun impact sur les articles existants.
-- La photo du podium réutilise la colonne `photo_url` déjà présente
-- (elle sert de vignette, distincte des images insérées dans le corps).
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE actualites
  ADD COLUMN compet_pole   ENUM('jeunes','veteran') NULL AFTER photo_url,
  ADD COLUMN compet_or     TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER compet_pole,
  ADD COLUMN compet_argent TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER compet_or,
  ADD COLUMN compet_bronze TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER compet_argent;
