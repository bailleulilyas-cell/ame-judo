"use client";

import Link from "next/link";
import { useState, useRef, useTransition, useEffect } from "react";
import RichEditor from "./RichEditor";
import type { Actualite } from "@/types";

interface PreviewSnapshot {
  titre: string;
  extrait: string;
  kanji: string;
  categorie: string;
  date: string;
  bodyHtml: string;
}

interface Props {
  actualite?: Actualite | null;
  action: (formData: FormData) => Promise<void> | void;
  mode: "create" | "edit";
}

const CATEGORIES = [
  { value: "Actualité", label: "Actualité" },
  { value: "Stage", label: "Stage" },
  { value: "Compétition", label: "Compétition" },
  { value: "Événement", label: "Événement" },
  { value: "Information", label: "Information" },
];

const KANJIS = [
  { char: "報", label: "Annonce" },
  { char: "祭", label: "Stage / Fête" },
  { char: "勝", label: "Victoire" },
  { char: "新", label: "Nouveau" },
  { char: "学", label: "Apprentissage" },
  { char: "団", label: "Groupe" },
  { char: "始", label: "Début" },
  { char: "賞", label: "Récompense" },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function ActualiteEditor({ actualite, action, mode }: Props) {
  const [isPending, startTransition] = useTransition();
  const [titre, setTitre] = useState(actualite?.titre ?? "");
  const [extrait, setExtrait] = useState(actualite?.extrait ?? "");
  const [slug, setSlug] = useState(actualite?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!actualite?.slug);
  const [kanji, setKanji] = useState(actualite?.kanji ?? "報");
  const [categorie, setCategorie] = useState(actualite?.categorie ?? "Actualité");
  const [datePub, setDatePub] = useState(actualite?.date_publication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [statut, setStatut] = useState<"draft" | "published">(actualite?.statut ?? "draft");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewSnapshot | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Ferme l'aperçu avec Escape
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const handlePreview = () => {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    setPreview({
      titre:     (fd.get("titre")            as string) || "(Titre manquant)",
      extrait:   (fd.get("extrait")          as string) || "",
      kanji:     (fd.get("kanji")            as string) || kanji,
      categorie: (fd.get("categorie")        as string) || categorie,
      date:      (fd.get("date_publication") as string) || datePub,
      bodyHtml:  (fd.get("body_html")        as string) || "",
    });
  };

  const handleTitreChange = (v: string) => {
    setTitre(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleSubmit = (nextStatut: "draft" | "published") => {
    setError(null);
    setStatut(nextStatut);
    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    fd.set("statut", nextStatut);

    startTransition(async () => {
      try {
        await action(fd);
      } catch (err) {
        setError((err as Error).message || "Erreur lors de la sauvegarde.");
      }
    });
  };

  return (
    <>
    <form ref={formRef} className="ae-root">
      {/* ────── BARRE DU HAUT ────── */}
      <header className="ae-topbar">
        <Link href="/admin/actualites" className="ae-back">
          <span aria-hidden>←</span> Toutes les actualités
        </Link>

        <div className="ae-status">
          <span className={`ae-status-pill ae-status-pill--${statut}`}>
            {statut === "published" ? "● Publié" : "○ Brouillon"}
          </span>
          {actualite?.updated_at && (
            <span className="ae-saved">
              Modifié le {new Date(actualite.updated_at).toLocaleDateString("fr-FR")}
            </span>
          )}
        </div>

        <div className="ae-actions">
          <button
            type="button"
            className="ae-btn ae-btn--ghost"
            onClick={handlePreview}
            disabled={isPending}
            title="Voir l'article comme s'il était publié (sans rien sauvegarder)"
          >
            👁 Aperçu
          </button>
          <button
            type="button"
            className="ae-btn ae-btn--ghost"
            onClick={() => handleSubmit("draft")}
            disabled={isPending}
          >
            {isPending && statut === "draft" ? "Enregistrement…" : "Enregistrer en brouillon"}
          </button>
          <button
            type="button"
            className="ae-btn ae-btn--primary"
            onClick={() => handleSubmit("published")}
            disabled={isPending}
          >
            {isPending && statut === "published" ? "Publication…" : (mode === "edit" ? "Mettre à jour" : "Publier")}
            <span className="ae-btn-dot" aria-hidden />
          </button>
        </div>
      </header>

      {error && (
        <div className="ae-error" role="alert">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {/* ────── CONTENU PRINCIPAL ────── */}
      <div className="ae-workspace">
        <div className="ae-canvas">
          {/* ── BAREME META (kanji, catégorie, date) ── */}
          <div className="ae-meta-bar">
            <div className="ae-meta-item">
              <label htmlFor="kanji-input">Kanji</label>
              <div className="ae-kanji-wrap">
                <input
                  id="kanji-input"
                  name="kanji"
                  type="text"
                  maxLength={2}
                  value={kanji}
                  onChange={(e) => setKanji(e.target.value.slice(0, 2))}
                  className="ae-kanji-input"
                  lang="ja"
                />
                <details className="ae-kanji-picker">
                  <summary aria-label="Choisir un kanji">▾</summary>
                  <div className="ae-kanji-grid">
                    {KANJIS.map((k) => (
                      <button
                        type="button"
                        key={k.char}
                        onClick={() => setKanji(k.char)}
                        className={`ae-kanji-choice${kanji === k.char ? " is-active" : ""}`}
                        title={k.label}
                      >
                        <span lang="ja">{k.char}</span>
                        <span className="ae-kanji-label">{k.label}</span>
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </div>

            <div className="ae-meta-item">
              <label htmlFor="categorie-input">Catégorie</label>
              <select
                id="categorie-input"
                name="categorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="ae-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="ae-meta-item">
              <label htmlFor="date-input">Date</label>
              <input
                id="date-input"
                name="date_publication"
                type="date"
                value={datePub}
                onChange={(e) => setDatePub(e.target.value)}
                className="ae-input"
              />
            </div>

            <div className="ae-meta-item ae-meta-item--grow">
              <label htmlFor="slug-input">URL (slug)</label>
              <input
                id="slug-input"
                name="slug"
                type="text"
                value={slug}
                placeholder="généré automatiquement"
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                className="ae-input"
              />
            </div>
          </div>

          {/* Champ caché conservé pour compatibilité (vide = pas de couverture) */}
          <input type="hidden" name="photo_url" value="" />

          {/* ── KANJI + META PREVIEW (style article publié) ── */}
          <div className="ae-article-meta-preview">
            <span className="ae-article-kanji" lang="ja" aria-hidden>{kanji}</span>
            <div className="ae-article-meta">
              <span className="ae-cat-dot" aria-hidden />
              <span>{categorie}</span>
              <span>·</span>
              <span>{datePub ? new Date(datePub).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
            </div>
          </div>

          {/* ── TITRE (gros, comme publié) ── */}
          <input
            name="titre"
            type="text"
            placeholder="Titre de l'article…"
            value={titre}
            onChange={(e) => handleTitreChange(e.target.value)}
            className="ae-titre"
            required
            maxLength={255}
          />

          {/* ── EXTRAIT ── */}
          <textarea
            name="extrait"
            placeholder="Extrait — 1 à 2 phrases qui apparaissent dans la liste des actualités…"
            value={extrait}
            onChange={(e) => setExtrait(e.target.value)}
            className="ae-extrait"
            required
            rows={2}
            maxLength={500}
          />

          {/* ── CORPS (RichEditor) ── */}
          <div className="ae-body">
            <RichEditor
              name="body_html"
              defaultValue={actualite?.body_html ?? actualite?.body ?? ""}
              placeholder="Commencez à écrire votre article ici… Glissez-déposez des images, cliquez sur une image pour la redimensionner."
            />
          </div>

          {/* Champs cachés */}
          <input type="hidden" name="body" value={actualite?.body ?? ""} />
          <input type="hidden" name="statut" value={statut} />
        </div>
      </div>
    </form>

    {/* ────── MODAL APERÇU ────── */}
    {preview && (
      <div className="ae-preview-overlay" role="dialog" aria-modal="true" aria-label="Aperçu de l'article">
        <div className="ae-preview-topbar">
          <span className="ae-preview-tag">Aperçu — comme si l&apos;article était publié</span>
          <button
            type="button"
            className="ae-btn ae-btn--primary"
            onClick={() => setPreview(null)}
            autoFocus
          >
            ← Retour à l&apos;édition
          </button>
        </div>
        <div className="ae-preview-scroll">
          <article className="container article">
            <div className="article-kanji" lang="ja" aria-hidden>{preview.kanji}</div>
            <div className="article-meta">
              <span className="actu-cat-dot" aria-hidden />
              <span>{preview.categorie}</span>
              <span>·</span>
              <span>
                {preview.date
                  ? new Date(preview.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </span>
            </div>
            <h1 className="article-title">{preview.titre}</h1>
            {preview.extrait && (
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(17px, 1.6vw, 21px)", color: "var(--stone)", marginBottom: 32 }}>
                {preview.extrait}
              </p>
            )}
            <div
              className="article-body markdown-body"
              dangerouslySetInnerHTML={{ __html: preview.bodyHtml }}
            />
          </article>
        </div>
      </div>
    )}
    </>
  );
}
