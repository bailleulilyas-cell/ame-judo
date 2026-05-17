"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}

export default function MarkdownEditor({
  name,
  defaultValue = "",
  rows = 14,
  required,
  placeholder,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState(defaultValue);

  /**
   * Insère du texte tout en préservant l'historique d'annulation natif
   * du textarea (Ctrl+Z). On utilise setRangeText quand dispo, sinon
   * execCommand("insertText") en fallback, sinon assignation directe.
   */
  const replaceRange = (start: number, end: number, text: string) => {
    const ta = textareaRef.current;
    if (!ta) return "";
    ta.focus();
    if (typeof ta.setRangeText === "function") {
      ta.setRangeText(text, start, end, "end");
    } else {
      ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + text.length;
    }
    setContent(ta.value);
    return ta.value;
  };

  const wrap = (before: string, after = before, placeholderText = "texte") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const insert = selected || placeholderText;
    replaceRange(start, end, before + insert + after);
    // Sélectionne le texte (sans les marqueurs) pour permettre de re-taper dessus
    ta.selectionStart = start + before.length;
    ta.selectionEnd = start + before.length + insert.length;
  };

  const insertAtStart = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
    replaceRange(lineStart, lineStart, prefix);
  };

  const insertText = (text: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    replaceRange(ta.selectionStart, ta.selectionEnd, text);
  };

  const insertLink = () => {
    const url = window.prompt("URL du lien ?", "https://");
    if (!url) return;
    wrap("[", `](${url})`, "texte du lien");
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Erreur d'upload.");
      } else {
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[\[\]()]/g, "");
        insertText(`\n\n![${alt}](${data.url})\n\n`);
      }
    } catch {
      setError("Impossible d'envoyer le fichier.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="md-editor">
      <div className="md-toolbar" role="toolbar" aria-label="Mise en forme">
        <ToolBtn label="Gras" hint="Ctrl+B" onClick={() => wrap("**")}><strong>B</strong></ToolBtn>
        <ToolBtn label="Italique" hint="Ctrl+I" onClick={() => wrap("*")}><em>I</em></ToolBtn>
        <ToolBtn label="Souligné" hint="Ctrl+U" onClick={() => wrap("<u>", "</u>")}><span style={{ textDecoration: "underline" }}>U</span></ToolBtn>
        <span className="md-sep" />
        <ToolBtn label="Grand titre" onClick={() => insertAtStart("## ")}>T</ToolBtn>
        <ToolBtn label="Sous-titre" onClick={() => insertAtStart("### ")}><span style={{ fontSize: 11 }}>t</span></ToolBtn>
        <span className="md-sep" />
        <ToolBtn label="Liste à puces" onClick={() => insertAtStart("- ")}>•</ToolBtn>
        <ToolBtn label="Liste numérotée" onClick={() => insertAtStart("1. ")}>1.</ToolBtn>
        <ToolBtn label="Citation" onClick={() => insertAtStart("> ")}>❝</ToolBtn>
        <span className="md-sep" />
        <ToolBtn label="Lien" onClick={insertLink}>🔗</ToolBtn>
        <ToolBtn label="Image" onClick={handleImageClick} disabled={uploading}>
          {uploading ? "…" : "🖼"}
        </ToolBtn>
        <ToolBtn label="Vidéo YouTube" hint="lien à coller" onClick={() => {
          const url = window.prompt("Lien YouTube ?", "https://www.youtube.com/watch?v=");
          if (!url) return;
          insertText(`\n\n[Voir la vidéo](${url})\n\n`);
        }}>▶</ToolBtn>
        <span className="md-sep" />
        <ToolBtn label="Séparateur" hint="ligne horizontale" onClick={() => insertText("\n\n---\n\n")}>—</ToolBtn>
        <ToolBtn label="Saut de paragraphe" onClick={() => insertText("\n\n")}>¶</ToolBtn>
        <span className="md-sep" />
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="md-btn md-btn-secondary"
          aria-pressed={preview}
        >
          {preview ? "← Retour à l'édition" : "Aperçu →"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {error && <div className="md-error" role="alert">{error}</div>}
      {uploading && <div className="md-info">Envoi de l&apos;image en cours…</div>}

      {/* Textarea TOUJOURS monté pour préserver contenu + curseur + historique d'annulation */}
      <textarea
        ref={textareaRef}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        placeholder={placeholder ?? "Tapez votre texte… utilisez la barre d'outils ci-dessus pour mettre en forme."}
        className="form-input md-textarea"
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "b") { e.preventDefault(); wrap("**"); }
          if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); wrap("*"); }
          if ((e.ctrlKey || e.metaKey) && e.key === "u") { e.preventDefault(); wrap("<u>", "</u>"); }
        }}
        style={{ display: preview ? "none" : "block" }}
      />

      {preview && <Preview md={content} />}

      <p className="md-help">
        💡 <strong>Astuce</strong> : utilisez les boutons ci-dessus pour mettre en forme. Cliquez <strong>Aperçu</strong> pour voir le résultat avant publication. Votre texte n&apos;est jamais perdu en basculant entre les modes (Ctrl+Z fonctionne aussi).
      </p>

      <style>{`
        .md-editor { display: flex; flex-direction: column; gap: 0; }
        .md-toolbar {
          display: flex; align-items: center; flex-wrap: wrap; gap: 2px;
          padding: 8px 10px;
          background: var(--paper);
          border: 1px solid var(--hair-color);
          border-bottom: none;
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .md-sep {
          width: 1px; height: 22px;
          background: var(--hair-color);
          margin: 0 6px;
        }
        .md-btn {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 32px; height: 30px; padding: 0 8px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--sumi);
          font-family: var(--sans);
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .md-btn:hover { background: rgba(0,0,0,0.06); border-color: var(--hair-color); }
        .md-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .md-btn-secondary {
          margin-left: auto;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--stone);
          padding: 0 12px;
        }
        .md-btn-secondary[aria-pressed="true"] {
          color: var(--red);
          border-color: var(--red);
          background: rgba(200,51,42,0.06);
        }
        .md-textarea {
          font-family: ui-monospace, "Cascadia Code", "SF Mono", monospace !important;
          font-size: 14px !important;
          line-height: 1.65 !important;
          resize: vertical;
          min-height: 320px;
          border-radius: 0;
          /* Empêche le débordement horizontal sur strings sans espaces (URLs, etc.) */
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .md-error {
          padding: 10px 14px;
          background: rgba(200,51,42,0.08);
          border-left: 3px solid var(--red);
          color: var(--red);
          font-size: 13px;
          margin: 0;
        }
        .md-info {
          padding: 10px 14px;
          background: rgba(200,51,42,0.04);
          border-left: 3px solid var(--stone);
          color: var(--stone);
          font-size: 13px;
          font-style: italic;
          margin: 0;
          font-family: var(--serif);
        }
        .md-help {
          font-size: 12px;
          color: var(--stone);
          margin: 8px 0 0;
          font-family: var(--sans);
          line-height: 1.55;
        }
        .md-help code {
          background: var(--paper);
          padding: 1px 5px;
          font-size: 11px;
          color: var(--sumi);
        }
        .md-preview {
          min-height: 320px;
          padding: 28px 32px;
          background: var(--paper);
          border: 1px solid var(--hair-color);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.75;
          color: var(--sumi);
          /* Cruciaux : empêchent débordement et permettent scroll horizontal sur blocs larges */
          overflow-wrap: anywhere;
          word-break: break-word;
          overflow-x: auto;
          max-width: 100%;
        }
        .md-preview > * { max-width: 100%; }
        .md-preview h2 { font-family: var(--serif); font-weight: 400; font-size: 28px; margin: 28px 0 12px; letter-spacing: -0.02em; }
        .md-preview h2:first-child { margin-top: 0; }
        .md-preview h3 { font-family: var(--serif); font-weight: 400; font-size: 22px; margin: 24px 0 10px; }
        .md-preview p { margin: 0 0 16px; }
        .md-preview img { max-width: 100%; height: auto; margin: 16px 0; display: block; }
        .md-preview a { color: var(--red); border-bottom: 1px solid currentColor; word-break: break-all; }
        .md-preview blockquote {
          margin: 16px 0; padding: 6px 18px;
          border-left: 3px solid var(--red);
          font-style: italic; color: var(--sumi);
        }
        .md-preview ul, .md-preview ol { margin: 0 0 16px 22px; padding-left: 4px; }
        .md-preview li { margin: 4px 0; }
        .md-preview hr { border: none; border-top: 1px solid var(--hair-color); margin: 32px 0; }
        .md-preview u { text-decoration: underline; }
        .md-preview strong { font-weight: 600; }
        .md-preview pre {
          background: var(--bg-warm, #f0ebe0);
          padding: 12px 16px;
          overflow-x: auto;
          font-family: ui-monospace, monospace;
          font-size: 13px;
          margin: 16px 0;
        }
        .md-preview code {
          background: var(--bg-warm, #f0ebe0);
          padding: 1px 5px;
          font-family: ui-monospace, monospace;
          font-size: 13px;
        }
        .md-preview pre code { background: transparent; padding: 0; }
        .md-preview table {
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 14px;
          display: block;
          overflow-x: auto;
          max-width: 100%;
        }
        .md-preview th, .md-preview td {
          border: 1px solid var(--hair-color);
          padding: 8px 12px;
          text-align: left;
        }
        .md-preview th { background: var(--bg-warm, #f0ebe0); font-weight: 500; }
      `}</style>
    </div>
  );
}

function ToolBtn({
  label, hint, onClick, disabled, children,
}: {
  label: string;
  hint?: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint ? `${label} (${hint})` : label}
      aria-label={label}
      className="md-btn"
    >
      {children}
    </button>
  );
}

function Preview({ md }: { md: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import("marked"), import("isomorphic-dompurify")]).then(([{ marked }, DOMP]) => {
      if (cancelled) return;
      const purify = (DOMP as { default: { sanitize: (html: string, cfg?: Record<string, unknown>) => string } }).default;
      const source = (md && md.trim()) || "*Rien à prévisualiser pour le moment — commencez à taper du texte.*";
      const raw = marked.parse(source, { async: false, gfm: true, breaks: true }) as string;
      // Liste d'autorisation alignée sur le rendu public (lib/markdown.ts) — what you see is what you get
      const safe = purify.sanitize(raw, {
        ALLOWED_TAGS: [
          "p", "br", "strong", "em", "u", "s", "blockquote",
          "h2", "h3", "h4",
          "ul", "ol", "li",
          "a", "img",
          "hr", "code", "pre",
          "table", "thead", "tbody", "tr", "th", "td",
        ],
        ALLOWED_ATTR: ["href", "title", "alt", "src", "target", "rel"],
      });
      setHtml(safe);
    });
    return () => { cancelled = true; };
  }, [md]);

  if (html === null) {
    return <div className="md-preview" style={{ color: "var(--stone)", fontStyle: "italic" }}>Chargement de l&apos;aperçu…</div>;
  }
  return <div className="md-preview" dangerouslySetInnerHTML={{ __html: html }} />;
}
