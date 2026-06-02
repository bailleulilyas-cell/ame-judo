-- ════════════════════════════════════════════════════════════════════
-- Migration : point focal de l'image de couverture des actualités
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
--
-- Stocke la position (object-position CSS, ex. "50% 30%") choisie par
-- l'admin pour que la vignette recadrée garde la bonne partie visible.
-- NULL = centré par défaut ("50% 50%").
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE actualites
  ADD COLUMN photo_focus VARCHAR(16) NULL DEFAULT NULL AFTER photo_url;
