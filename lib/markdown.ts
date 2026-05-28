import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Rend du Markdown en HTML sécurisé sans dépendance à jsdom/DOMPurify
 * (qui ne se charge pas dans les serverless functions Vercel).
 *
 * Stratégie :
 *  1. Conversion Markdown → HTML via `marked`
 *  2. Sanitisation par retrait des balises et attributs dangereux
 *
 * Le contenu vient de l'admin (admin-trusted), donc le but est défensif :
 * empêcher l'exécution de scripts si jamais le compte admin était compromis.
 */

const DANGEROUS_TAGS = [
  "script", "iframe", "object", "embed", "style", "form",
  "input", "button", "textarea", "select", "option",
  "link", "meta", "base", "applet",
];

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "em", "u", "s", "del", "ins", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "img",
  "hr", "code", "pre",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
]);

const ALLOWED_ATTR_GLOBAL = new Set(["title", "lang"]);
const ALLOWED_ATTR_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height"]),
};

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  // Bloque javascript:, vbscript:, data: (sauf data:image/*)
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("vbscript:")) return false;
  if (trimmed.startsWith("data:") && !trimmed.startsWith("data:image/")) return false;
  return true;
}

function sanitizeHtml(html: string): string {
  // 1) Retire les balises dangereuses ET leur contenu
  let cleaned = html;
  for (const tag of DANGEROUS_TAGS) {
    const open = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi");
    const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");
    cleaned = cleaned.replace(open, "").replace(selfClosing, "");
  }

  // 2) Filtre tag par tag : ne garde que ceux dans ALLOWED_TAGS,
  //    et n'accepte que les attributs whitelist (URLs validées).
  cleaned = cleaned.replace(/<(\/)?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_match, slash, tagName, attrs) => {
    const tag = String(tagName).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return ""; // tag inconnu → supprimé

    if (slash) return `</${tag}>`;

    // Parse les attributs un par un
    const allowedForTag = ALLOWED_ATTR_BY_TAG[tag] ?? new Set<string>();
    const kept: string[] = [];
    const attrRegex = /(\w[\w-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let m: RegExpExecArray | null;
    while ((m = attrRegex.exec(attrs)) !== null) {
      const name = m[1].toLowerCase();
      // Bloque tout attribut commençant par "on" (event handlers)
      if (name.startsWith("on")) continue;
      if (!allowedForTag.has(name) && !ALLOWED_ATTR_GLOBAL.has(name)) continue;

      const rawValue = m[3] ?? m[4] ?? m[5] ?? "";
      const value = rawValue
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // URLs : bloque les schémas dangereux
      if ((name === "href" || name === "src") && !isSafeUrl(rawValue)) continue;

      kept.push(`${name}="${value}"`);
    }

    // Force rel="noopener noreferrer" sur les liens externes
    if (tag === "a") {
      const hasHref = kept.some((a) => a.startsWith("href="));
      if (hasHref) {
        const hasRel = kept.some((a) => a.startsWith("rel="));
        if (!hasRel) kept.push('rel="noopener noreferrer"');
      }
    }

    const selfClosing = tag === "br" || tag === "hr" || tag === "img";
    return `<${tag}${kept.length ? " " + kept.join(" ") : ""}${selfClosing ? " /" : ""}>`;
  });

  return cleaned;
}

/** Rend du Markdown en HTML sécurisé (anti-XSS). */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  const raw = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(raw);
}
