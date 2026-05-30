"use client";

import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { useCallback, useRef, useState } from "react";
import { uploadImage, UploadError, ACCEPTED_IMAGE_TYPES } from "@/lib/image-upload";

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

type Align = "left" | "center" | "right";
const ALIGNS: Align[] = ["left", "center", "right"];

const SIZE_PRESETS: { label: string; title: string; value: number }[] = [
  { label: "S", title: "Petite (33 %)", value: 33 },
  { label: "M", title: "Moyenne (50 %)", value: 50 },
  { label: "L", title: "Grande (75 %)", value: 75 },
  { label: "▭", title: "Pleine largeur (100 %)", value: 100 },
];

/* ════════════════════════════════════════════════════════════
   NODE IMAGE PERSONNALISÉ
   - sérialisé en <figure data-align data-width><img><figcaption>
   - relit l'ancien format <img data-alignment data-caption> (compat)
   ════════════════════════════════════════════════════════════ */
function migrateLegacyAlign(
  legacy: string | null,
  align: string | null,
  width: number | null
): { align: Align; width: number | null } {
  let a: Align = (align as Align) || "center";
  let w = width;
  if (legacy) {
    if (legacy === "wide") { a = "center"; w = w ?? 100; }
    else if (legacy === "center") { a = "center"; w = w ?? 75; }
    else if (legacy === "left" || legacy === "right") { a = legacy; w = w ?? 50; }
  }
  if (a !== "left" && a !== "center" && a !== "right") a = "center";
  return { align: a, width: w };
}

const FigureImage = ImageExt.extend({
  name: "image",
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      title: { default: null },
      align: { default: "center" },
      width: { default: null }, // pourcentage (nombre) ou null = pleine largeur
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-ame-fig]",
        priority: 100,
        getAttrs: (el) => {
          const fig = el as HTMLElement;
          const img = fig.querySelector("img");
          if (!img) return false;
          const cap = fig.querySelector("figcaption");
          const wAttr = fig.getAttribute("data-width");
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") ?? "",
            title: img.getAttribute("title"),
            align: (fig.getAttribute("data-align") as Align) || "center",
            width: wAttr ? parseInt(wAttr, 10) : null,
            caption: cap?.textContent ?? "",
          };
        },
      },
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (el) => {
          const img = el as HTMLElement;
          const wAttr = img.getAttribute("data-width") || img.getAttribute("width");
          const { align, width } = migrateLegacyAlign(
            img.getAttribute("data-alignment"),
            img.getAttribute("data-align"),
            wAttr ? parseInt(wAttr, 10) : null
          );
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") ?? "",
            title: img.getAttribute("title"),
            align,
            width,
            caption: img.getAttribute("data-caption") ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { src, alt, title, align, width, caption } = node.attrs as {
      src: string; alt: string; title: string | null;
      align: Align; width: number | null; caption: string;
    };
    const figAttrs: Record<string, string> = {
      "data-ame-fig": "",
      "data-align": align || "center",
    };
    if (width) {
      figAttrs["data-width"] = String(width);
      figAttrs.style = `width:${width}%`;
    }

    const imgAttrs: Record<string, string> = { src: src ?? "", alt: alt ?? "" };
    if (title) imgAttrs.title = title;

    const img = ["img", mergeAttributes(this.options.HTMLAttributes, imgAttrs)];
    if (caption && caption.trim()) {
      return ["figure", figAttrs, img, ["figcaption", {}, caption]];
    }
    return ["figure", figAttrs, img];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

/* ════════════════════════════════════════════════════════════
   NODE VIEW : image interactive (resize % + align + légende + alt)
   ════════════════════════════════════════════════════════════ */
function ImageNodeView({ node, updateAttributes, selected, editor, deleteNode }: NodeViewProps) {
  const align: Align = (node.attrs.align as Align) ?? "center";
  const width: number | null = node.attrs.width ?? null;
  const caption: string = node.attrs.caption ?? "";
  const alt: string = node.attrs.alt ?? "";

  const mediaRef = useRef<HTMLDivElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<number | null>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const editable = editor.isEditable;
  const shown = dragWidth ?? width;

  const startResize = (e: React.PointerEvent, side: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    const media = mediaRef.current;
    if (!media) return;
    const column = (media.closest(".rich-prose") as HTMLElement | null) ?? media.parentElement;
    const columnW = column?.clientWidth ?? media.offsetWidth;
    const startX = e.clientX;
    const startW = media.offsetWidth;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const raw = side === "left" ? startW - dx : startW + dx;
      const pct = Math.max(20, Math.min(100, Math.round((raw / columnW) * 100)));
      dragRef.current = pct;
      setDragWidth(pct);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (dragRef.current != null) updateAttributes({ width: dragRef.current });
      dragRef.current = null;
      setDragWidth(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const editAlt = () => {
    const next = window.prompt(
      "Texte alternatif (décrit l'image pour l'accessibilité et le référencement) :",
      alt
    );
    if (next !== null) updateAttributes({ alt: next.trim() });
  };

  const replace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadImage(file);
      updateAttributes({ src: url });
    } catch (err) {
      window.alert(err instanceof UploadError ? err.message : "Échec du remplacement.");
    } finally {
      setBusy(false);
    }
  };

  const noBlur = (e: React.MouseEvent) => e.preventDefault();

  return (
    <NodeViewWrapper
      as="figure"
      className={`ame-fig ame-fig--${align}${selected ? " is-selected" : ""}${dragWidth != null ? " is-resizing" : ""}`}
      data-align={align}
      data-width={shown ?? undefined}
      style={{ width: shown ? `${shown}%` : undefined }}
    >
      <div className="ame-fig-media" ref={mediaRef} data-drag-handle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={node.attrs.src} alt={alt} draggable={false} />

        {busy && <div className="ame-fig-busy" contentEditable={false}><span className="spinner" aria-hidden /></div>}

        {editable && selected && (
          <>
            <span className="ame-fig-handle ame-fig-handle--left" onPointerDown={(e) => startResize(e, "left")} contentEditable={false} aria-hidden />
            <span className="ame-fig-handle ame-fig-handle--right" onPointerDown={(e) => startResize(e, "right")} contentEditable={false} aria-hidden />

            <div className="ame-fig-bar" contentEditable={false}>
              <div className="ame-fig-bar-group">
                {ALIGNS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`ame-fig-btn${align === a ? " is-on" : ""}`}
                    title={a === "left" ? "Aligner à gauche" : a === "center" ? "Centrer" : "Aligner à droite"}
                    onMouseDown={noBlur}
                    onClick={() => updateAttributes({ align: a })}
                  >
                    {a === "left" ? "◧" : a === "center" ? "▣" : "◨"}
                  </button>
                ))}
              </div>
              <div className="ame-fig-bar-group">
                {SIZE_PRESETS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`ame-fig-btn${(shown ?? 100) === s.value ? " is-on" : ""}`}
                    title={s.title}
                    onMouseDown={noBlur}
                    onClick={() => updateAttributes({ width: s.value === 100 ? null : s.value })}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="ame-fig-bar-group">
                <button
                  type="button"
                  className={`ame-fig-btn${alt.trim() ? "" : " is-warn"}`}
                  title={alt.trim() ? `Texte alternatif : « ${alt} »` : "Ajouter un texte alternatif (recommandé)"}
                  onMouseDown={noBlur}
                  onClick={editAlt}
                >
                  Alt
                </button>
                <button type="button" className="ame-fig-btn" title="Remplacer l'image" onMouseDown={noBlur} onClick={() => replaceRef.current?.click()}>⟳</button>
                <button type="button" className="ame-fig-btn ame-fig-btn--danger" title="Supprimer l'image" onMouseDown={noBlur} onClick={() => deleteNode()}>×</button>
              </div>
            </div>
          </>
        )}
      </div>

      {(editable || caption) && (
        <figcaption>
          {editable ? (
            <input
              type="text"
              className="ame-fig-caption-input"
              placeholder="Légende (facultatif)…"
              value={caption}
              onChange={(e) => updateAttributes({ caption: e.target.value })}
              contentEditable={false}
            />
          ) : (
            caption
          )}
        </figcaption>
      )}

      <input ref={replaceRef} type="file" accept={ACCEPTED_IMAGE_TYPES} hidden onChange={replace} />
    </NodeViewWrapper>
  );
}

/* ════════════════════════════════════════════════════════════
   ÉDITEUR
   ════════════════════════════════════════════════════════════ */
export default function RichEditor({ name, defaultValue = "", placeholder }: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Ref stable vers la dernière fonction d'insertion : les handlers paste/drop
  // de TipTap sont créés une seule fois et captureraient sinon une version périmée.
  const insertRef = useRef<(file: File, pos?: number | null) => void>(() => {});

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      FigureImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: placeholder ?? "Commencez à écrire votre article…",
        showOnlyWhenEditable: true,
      }),
      Youtube.configure({ controls: true, nocookie: true, width: 640, height: 360 }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: { class: "rich-prose" },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((f) => insertRef.current(f));
        return true;
      },
      handleDrop: (view, event) => {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: (event as DragEvent).clientX, top: (event as DragEvent).clientY });
        const pos = coords?.pos ?? null;
        files.forEach((f) => insertRef.current(f, pos));
        return true;
      },
    },
  });

  const insertImageFile = useCallback(
    async (file: File, pos?: number | null) => {
      if (!editor) return;
      setUploadError(null);
      setUploadCount((c) => c + 1);
      try {
        const { url } = await uploadImage(file);
        const altGuess = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
        const attrs = { src: url, alt: altGuess };
        if (typeof pos === "number") {
          editor.chain().focus().insertContentAt(pos, { type: "image", attrs }).run();
        } else {
          editor.chain().focus().insertContent({ type: "image", attrs }).run();
        }
      } catch (err) {
        setUploadError(err instanceof UploadError ? err.message : "L'envoi de l'image a échoué.");
      } finally {
        setUploadCount((c) => Math.max(0, c - 1));
      }
    },
    [editor]
  );
  insertRef.current = insertImageFile;

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    files.forEach((f) => void insertImageFile(f));
  };

  if (!editor) {
    return <div className="rich-loading">Chargement de l&apos;éditeur…</div>;
  }

  const isActive = (n: string, attrs?: Record<string, unknown>) => editor.isActive(n, attrs);

  const insertLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien :", previousUrl ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const insertYoutube = () => {
    const url = window.prompt("Lien de la vidéo YouTube :", "https://www.youtube.com/watch?v=");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url.trim() });
  };

  return (
    <div className="rich">
      <div className="rich-tools" role="toolbar" aria-label="Mise en forme">
        <Group>
          <Btn label="B" on={isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Gras (Ctrl+B)" style={{ fontWeight: 700 }} />
          <Btn label="I" on={isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique (Ctrl+I)" style={{ fontStyle: "italic" }} />
          <Btn label="U" on={isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Souligné (Ctrl+U)" style={{ textDecoration: "underline" }} />
          <Btn label="S" on={isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Barré" style={{ textDecoration: "line-through" }} />
        </Group>
        <Group>
          <Btn label="Titre" on={isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Titre de section" />
          <Btn label="Sous-titre" on={isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Sous-titre" />
          <Btn label="¶" on={isActive("paragraph") && !isActive("heading")} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraphe normal" />
        </Group>
        <Group>
          <Btn label="•" on={isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Liste à puces" />
          <Btn label="1." on={isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée" />
          <Btn label="❝" on={isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citation" />
          <Btn label="―" on={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Séparateur" />
        </Group>
        <Group>
          <Btn label="⬅" on={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Texte à gauche" />
          <Btn label="⬌" on={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Texte centré" />
          <Btn label="➡" on={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Texte à droite" />
        </Group>
        <Group>
          <Btn label="🔗" on={isActive("link")} onClick={insertLink} title="Insérer un lien" />
          <label className="rich-btn" title="Insérer une image" style={{ cursor: "pointer" }}>
            🖼
            <input type="file" accept={ACCEPTED_IMAGE_TYPES} hidden multiple onChange={handleFileInput} />
          </label>
          <Btn label="▶" on={false} onClick={insertYoutube} title="Vidéo YouTube" />
        </Group>
        <Group>
          <Btn label="↶" on={false} onClick={() => editor.chain().focus().undo().run()} title="Annuler (Ctrl+Z)" />
          <Btn label="↷" on={false} onClick={() => editor.chain().focus().redo().run()} title="Rétablir (Ctrl+Y)" />
        </Group>
        {uploadCount > 0 && (
          <span className="rich-upload"><span className="spinner" aria-hidden /> Envoi de l&apos;image…</span>
        )}
      </div>

      {uploadError && (
        <div className="rich-uploaderr" role="alert">
          {uploadError}
          <button type="button" onClick={() => setUploadError(null)} aria-label="Fermer">×</button>
        </div>
      )}

      <EditorContent editor={editor} className="rich-content" />

      <p className="rich-hint">
        Astuce : cliquez une image pour la <strong>redimensionner</strong> (poignées rouges ou boutons S/M/L),
        l&apos;<strong>aligner</strong>, ajouter une <strong>légende</strong> ou un <strong>texte alternatif</strong>.
        Vous pouvez aussi glisser-déposer ou coller une image directement.
      </p>

      <textarea name={name} value={html} hidden readOnly />
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="rich-group">{children}</div>;
}

function Btn({
  label, onClick, on, title, style,
}: {
  label: string;
  onClick: () => void;
  on: boolean;
  title: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`rich-btn${on ? " is-on" : ""}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      title={title}
      aria-label={title}
      aria-pressed={on}
      style={style}
    >
      {label}
    </button>
  );
}
