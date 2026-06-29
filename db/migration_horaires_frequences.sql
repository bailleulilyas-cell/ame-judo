-- Migration : bloc « cours par semaine par catégorie d'âge » sous les horaires.
-- À exécuter UNE FOIS dans phpMyAdmin → SQL (optionnel : l'enregistrement
-- depuis l'admin crée la table automatiquement si elle n'existe pas).

CREATE TABLE IF NOT EXISTS horaires_frequences (
  id     INT PRIMARY KEY DEFAULT 1,
  texte  MEDIUMTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO horaires_frequences (id, texte) VALUES (1,
  'Baby (2022 - 2021) : 1 cours par semaine\nMini-Poussins (2020 - 2019) : 2 cours par semaine\nPoussins (2018 - 2017) : 3 cours par semaine\nBenjamins (2016 - 2015) : 3 cours par semaine\nMinimes (2014 - 2013) : 3 cours par semaine\nCadets (2012 - 2011 - 2010) : 3 cours par semaine\nJuniors (2009 - 2008 - 2007) : 3 cours par semaine\nSeniors / Vétérans (2006 et avant) : 3 cours par semaine')
ON DUPLICATE KEY UPDATE texte = texte;
