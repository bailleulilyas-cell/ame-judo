-- ═══════════════════════════════════════════════════════════
-- Migration : Judo uniquement (suppression ju-jitsu + taïso)
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
-- ═══════════════════════════════════════════════════════════

-- 1. Convertir les créneaux ju-jitsu / taïso en créneaux judo
--    (on ne supprime pas pour garder un planning chargé)
UPDATE schedule_slots
SET discipline_id = 1,
    discipline = 'Judo',
    niveau = 'Adultes / Tous niveaux'
WHERE discipline = 'Taïso';

UPDATE schedule_slots
SET discipline_id = 1,
    discipline = 'Judo',
    niveau = 'Adultes'
WHERE discipline = 'Ju-jitsu' AND niveau = 'Adultes';

UPDATE schedule_slots
SET discipline_id = 1,
    discipline = 'Judo',
    niveau = 'Adultes / Confirmés'
WHERE discipline = 'Ju-jitsu' AND niveau LIKE 'Adultes%';

-- 2. Supprimer les disciplines ju-jitsu et taïso
DELETE FROM disciplines WHERE slug IN ('ju-jitsu', 'taiso');

-- 3. Mettre à jour les rôles, grades et citations des maîtres
UPDATE maitres
SET role = 'Professeur de judo',
    grade = '4ᵉ Dan · Judo',
    citation = 'Le judo ne cherche pas à dominer. Il cherche à comprendre.'
WHERE nom = 'Marc Lefebvre';

UPDATE maitres
SET role = 'Professeure · Éveil judo'
WHERE nom = 'Sophie Renard';

-- 4. Hero — remplacer "3 / Disciplines" par "1882 / Origine du judo"
UPDATE hero_content
SET stat2_num = '1882',
    stat2_label = 'Origine du judo',
    sous_titre = 'Club de judo ermontois depuis 1978. Une voie enseignée dans la rigueur et la sérénité, pour les enfants comme pour les adultes.'
WHERE id = 1;

-- 5. About — remplacer "trois voies" par "notre voie"
UPDATE about_content
SET paragraphes = 'Le club AME a ouvert ses portes à Ermont il y a près de cinquante ans. Il en reste aujourd''hui la même règle : on entre en saluant, on part en saluant.\n\nNotre voie n''est pas un simple sport : c''est une discipline de corps et d''esprit, pratiquée par des enfants de six ans comme par des adultes qui reviennent après vingt ans d''absence.'
WHERE id = 1;

-- (Le texte du footer "Club de judo à Ermont" est désormais hardcodé
--  dans components/Footer.tsx, pas en DB — donc rien à modifier ici.)
