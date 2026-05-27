-- ════════════════════════════════════════════════════════════
-- Migration : table `documents` (à fournir lors de l'adhésion)
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS documents (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ordre       INT          NOT NULL DEFAULT 0,
  nom         VARCHAR(120) NOT NULL,
  description TEXT,
  kanji       VARCHAR(8)            DEFAULT NULL,
  url         VARCHAR(500) NOT NULL,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME              DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed : 4 documents par défaut (URL vide à remplir depuis l'admin)
INSERT INTO documents (ordre, nom, description, kanji, url, active) VALUES
  (1, 'Bulletin d''adhésion',  'Formulaire d''inscription au club (saison 2026/2027).', '証', '#', 1),
  (2, 'Certificat médical',     'Modèle à faire compléter par votre médecin.',          '医', '#', 1),
  (3, 'Règlement intérieur',    'Les règles de vie du dojo et du club.',                '規', '#', 1),
  (4, 'Autorisation parentale', 'Pour les pratiquants mineurs.',                        '親', '#', 1);
