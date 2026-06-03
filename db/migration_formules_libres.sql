-- ════════════════════════════════════════════════════════════════════
-- Migration : formules libres (plus de limite aux 3 types baby/benjamin/senior)
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
--
-- On passe `plan_key` (formules) et `plan` (preregistrations) d'un ENUM
-- figé à du VARCHAR. Les valeurs existantes (baby, benjamin, senior) sont
-- conservées telles quelles. L'admin peut désormais créer autant de
-- formules qu'il veut ; chaque formule reçoit une clé unique auto-générée.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE formules        MODIFY COLUMN plan_key VARCHAR(40) NOT NULL;
ALTER TABLE preregistrations MODIFY COLUMN plan    VARCHAR(40) NOT NULL;
