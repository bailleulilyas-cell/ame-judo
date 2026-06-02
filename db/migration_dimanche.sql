-- ════════════════════════════════════════════════════════════════════
-- Migration : ajout du dimanche dans les créneaux horaires
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE schedule_slots
  MODIFY COLUMN jour ENUM('lundi','mercredi','jeudi','samedi','dimanche') NOT NULL;
