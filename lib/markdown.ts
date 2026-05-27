import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

marked.setOptions({
  gfm: true,
  breaks: true,
});

/** Rend du Markdown en HTML sécurisé (anti-XSS). */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  const raw = marked.parse(md, { async: false }) as string;
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "blockquote",
      "h2", "h3", "h4",
      "ul", "ol", "li",
      "a", "img",
      "hr", "code", "pre",
    ],
    ALLOWED_ATTR: ["href", "title", "alt", "src", "target", "rel"],
  });
}

/**
 * Sanitisation minimale pour les titres éditoriaux (admin + home).
 * N'autorise que <em>, <strong>, <br> — tout le reste est échappé.
 *
 * Pourquoi pas DOMPurify ici : isomorphic-dompurify utilise jsdom côté Node,
 * ce qui plante dans les serverless functions Vercel. Pour 3 tags inline,
 * un sanitizer regex est largement suffisant et 100x plus léger.
 */
export function sanitizeInlineTitle(html: string): string {
  if (!html) return "";
  // 1) Échapper tout le HTML brut
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
