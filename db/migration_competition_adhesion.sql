-- ════════════════════════════════════════════════════════════════════
-- Migration : case « compétition » sur les pré-inscriptions
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE preregistrations
  ADD COLUMN souhait_competition TINYINT(1) NOT NULL DEFAULT 0 AFTER parent_relation;
