-- ════════════════════════════════════════════════════════════════════
-- Migration : ajoute body_html (contenu rich text TipTap)
-- À exécuter UNE SEULE FOIS dans phpMyAdmin → SQL.
-- Les anciens articles continuent de fonctionner via le champ `body` (Markdown).
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE actualites
  ADD COLUMN body_html MEDIUMTEXT NULL AFTER body;
