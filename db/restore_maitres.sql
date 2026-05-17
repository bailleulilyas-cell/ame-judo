-- Restaurer les 3 maîtres d'origine s'ils manquent.
-- N'insère que les profs absents (basé sur le nom).
-- Sûr à exécuter plusieurs fois.

INSERT INTO maitres (ordre, nom, role, grade, annees, citation)
SELECT * FROM (
  SELECT 1 AS ordre,
         'Hiroshi Tanaka' AS nom,
         'Professeur principal' AS role,
         '5ᵉ Dan · Judo' AS grade,
         32 AS annees,
         'La chute n''est pas une défaite. C''est une leçon que le tatami vous offre.' AS citation
) AS t
WHERE NOT EXISTS (SELECT 1 FROM maitres WHERE nom = 'Hiroshi Tanaka');

INSERT INTO maitres (ordre, nom, role, grade, annees, citation)
SELECT * FROM (
  SELECT 2 AS ordre,
         'Marc Lefebvre' AS nom,
         'Professeur · Judo & Ju-jitsu' AS role,
         '4ᵉ Dan Judo · 3ᵉ Dan Ju-jitsu' AS grade,
         18 AS annees,
         'Le ju-jitsu ne cherche pas à dominer. Il cherche à comprendre.' AS citation
) AS t
WHERE NOT EXISTS (SELECT 1 FROM maitres WHERE nom = 'Marc Lefebvre');

INSERT INTO maitres (ordre, nom, role, grade, annees, citation)
SELECT * FROM (
  SELECT 3 AS ordre,
         'Sophie Renard' AS nom,
         'Professeure · Taïso & Éveil' AS role,
         '2ᵉ Dan · Judo' AS grade,
         11 AS annees,
         'Enseigner aux enfants, c''est leur offrir une façon de se connaître eux-mêmes.' AS citation
) AS t
WHERE NOT EXISTS (SELECT 1 FROM maitres WHERE nom = 'Sophie Renard');
