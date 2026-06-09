-- ════════════════════════════════════════════════════════════════════
-- Migration : table `bureau` (membres du bureau du club, page Contact)
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
--
-- Gérée depuis l'admin (/admin/bureau) : prénom, nom, poste, description,
-- photo. Affichée sur la page Contact.
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS bureau (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ordre       INT          NOT NULL DEFAULT 0,
  prenom      VARCHAR(80)  NOT NULL,
  nom         VARCHAR(80)  NOT NULL,
  poste       VARCHAR(120) NOT NULL,
  description TEXT,
  photo_url   VARCHAR(500)          DEFAULT NULL,
  created_at  DATETIME              DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
