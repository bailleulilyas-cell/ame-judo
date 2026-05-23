-- Table de configuration clé/valeur (mot de passe admin, token version, etc.)
-- Note : nommée app_settings pour éviter le conflit avec `settings` (footer)
-- À exécuter une seule fois dans phpMyAdmin → SQL.
CREATE TABLE IF NOT EXISTS app_settings (
  `key`   VARCHAR(64)  NOT NULL PRIMARY KEY,
  `value` TEXT         NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
