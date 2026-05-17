-- Table de configuration générale (clé/valeur)
-- Exécuter une seule fois dans phpMyAdmin
CREATE TABLE IF NOT EXISTS settings (
  `key`   VARCHAR(64)  NOT NULL PRIMARY KEY,
  `value` TEXT         NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
