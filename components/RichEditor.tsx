"use client";

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExt from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;             // nom du champ caché côté formulaire (body_html)
  defaultValue?: string;    // HTML initial
  placeholder?: string;
}

/**
 * Image avec redimensionnement à la souris + alignements (gauche / centre /
 * droite / pleine largeur). Pas de positionnement absolu (pour rester
 * responsive sur mobile).
 */
type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const alignment: string = node.attrs.alignment ?? "center";
  const width: string = node.attrs.width ?? "100%";
  const height: string = node.attrs.height ?? "auto";
  const caption: string = node.attrs.caption ?? "";

  /**
   * Comportement Word-like par poignée :
   *   - 4 coins (NW/NE/SE/SW) : redimensionnent proportionnellement (ratio conservé)
   *   - 2 milieux horizontaux (E/W) : changent la largeur uniquement
   *   - 2 milieux verticaux (N/S) : changent la hauteur uniquement (ratio cassé)
   */
  const startResize = (handle: ResizeHandle) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const img = containerRef.current?.querySelector("img");
    if (!img) return;

    const startRect = img.getBoundingClientRect();
    const startWidthPx = startRect.width;
    const startHeightPx = startRect.height;

    // Le conteneur de référence pour le calcul de la largeur en %
    const parentEl =
      containerRef.current?.parentElement?.parentElement ??
      containerRef.current?.parentElement;
    const parentWidth = parentEl?.getBoundingClientRect().width ?? 800;

    const isCorner = handle.length === 2; // nw/ne/se/sw
    const isHoriz = handle === "e" || handle === "w";
    const isVert = handle === "n" || handle === "s";

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      if (isCorner) {
        // Coin → ratio conservé. La direction du coin détermine le signe.
        let deltaX = 0;
        switch (handle) {
          case "ne": deltaX = Math.max(dx, -dy); break;
          case "nw": deltaX = Math.max(-dx, -dy); break;
          case "se": deltaX = Math.max(dx, dy); break;
          case "sw": deltaX = Math.max(-dx, dy); break;
        }
        const newW = Math.max(80, Math.min(parentWidth, startWidthPx + deltaX));
        const newPct = Math.round((newW / parentWidth) * 100);
        updateAttributes({ width: `${newPct}%`, height: "auto" });
      } else if (isHoriz) {
        // Milieu gauche/droite → largeur uniquement
        const delta = handle === "e" ? dx : -dx;
        const newW = Math.max(80, Math.min(parentWidth, startWidthPx + delta));
        const newPct = Math.round((newW / parentWidth) * 100);
        // Si height était fixé, on le garde en px (Word-style : on déforme)
        updateAttributes({ width: `${newPct}%` });
      } else if (isVert) {
        // Milieu haut/bas → hauteur uniquement (squish/stretch)
        const delta = handle === "s" ? dy : -dy;
        const newH = Math.max(60, Math.min(1200, startHeightPx + delta));
        updateAttributes({ height: `${Math.round(newH)}px` });
      }
    };

    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Style sur l'image elle-même pour avoir un redimensionnement précis.
  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: height && height !== "auto" ? "100%" : "auto",
    objectFit: height && height !== "auto" ? "fill" : undefined,
  };

  return (
    <NodeViewWrapper
      className={`tt-image tt-image--${alignment}${selected ? " is-selected" : ""}`}
      data-alignment={alignment}
      data-drag-handle
    >
      <div
        className="tt-image-frame"
        ref={containerRef}
        style={{ width, height: height && height !== "auto" ? height : undefined }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          draggable={false}
          style={imgStyle}
        />
        {selected && (
          <>
            {/* 8 poignées Word — chacune a sa propre sémantique */}
            <div className="tt-h tt-h-nw" onMouseDown={startResize("nw")} title="Redimensionner (proportionnel)" />
            <div className="tt-h tt-h-n"  onMouseDown={startResize("n")}  title="Modifier la hauteur" />
            <div className="tt-h tt-h-ne" onMouseDown={startResize("ne")} title="Redimensionner (proportionnel)" />
            <div className="tt-h tt-h-e"  onMouseDown={startResize("e")}  title="Modifier la largeur" />
            <div className="tt-h tt-h-se" onMouseDown={startResize("se")} title="Redimensionner (proportionnel)" />
            <div className="tt-h tt-h-s"  onMouseDown={startResize("s")}  title="Modifier la hauteur" />
            <div className="tt-h tt-h-sw" onMouseDown={startResize("sw")} title="Redimensionner (proportionnel)" />
            <div className="tt-h tt-h-w"  onMouseDown={startResize("w")}  title="Modifier la largeur" />
            <div className="tt-toolbar">
              <button type="button" title="Aligner à gauche"  onClick={() => updateAttributes({ alignment: "left" })}>⬅</button>
              <button type="button" title="Centrer"            onClick={() => updateAttributes({ alignment: "center" })}>⬌</button>
              <button type="button" title="Aligner à droite"   onClick={() => updateAttributes({ alignment: "right" })}>➡</button>
              <button type="button" title="Pleine largeur"     onClick={() => updateAttributes({ alignment: "wide", width: "100%", height: "auto" })}>⛶</button>
              <span className="tt-toolbar-sep" />
              <button type="button" title="Réinitialiser ratio"     onClick={() => updateAttributes({ height: "auto" })}>⤺</button>
            </div>
          </>
        )}
      </div>
      {(selected || caption) && (
        <input
          type="text"
          className="tt-image-caption"
          placeholder="Légende (facultative)…"
          value={caption}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
        />
      )}
      {dragging && <div className="tt-resize-hint">Glissez pour redimensionner — relâchez pour valider</div>}
    </NodeViewWrapper>
  );
}

const ResizableImage = ImageExt.extend({
  name: "image",
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width:     { default: "100%", parseHTML: (e) => e.getAttribute("data-width")     ?? "100%",   renderHTML: (a) => ({ "data-width":     a.width     }) },
      height:    { default: "auto", parseHTML: (e) => e.getAttribute("data-height")    ?? "auto",   renderHTML: (a) => ({ "data-height":    a.height    }) },
      alignment: { default: "center", parseHTML: (e) => e.getAttribute("data-alignment") ?? "center", renderHTML: (a) => ({ "data-alignment": a.alignment }) },
      caption:   { default: "",     parseHTML: (e) => e.getAttribute("data-caption")   ?? "",       renderHTML: (a) => ({ "data-caption":   a.caption   }) },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

export default function RichEditor({ name, defaultValue = "", placeholder }: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Désactive le module Link/Image natif de StarterKit pour utiliser nos versions
        link: false,
      }),
      UnderlineExt,
      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Tapez votre article… ou « / » pour insérer un bloc",
      }),
      Youtube.configure({ controls: true, nocookie: true, width: 640, height: 360 }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  // Upload images (drag-and-drop & click)
  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) return data.url;
      alert(data.message ?? "Erreur upload");
      return null;
    } catch {
      alert("Erreur réseau pendant l'upload.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const insertImage = async (file: File) => {
    const url = await uploadFile(file);
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => insertImage(f));
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (!e.dataTransfer.files.length) return;
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    for (const file of files) await insertImage(file);
  };

  // Sync vers le textarea caché à chaque change
  useEffect(() => {
    if (!editor) return;
    setHtml(editor.getHTML());
  }, [editor]);

  if (!editor) {
    return <div className="rich-editor-loading">Chargement de l&apos;éditeur…</div>;
  }

  const isActive = (name: string, attrs?: Record<string, unknown>) => editor.isActive(name, attrs);

  const insertLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien :", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertYoutube = () => {
    const url = window.prompt("URL YouTube :", "https://www.youtube.com/watch?v=");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  return (
    <div className="rich-editor" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="rich-toolbar" role="toolbar" aria-label="Barre d'outils éditeur">
        <ToolGroup>
          <ToolBtn label="B"        active={isActive("bold")}      onClick={() => editor.chain().focus().toggleBold().run()}        title="Gras (Ctrl+B)" style={{ fontWeight: 700 }} />
          <ToolBtn label="I"        active={isActive("italic")}    onClick={() => editor.chain().focus().toggleItalic().run()}      title="Italique (Ctrl+I)" style={{ fontStyle: "italic" }} />
          <ToolBtn label="U"        active={isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}   title="Souligné (Ctrl+U)" style={{ textDecoration: "underline" }} />
          <ToolBtn label="S"        active={isActive("strike")}    onClick={() => editor.chain().focus().toggleStrike().run()}      title="Barré" style={{ textDecoration: "line-through" }} />
        </ToolGroup>

        <ToolGroup>
          <ToolBtn label="H₂" active={isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Titre" />
          <ToolBtn label="H₃" active={isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Sous-titre" />
          <ToolBtn label="¶"  active={isActive("paragraph")}             onClick={() => editor.chain().focus().setParagraph().run()}            title="Paragraphe" />
        </ToolGroup>

        <ToolGroup>
          <ToolBtn label="•" active={isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()}  title="Liste à puces" />
          <ToolBtn label="1." active={isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée" />
          <ToolBtn label="❝"  active={isActive("blockquote")}  onClick={() => editor.chain().focus().toggleBlockquote().run()}  title="Citation" />
          <ToolBtn label="—"  active={false}                   onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Séparateur" />
        </ToolGroup>

        <ToolGroup>
          <ToolBtn label="⬅" active={editor.isActive({ textAlign: "left" })}    onClick={() => editor.chain().focus().setTextAlign("left").run()}    title="Aligner à gauche" />
          <ToolBtn label="⬌" active={editor.isActive({ textAlign: "center" })}  onClick={() => editor.chain().focus().setTextAlign("center").run()}  title="Centrer" />
          <ToolBtn label="➡" active={editor.isActive({ textAlign: "right" })}   onClick={() => editor.chain().focus().setTextAlign("right").run()}   title="Aligner à droite" />
          <ToolBtn label="≡" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justifier" />
        </ToolGroup>

        <ToolGroup>
          <ToolBtn label="🔗" active={isActive("link")} onClick={insertLink}    title="Lien" />
          <label className="rich-tool-btn" title="Ajouter une image">
            🖼
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden multiple onChange={handleFileInput} />
          </label>
          <ToolBtn label="▶"  active={false} onClick={insertYoutube} title="Vidéo YouTube" />
        </ToolGroup>

        <ToolGroup>
          <ToolBtn label="↶" active={false} onClick={() => editor.chain().focus().undo().run()} title="Annuler (Ctrl+Z)" />
          <ToolBtn label="↷" active={false} onClick={() => editor.chain().focus().redo().run()} title="Rétablir (Ctrl+Y)" />
        </ToolGroup>

        {uploading && <span className="rich-uploading"><span className="spinner" aria-hidden /> Upload…</span>}
      </div>

      <EditorContent editor={editor} className="rich-editor-content" />

      {/* Champ caché qui transporte le HTML vers le formulaire serveur */}
      <textarea name={name} value={html} hidden readOnly />
      <p className="rich-hint">
        💡 Astuce : glissez-déposez des images directement dans l&apos;éditeur. Cliquez sur une image pour la
        redimensionner ou changer son alignement.
      </p>
    </div>
  );
}

function ToolGroup({ children }: { children: React.ReactNode }) {
  return <div className="rich-tool-group">{children}</div>;
}

function ToolBtn({
  label, onClick, active, title, style,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  title: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`rich-tool-btn${active ? " is-active" : ""}`}
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      style={style}
    >
      {label}
    </button>
  );
}
