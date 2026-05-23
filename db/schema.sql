-- ═══════════════════════════════════════════════════════════════
-- AME — Schéma MySQL
--
-- ► Sur Hostinger / hébergement mutualisé :
--   1. Créer la base depuis le panneau (déjà fait : u430582688_AME_Judo)
--   2. Ouvrir phpMyAdmin
--   3. Onglet "Importer" → choisir ce fichier
--   OU onglet "SQL" → copier-coller tout le contenu → "Exécuter"
-- ═══════════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET SQL_MODE = '';
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Suppression des tables existantes (ordre inversé pour FK) ───
DROP TABLE IF EXISTS revisions;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS preregistrations;
DROP TABLE IF EXISTS actualites;
DROP TABLE IF EXISTS galerie;
DROP TABLE IF EXISTS formules;
DROP TABLE IF EXISTS maitres;
DROP TABLE IF EXISTS horaires_note;
DROP TABLE IF EXISTS schedule_slots;
DROP TABLE IF EXISTS disciplines;
DROP TABLE IF EXISTS about_content;
DROP TABLE IF EXISTS hero_content;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admin_users;

SET FOREIGN_KEY_CHECKS = 1;

-- ─── Hero (singleton) ────────────────────────────────────────
CREATE TABLE hero_content (
  id           INT PRIMARY KEY DEFAULT 1,
  proverbe_jp  VARCHAR(255) NOT NULL DEFAULT '礼に始まり、礼に終わる',
  proverbe_fr  TEXT NOT NULL,
  eyebrow      VARCHAR(255) NOT NULL DEFAULT 'Ermont · Val-d''Oise',
  titre        TEXT NOT NULL,
  sous_titre   TEXT NOT NULL,
  stat1_num    VARCHAR(16) NOT NULL DEFAULT '47',
  stat1_label  VARCHAR(64) NOT NULL DEFAULT 'Années',
  stat2_num    VARCHAR(16) NOT NULL DEFAULT '1882',
  stat2_label  VARCHAR(64) NOT NULL DEFAULT 'Origine du judo',
  stat3_num    VARCHAR(16) NOT NULL DEFAULT '2',
  stat3_label  VARCHAR(64) NOT NULL DEFAULT 'Essais gratuits',
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO hero_content (id, proverbe_fr, titre, sous_titre) VALUES
  (1,
   'Tout commence par un salut, tout s''achève par un salut',
   'Apprendre à <em>saluer</em>,<br>à <em>vaincre</em>.',
   'Club de judo ermontois depuis 1978. Une voie enseignée dans la rigueur et la sérénité, pour les enfants comme pour les adultes.');

-- ─── À propos (singleton) ────────────────────────────────────
CREATE TABLE about_content (
  id           INT PRIMARY KEY DEFAULT 1,
  citation     TEXT NOT NULL,
  attribution  VARCHAR(255) NOT NULL DEFAULT 'Tradition AME',
  titre        TEXT NOT NULL,
  paragraphes  MEDIUMTEXT NOT NULL,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO about_content (id, citation, titre, paragraphes) VALUES
  (1,
   'Le tatami ne ment jamais. C''est sa première leçon, et sa dernière.',
   'Une <em>maison</em> avant d''être un club.',
   'Le club AME a ouvert ses portes à Ermont il y a près de cinquante ans. Il en reste aujourd''hui la même règle : on entre en saluant, on part en saluant. Entre les deux, tout est question d''effort, de respect et de transmission.\n\nNotre voie n''est pas un simple sport : c''est une discipline de corps et d''esprit, pratiquée par des enfants de six ans comme par des adultes qui reviennent après vingt ans d''absence.');

-- ─── Disciplines ──────────────────────────────────────────────
CREATE TABLE disciplines (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ordre       INT NOT NULL,
  kanji       VARCHAR(8) NOT NULL,
  nom         VARCHAR(64) NOT NULL,
  sens        VARCHAR(128) NOT NULL,
  tagline     TEXT NOT NULL,
  body        TEXT NOT NULL,
  origine     VARCHAR(255) NOT NULL,
  slug        VARCHAR(64) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO disciplines (ordre, kanji, nom, sens, tagline, body, origine, slug) VALUES
  (1, '柔道', 'Judo', 'La voie de la souplesse', 'Céder pour mieux vaincre.',
   'Discipline olympique fondée par Jigoro Kano en 1882. Au club AME, le judo s''enseigne dans toutes ses dimensions : les projections debout (nage-waza), le travail au sol (katame-waza) et les formes traditionnelles (kata). Du baby-judo (4 ans) aux adultes confirmés, dans la rigueur et la sérénité.',
   'Japon · 1882 · Jigoro Kano', 'judo');

-- ─── Créneaux horaires ────────────────────────────────────────
CREATE TABLE schedule_slots (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  discipline_id INT,
  jour          ENUM('lundi','mercredi','jeudi','samedi') NOT NULL,
  jour_kanji    VARCHAR(4) NOT NULL,
  heure_debut   VARCHAR(5) NOT NULL,
  heure_fin     VARCHAR(5) NOT NULL,
  discipline    VARCHAR(64) NOT NULL,
  niveau        VARCHAR(128) NOT NULL,
  ordre         INT NOT NULL DEFAULT 0,
  FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO schedule_slots (discipline_id, jour, jour_kanji, heure_debut, heure_fin, discipline, niveau, ordre) VALUES
  (1, 'lundi',     '月', '19:00', '20:30', 'Judo', 'Adultes +14 ans',       1),
  (1, 'mercredi',  '水', '17:00', '18:00', 'Judo', '6/7 ans',               1),
  (1, 'mercredi',  '水', '18:00', '19:15', 'Judo', '8/11 ans',              2),
  (1, 'mercredi',  '水', '19:30', '20:30', 'Judo', 'Adultes / Tous niveaux', 3),
  (1, 'jeudi',     '木', '19:30', '21:00', 'Judo', 'Adultes',               1),
  (1, 'samedi',    '土', '11:45', '12:45', 'Judo', '8/11 ans',              1),
  (1, 'samedi',    '土', '18:30', '19:30', 'Judo', 'Adultes / Confirmés',   2);

-- ─── Note temporaire pour les horaires ────────────────────────
CREATE TABLE horaires_note (
  id     INT PRIMARY KEY DEFAULT 1,
  texte  TEXT,
  active BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO horaires_note (id, texte, active) VALUES (1, '', FALSE);

-- ─── Maîtres ──────────────────────────────────────────────────
CREATE TABLE maitres (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  ordre     INT NOT NULL,
  nom       VARCHAR(128) NOT NULL,
  role      VARCHAR(128) NOT NULL,
  grade     VARCHAR(128) NOT NULL,
  annees    INT NOT NULL,
  citation  TEXT NOT NULL,
  photo_url VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO maitres (ordre, nom, role, grade, annees, citation) VALUES
  (1, 'Hiroshi Tanaka',  'Professeur principal',     '5ᵉ Dan · Judo', 32, 'La chute n''est pas une défaite. C''est une leçon que le tatami vous offre.'),
  (2, 'Marc Lefebvre',   'Professeur de judo',       '4ᵉ Dan · Judo', 18, 'Le judo ne cherche pas à dominer. Il cherche à comprendre.'),
  (3, 'Sophie Renard',   'Professeure · Éveil judo', '2ᵉ Dan · Judo', 11, 'Enseigner aux enfants, c''est leur offrir une façon de se connaître eux-mêmes.');

-- ─── Formules d'adhésion ──────────────────────────────────────
CREATE TABLE formules (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ordre       INT NOT NULL,
  kanji       VARCHAR(8) NOT NULL,
  nom         VARCHAR(64) NOT NULL,
  tranche_age VARCHAR(64) NOT NULL,
  age_min     INT NULL,
  age_max     INT NULL,
  prix        INT NOT NULL,
  italique    TEXT NOT NULL,
  slots_texte VARCHAR(255) NOT NULL,
  plan_key    ENUM('baby','benjamin','senior') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO formules (ordre, kanji, nom, tranche_age, age_min, age_max, prix, italique, slots_texte, plan_key) VALUES
  (1, '子', 'Baby Judo',  '4 – 5 ans',   4,  5,    120, 'Éveil aux arts martiaux par le jeu.',           'Mercredi 17h · Samedi 10h',         'baby'),
  (2, '少', 'Benjamin',   '6 – 13 ans',  6,  13,   170, 'La voie des jeunes guerriers.',                 'Mercredi 17h-19h · Samedi 11h45',   'benjamin'),
  (3, '人', 'Senior',     '14 ans et +', 14, NULL, 210, 'Pratique complète, compétition au choix.',      'Lundi · Jeudi · Samedi soir',       'senior');

-- ─── Actualités ───────────────────────────────────────────────
CREATE TABLE actualites (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  kanji            VARCHAR(8) NOT NULL,
  categorie        VARCHAR(64) NOT NULL,
  date_publication DATE NOT NULL,
  titre            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) UNIQUE NOT NULL,
  extrait          TEXT NOT NULL,
  body             MEDIUMTEXT NOT NULL,
  photo_url        VARCHAR(255),
  statut           ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO actualites (kanji, categorie, date_publication, titre, slug, extrait, body, statut) VALUES
  ('祭', 'Stage',       '2026-04-12', 'Stage de printemps — compte-rendu',                'stage-printemps-2026',
   'Trente-deux participants, deux jours de travail intensif sur les projections arrière.',
   'Trente-deux participants, deux jours de travail intensif sur les projections arrière. Le tatami a beaucoup parlé ce week-end.\n\nNos élèves ont travaillé les techniques suivantes : o-soto-gari, o-uchi-gari, ko-uchi-gari, et les enchaînements debout-sol.\n\nLe prochain stage est prévu en juillet.',
   'published'),
  ('新', 'Actualité',   '2026-03-01', 'Rentrée 2026-2027 — inscriptions ouvertes',         'rentree-2026-2027',
   'Les pré-inscriptions pour la saison 2026-2027 sont désormais ouvertes.',
   'Les pré-inscriptions pour la saison 2026-2027 sont désormais ouvertes. Venez faire vos deux séances d''essai avant de vous engager.',
   'published'),
  ('勝', 'Compétition', '2026-02-10', 'Résultats — Championnat départemental benjamins',  'championnat-departemental-2026',
   'Nos jeunes judokas ont brillé : trois médailles d''or, deux d''argent.',
   'Nos jeunes judokas ont brillé au championnat départemental. Trois médailles d''or, deux d''argent. Félicitations à tous.',
   'published');

-- ─── Pré-inscriptions ─────────────────────────────────────────
CREATE TABLE preregistrations (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(32) NOT NULL DEFAULT '',
  birth_date       DATE NOT NULL,
  plan             ENUM('baby','benjamin','senior') NOT NULL,
  status           ENUM('pending','contacted','accepted','rejected') NOT NULL DEFAULT 'pending',
  notes            TEXT,
  parent_name      VARCHAR(255),
  parent_relation  VARCHAR(64),
  submitted_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email_dob (email, birth_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Paramètres globaux (footer / contact) ───────────────────
CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1,
  adresse_ligne1 VARCHAR(255) NOT NULL DEFAULT 'Complexe Sportif Saint-Exupéry',
  adresse_ligne2 VARCHAR(255) NOT NULL DEFAULT 'Rue Kvot et Leydekkers',
  adresse_ligne3 VARCHAR(255) NOT NULL DEFAULT '95120 Ermont',
  email          VARCHAR(255) NOT NULL DEFAULT 'amejudoermont@gmail.com',
  telephone      VARCHAR(64),
  permanence     VARCHAR(255) NOT NULL DEFAULT 'Mercredi 17h–20h30 · Samedi 11h–13h'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO settings (id) VALUES (1);
