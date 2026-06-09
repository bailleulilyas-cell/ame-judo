-- ════════════════════════════════════════════════════════════════════
-- Migration : table `galerie` (bibliothèque de photos du club)
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
--
-- Gérée depuis l'admin (/admin/galerie). Affichée en « masonry » sur
-- l'accueil (6 premières) et sur la page /galerie (toutes).
-- Le seed reprend les 5 photos déjà en ligne pour que l'accueil reste
-- rempli dès la migration.
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS galerie (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ordre       INT          NOT NULL DEFAULT 0,
  url         VARCHAR(500) NOT NULL,
  legende     VARCHAR(200)          DEFAULT NULL,
  created_at  DATETIME              DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO galerie (ordre, url, legende) VALUES
  (1, '/photos/photo-2.webp',  'Le salut'),
  (2, '/photos/photo-1.webp',  'Cours enfants'),
  (3, '/photos/photo-3b.webp', 'Devant les portraits des maîtres'),
  (4, '/photos/photo-5.webp',  'Sur le tatami'),
  (5, '/photos/photo-4.webp',  'Travail au sol');
