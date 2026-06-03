-- ════════════════════════════════════════════════════════════
-- Migration : table `reseaux_sociaux`
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
--
-- L'admin ajoute des liens (Facebook, Instagram, WhatsApp, TikTok,
-- YouTube, X, LinkedIn). Chaque plateforme a son logo affiché
-- automatiquement dans le pied de page du site.
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reseaux_sociaux (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  plateforme  VARCHAR(20)  NOT NULL,
  url         VARCHAR(500) NOT NULL,
  ordre       INT          NOT NULL DEFAULT 0,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME              DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
