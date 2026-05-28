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

// `sanitizeInlineTitle` a été déplacé dans `@/lib/sanitize` (regex pur, sans
// dépendance externe) pour éviter de charger jsdom dans les pages admin
// dynamiques sur Vercel serverless.
