-- Migration : téléphone, responsable légal, et tranches d'âge des formules
-- À exécuter UNE SEULE FOIS via phpMyAdmin > onglet SQL
-- Si une colonne existe déjà, MySQL retournera une erreur bénigne — ignorez-la.

-- ─── Pré-inscriptions : téléphone + responsable légal ──────────
ALTER TABLE preregistrations
  ADD COLUMN phone            VARCHAR(32)  NOT NULL DEFAULT '' AFTER email,
  ADD COLUMN parent_name      VARCHAR(255) NULL AFTER notes,
  ADD COLUMN parent_relation  VARCHAR(64)  NULL AFTER parent_name;

-- ─── Formules : tranches d'âge structurées ──────────────────────
ALTER TABLE formules
  ADD COLUMN age_min INT NULL AFTER tranche_age,
  ADD COLUMN age_max INT NULL AFTER age_min;

-- Remplir les bornes pour les 3 formules existantes (ajustez si vos plan_key diffèrent)
UPDATE formules SET age_min = 4,  age_max = 5    WHERE plan_key = 'baby';
UPDATE formules SET age_min = 6,  age_max = 13   WHERE plan_key = 'benjamin';
UPDATE formules SET age_min = 14, age_max = NULL WHERE plan_key = 'senior';
