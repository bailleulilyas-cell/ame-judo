"use client";

import Link from "next/link";
import { useState, useRef, useTransition, useEffect } from "react";
import RichEditor from "./RichEditor";
import { renderArticleBody } from "@/lib/markdown";
import { uploadImage, UploadError, ACCEPTED_IMAGE_TYPES } from "@/lib/image-upload";
import type { Actualite } from "@/types";

interface Props {
  actualite?: Actualite | null;
  action: (formData: FormData) => Promise<void> | void;
  mode: "create" | "edit";
}

interface PreviewSnap {
  titre: string;
  extrait: string;
  kanji: string;
  categorie: string;
  date: string;
  bodyHtml: string;
  cover: string;
}

const CATEGORIES = ["Actualité", "Stage", "Compétition", "Événement", "Information"] as const;

const KANJIS: { char: string; label: string }[] = [
  { char: "報", label: "Annonce" },
  { char: "祭", label: "Stage" },
  { char: "勝", label: "Victoire" },
  { char: "新", label: "Nouveau" },
  { char: "学", label: "Apprentissage" },
  { char: "団", label: "Groupe" },
  { char: "始", label: "Début" },
  { char: "賞", label: "Récompense" },
];

function slugify(s: string): string {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function ActualiteEditor({ actualite, action, mode }: Props) {
  const [isPending, startTransition] = useTransition();
  const [titre, setTitre]       = useState(actualite?.titre ?? "");
  const [extrait, setExtrait]   = useState(actualite?.extrait ?? "");
  const [slug, setSlug]         = useState(actualite?.slug ?? "");
  const [slugTouched, setSlugT] = useState(!!actualite?.slug);
  const [kanji, setKanji]       = useState(actualite?.kanji ?? "報");
  const [categorie, setCateg]   = useState(actualite?.categorie ?? "Actualité");
  const [datePub, setDatePub]   = useState(actualite?.date_publication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [statut, setStatut]     = useState<"draft" | "published">(actualite?.statut ?? "draft");
  const [cover, setCover]       = useState(actualite?.photo_url ?? "");
  const [focus, setFocus]       = useState(actualite?.photo_focus ?? "50% 50%");
  const [pole, setPole]         = useState<"jeunes" | "veteran">(actualite?.compet_pole ?? "jeunes");
  const [medOr, setMedOr]       = useState(actualite?.compet_or ?? 0);
  const [medArg, setMedArg]     = useState(actualite?.compet_argent ?? 0);
  const [medBro, setMedBro]     = useState(actualite?.compet_bronze ?? 0);
  const [error, setError]       = useState<string | null>(null);
  const [preview, setPreview]   = useState<PreviewSnap | null>(null);
  const [kanjiOpen, setKanjiO]  = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (preview) setPreview(null);
      else if (kanjiOpen) setKanjiO(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, kanjiOpen]);

  const handleTitre = (v: string) => {
    setTitre(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleSlug = (v: string) => {
    setSlug(slugify(v));
    setSlugT(true);
  };

  const openPreview = () => {
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
      cover,
    });
  };

  const submit = (nextStatut: "draft" | "published") => {
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

  const formattedDate = datePub
    ? new Date(datePub).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const isCompet = categorie === "Compétition";

  return (
    <>
      <form ref={formRef} className="ed-page">
        {/* ━━━━━━━━━━━━━━━━━━━━━━ BARRE FIXE EN HAUT ━━━━━━━━━━━━━━━━━━━━━━ */}
        <header className="ed-bar">
          <Link href="/admin/actualites" className="ed-back" title="Retour à la liste des actualités">
            <span aria-hidden>←</span> Actualités
          </Link>

          <span className={`ed-pill ed-pill--${statut}`}>
            {statut === "published" ? "● Publié" : "○ Brouillon"}
          </span>

          <div className="ed-bar-actions">
            <button type="button" className="ed-btn" onClick={openPreview} disabled={isPending} title="Voir le rendu publié (sans rien enregistrer)">
              <span aria-hidden>👁</span> Aperçu
            </button>
            <button type="button" className="ed-btn" onClick={() => submit("draft")} disabled={isPending}>
              {isPending && statut === "draft" ? "…" : "Brouillon"}
            </button>
            <button type="button" className="ed-btn ed-btn--primary" onClick={() => submit("published")} disabled={isPending}>
              {isPending && statut === "published"
                ? (mode === "edit" ? "Mise à jour…" : "Publication…")
                : (mode === "edit" ? "Mettre à jour" : "Publier")}
            </button>
          </div>
        </header>

        {error && (
          <div className="ed-error" role="alert">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━ MÉTADONNÉES ━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="ed-meta">
          <div className="ed-meta-field">
            <label htmlFor="m-kanji">Kanji</label>
            <div className="ed-kanji-wrap">
              <input
                id="m-kanji" name="kanji" type="text" maxLength={2} value={kanji}
                onChange={(e) => setKanji(e.target.value.slice(0, 2))}
                onFocus={() => setKanjiO(false)}
                className="ed-kanji-input" lang="ja"
              />
              <button type="button" className="ed-kanji-pick" onClick={() => setKanjiO((v) => !v)} title="Choisir un kanji" aria-haspopup="true" aria-expanded={kanjiOpen}>▾</button>
              {kanjiOpen && (
                <div className="ed-kanji-menu" role="menu">
                  {KANJIS.map((k) => (
                    <button key={k.char} type="button" role="menuitem"
                      className={`ed-kanji-item${kanji === k.char ? " is-active" : ""}`}
                      onClick={() => { setKanji(k.char); setKanjiO(false); }}>
                      <span lang="ja">{k.char}</span>
                      <small>{k.label}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ed-meta-field">
            <label htmlFor="m-cat">Catégorie</label>
            <select id="m-cat" name="categorie" value={categorie} onChange={(e) => setCateg(e.target.value)} className="ed-input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="ed-meta-field">
            <label htmlFor="m-date">Date</label>
            <input id="m-date" name="date_publication" type="date" value={datePub} onChange={(e) => setDatePub(e.target.value)} className="ed-input" />
          </div>

          <div className="ed-meta-field ed-meta-field--grow">
            <label htmlFor="m-slug">URL (slug)</label>
            <input id="m-slug" name="slug" type="text" value={slug} placeholder="généré automatiquement depuis le titre" onChange={(e) => handleSlug(e.target.value)} className="ed-input" />
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━ BLOC COMPÉTITION (adaptatif) ━━━━━━━━━━━━━━━━━━━━━━ */}
        {isCompet && (
          <section className="ed-compet" aria-label="Détails de la compétition">
            <div className="ed-compet-head">
              <span className="ed-compet-kanji" lang="ja" aria-hidden>競</span>
              <div>
                <h2 className="ed-compet-title">Résultats de compétition</h2>
                <p className="ed-compet-sub">
                  Ces informations alimentent la page <strong>Compétition</strong> du site.
                  Le reste (récit, détails) s’écrit dans l’article ci-dessous.
                </p>
              </div>
            </div>

            <div className="ed-compet-grid">
              <div className="ed-compet-field">
                <label>Pôle</label>
                <div className="ed-pole-toggle" role="group" aria-label="Pôle">
                  <button type="button" className={`ed-pole-opt${pole === "jeunes" ? " is-on" : ""}`} onClick={() => setPole("jeunes")}>
                    <span lang="ja" aria-hidden>少</span> Jeunes
                  </button>
                  <button type="button" className={`ed-pole-opt${pole === "veteran" ? " is-on" : ""}`} onClick={() => setPole("veteran")}>
                    <span lang="ja" aria-hidden>達</span> Vétérans
                  </button>
                </div>
              </div>

              <div className="ed-compet-field">
                <label>Médailles</label>
                <div className="ed-medals">
                  <MedalInput label="Or" tone="or" value={medOr} onChange={setMedOr} />
                  <MedalInput label="Argent" tone="argent" value={medArg} onChange={setMedArg} />
                  <MedalInput label="Bronze" tone="bronze" value={medBro} onChange={setMedBro} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━ IMAGE DE COUVERTURE ━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="ed-compet" aria-label="Image de couverture">
          <div className="ed-compet-head">
            <span className="ed-compet-kanji" lang="ja" aria-hidden>絵</span>
            <div>
              <h2 className="ed-compet-title">Image de couverture</h2>
              <p className="ed-compet-sub">
                Sert de <strong>vignette dans la liste des actualités</strong> et de grande image
                en haut de l’article. Une fois l’image ajoutée, <strong>cliquez dessus</strong> pour
                choisir la partie qui restera visible dans la vignette.
              </p>
            </div>
          </div>
          <PhotoField value={cover} onChange={setCover} focus={focus} onFocusChange={setFocus} />
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━ ARTICLE (feuille) ━━━━━━━━━━━━━━━━━━━━━━ */}
        <article className="ed-paper">
          <div className="ed-paper-head">
            <div className="ed-paper-kanji" lang="ja" aria-hidden>{kanji || "·"}</div>
            <div className="ed-paper-cat">
              <span className="ed-cat-dot" aria-hidden />
              <span>{categorie}</span>
              <span>·</span>
              <time dateTime={datePub}>{formattedDate}</time>
            </div>
          </div>

          <input
            name="titre" type="text" placeholder="Titre de l'article…" value={titre}
            onChange={(e) => handleTitre(e.target.value)}
            className="ed-paper-titre" required maxLength={255}
          />

          <textarea
            name="extrait"
            placeholder="Chapô — 1 à 2 phrases d'introduction (apparaît aussi dans la liste et sur Google)."
            value={extrait}
            onChange={(e) => setExtrait(e.target.value)}
            className="ed-paper-extrait" required rows={2} maxLength={500}
          />

          <div className="ed-paper-body">
            <RichEditor
              name="body_html"
              defaultValue={actualite?.body_html ?? actualite?.body ?? ""}
              placeholder="Commencez à écrire votre article…"
            />
          </div>
        </article>

        {/* Champs cachés */}
        <input type="hidden" name="body"          value={actualite?.body ?? ""} />
        <input type="hidden" name="photo_url"     value={cover} />
        <input type="hidden" name="photo_focus"   value={cover ? focus : ""} />
        <input type="hidden" name="compet_pole"   value={isCompet ? pole : ""} />
        <input type="hidden" name="compet_or"     value={isCompet ? medOr : 0} />
        <input type="hidden" name="compet_argent" value={isCompet ? medArg : 0} />
        <input type="hidden" name="compet_bronze" value={isCompet ? medBro : 0} />
        <input type="hidden" name="statut"        value={statut} />
      </form>

      {/* ━━━━━━━━━━━━━━━━━━━━━━ APERÇU (MODAL) ━━━━━━━━━━━━━━━━━━━━━━ */}
      {preview && (
        <div className="ed-preview" role="dialog" aria-modal="true" aria-label="Aperçu de l'article">
          <header className="ed-preview-bar">
            <span className="ed-preview-tag">Aperçu — exactement comme il sera publié</span>
            <button type="button" className="ed-btn ed-btn--primary" onClick={() => setPreview(null)} autoFocus>
              ← Revenir à l&apos;édition
            </button>
          </header>
          <div className="ed-preview-scroll">
            <article className="container article">
              <div className="article-kanji" lang="ja" aria-hidden>{preview.kanji}</div>
              <div className="article-meta">
                <span className="actu-cat-dot" aria-hidden />
                <span>{preview.categorie}</span>
                <span>·</span>
                <time dateTime={preview.date}>
                  {preview.date
                    ? new Date(preview.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </time>
              </div>
              <h1 className="article-title">{preview.titre}</h1>
              {preview.extrait && <p className="article-lead">{preview.extrait}</p>}
              {preview.cover && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className="article-cover" src={preview.cover} alt={preview.titre} />
              )}
              <div
                className="article-body markdown-body"
                dangerouslySetInnerHTML={{ __html: renderArticleBody(preview.bodyHtml, "") }}
              />
            </article>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Compteur de médailles ─── */
function MedalInput({
  label, tone, value, onChange,
}: { label: string; tone: "or" | "argent" | "bronze"; value: number; onChange: (n: number) => void }) {
  const clamp = (n: number) => Math.max(0, Math.min(99, n));
  return (
    <div className={`ed-medal ed-medal--${tone}`}>
      <span className="ed-medal-dot" aria-hidden />
      <button type="button" className="ed-medal-step" onClick={() => onChange(clamp(value - 1))} aria-label={`Retirer une médaille ${label}`}>−</button>
      <input
        type="number" min={0} max={99} value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10) || 0))}
        className="ed-medal-num" aria-label={`Médailles ${label}`}
      />
      <button type="button" className="ed-medal-step" onClick={() => onChange(clamp(value + 1))} aria-label={`Ajouter une médaille ${label}`}>+</button>
      <span className="ed-medal-label">{label}</span>
    </div>
  );
}

/* ─── Champ photo de couverture + sélecteur de point focal ─── */
function parseFocus(focus: string): { x: number; y: number } {
  const m = focus.match(/^(\d{1,3})%\s+(\d{1,3})%$/);
  if (!m) return { x: 50, y: 50 };
  return { x: Math.min(100, Math.max(0, +m[1])), y: Math.min(100, Math.max(0, +m[2])) };
}

function PhotoField({
  value, onChange, focus = "50% 50%", onFocusChange,
}: {
  value: string;
  onChange: (url: string) => void;
  focus?: string;
  onFocusChange?: (focus: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [dragging, setDragging] = useState(false);

  const { x, y } = parseFocus(focus);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setErr("");
    setBusy(true);
    try {
      const { url } = await uploadImage(f);
      onChange(url);
      onFocusChange?.("50% 50%"); // nouvelle image → focal recentré
    } catch (x) {
      setErr(x instanceof UploadError ? x.message : "Échec de l'envoi.");
    } finally {
      setBusy(false);
    }
  };

  const setFocusFromPointer = (clientX: number, clientY: number) => {
    const el = imgWrapRef.current;
    if (!el || !onFocusChange) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const px = Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
    const py = Math.round(Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100)));
    onFocusChange(`${px}% ${py}%`);
  };

  return (
    <div className="ed-cover">
      {value ? (
        <>
          <div
            ref={imgWrapRef}
            className={`ed-focus-pick${dragging ? " is-dragging" : ""}`}
            onPointerDown={(e) => {
              if (!onFocusChange) return;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              setDragging(true);
              setFocusFromPointer(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => { if (dragging) setFocusFromPointer(e.clientX, e.clientY); }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            title="Cliquez ou glissez pour choisir la partie visible dans la vignette"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="ed-focus-img" draggable={false} />
            {onFocusChange && (
              <span className="ed-focus-dot" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden />
            )}
          </div>
          {onFocusChange && (
            <p className="ed-focus-hint">
              Point focal : <strong>{x}% · {y}%</strong> — cliquez sur l’image pour le déplacer.
            </p>
          )}
          <div className="ed-cover-actions">
            <button type="button" className="ed-cover-act" onClick={() => ref.current?.click()} disabled={busy}>
              {busy ? "Envoi…" : "Remplacer l’image"}
            </button>
            <button type="button" className="ed-cover-act ed-cover-act--danger" onClick={() => { onChange(""); onFocusChange?.("50% 50%"); }}>
              Retirer
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="ed-cover-empty" onClick={() => ref.current?.click()} disabled={busy}>
          <span className="ed-cover-empty-icon" aria-hidden>🖼</span>
          {busy ? "Envoi en cours…" : "Ajouter une image de couverture"}
        </button>
      )}
      {err && <p className="ed-cover-err" role="alert">{err}</p>}
      <input ref={ref} type="file" accept={ACCEPTED_IMAGE_TYPES} hidden onChange={pick} />
    </div>
  );
}
