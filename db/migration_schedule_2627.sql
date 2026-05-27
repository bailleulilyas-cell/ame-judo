-- ═══════════════════════════════════════════════════════════════════
-- Migration : créneaux saison 2026 / 2027
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
-- ═══════════════════════════════════════════════════════════════════

START TRANSACTION;

-- 1. On vide tous les créneaux existants
DELETE FROM schedule_slots;

-- 2. Réinitialise l'auto-increment (pour repartir à 1)
ALTER TABLE schedule_slots AUTO_INCREMENT = 1;

-- 3. Insère les nouveaux créneaux
INSERT INTO schedule_slots (discipline_id, jour, jour_kanji, heure_debut, heure_fin, discipline, niveau, ordre) VALUES
  -- ─── Lundi ───
  (1, 'lundi',    '月', '17:00:00', '18:00:00', 'Judo', 'Poussin',           1),
  (1, 'lundi',    '月', '18:00:00', '19:00:00', 'Judo', 'Benjamin',          2),
  (1, 'lundi',    '月', '19:00:00', '20:00:00', 'Judo', 'Minime à adulte',   3),
  -- ─── Mercredi ───
  (1, 'mercredi', '水', '16:30:00', '17:15:00', 'Judo', 'Éveil 4 ans',       1),
  (1, 'mercredi', '水', '17:15:00', '18:00:00', 'Judo', 'Éveil 5 ans',       2),
  (1, 'mercredi', '水', '18:00:00', '19:00:00', 'Judo', 'Mini-poussin',      3),
  -- ─── Jeudi ───
  (1, 'jeudi',    '木', '17:00:00', '18:00:00', 'Judo', 'Poussin',           1),
  (1, 'jeudi',    '木', '18:00:00', '19:00:00', 'Judo', 'Benjamin',          2),
  (1, 'jeudi',    '木', '19:00:00', '20:00:00', 'Judo', 'Minime à adulte',   3),
  -- ─── Samedi ───
  (1, 'samedi',   '土', '09:15:00', '10:00:00', 'Judo', 'Éveil 5 ans',       1),
  (1, 'samedi',   '土', '10:00:00', '10:45:00', 'Judo', 'Éveil 4 ans',       2),
  (1, 'samedi',   '土', '10:45:00', '11:45:00', 'Judo', 'Mini-poussin',      3),
  (1, 'samedi',   '土', '11:45:00', '12:45:00', 'Judo', 'Poussin',           4),
  (1, 'samedi',   '土', '12:45:00', '13:45:00', 'Judo', 'Benjamin à adulte — ou Taïso (renforcement musculaire)', 5);

COMMIT;

-- ═══════════════════════════════════════════════════════════════════
-- Vérification : SELECT * FROM schedule_slots
-- ORDER BY FIELD(jour,'lundi','mercredi','jeudi','samedi'), ordre;
-- ═══════════════════════════════════════════════════════════════════
