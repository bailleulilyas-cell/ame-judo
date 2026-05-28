/**
 * Sanitizer ultra-léger pour les titres éditoriaux (admin + home).
 *
 * Pourquoi pas DOMPurify : isomorphic-dompurify utilise jsdom côté Node,
 * et jsdom ne se charge pas dans les serverless functions Vercel
 * (« Failed to load external module jsdom »).
 *
 * Ce fichier n'a AUCUNE dépendance externe — pure regex.
 * Autorise uniquement <em>, <strong>, <br> sans aucun attribut.
 */
export function sanitizeInlineTitle(html: string): string {
  if (!html) return "";
  // 1) Échapper TOUT le HTML brut
  const escaped = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  // 2) Ré-injecter UNIQUEMENT les tags safe (sans aucun attribut)
  return escaped
    .replace(/&lt;em&gt;/gi, "<em>")
    .replace(/&lt;\/em&gt;/gi, "</em>")
    .replace(/&lt;strong&gt;/gi, "<strong>")
    .replace(/&lt;\/strong&gt;/gi, "</strong>")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br />");
}
