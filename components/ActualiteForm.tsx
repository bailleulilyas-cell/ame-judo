"use client";

import Link from "next/link";
import type { Actualite } from "@/types";
import MarkdownEditor from "./MarkdownEditor";
import ImageUpload from "./ImageUpload";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  actualite?: Actualite | null;
  mode: "create" | "edit";
}

const KANJI_SUGGESTIONS = [
  { k: "報", label: "Annonce" },
  { k: "新", label: "Nouveauté" },
  { k: "祭", label: "Stage / Événement" },
  { k: "勝", label: "Victoire / Résultats" },
  { k: "学", label: "Apprentissage" },
  { k: "休", label: "Fermeture / Vacances" },
];

const CATEGORIES = ["Actualité", "Stage", "Compétition", "Information", "Fermeture", "Événement"];

export default function ActualiteForm({ action, actualite, mode }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} style={{ maxWidth: 920 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label" htmlFor="titre">Titre *</label>
          <input
            id="titre"
            name="titre"
            type="text"
            className="form-input"
            defaultValue={actualite?.titre ?? ""}
            required
            placeholder="Stage de printemps — compte-rendu"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="kanji">Kanji (1 caractère)</label>
          <input
            id="kanji"
            name="kanji"
            type="text"
            className="form-input"
            defaultValue={actualite?.kanji ?? "報"}
            maxLength={2}
            style={{ fontFamily: "var(--serif-jp)", fontSize: 22, textAlign: "center" }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {KANJI_SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s.k}
                onClick={(e) => {
                  const input = (e.currentTarget.closest("form") as HTMLFormElement).elements.namedItem("kanji") as HTMLInputElement;
                  if (input) input.value = s.k;
                }}
                title={s.label}
                style={{
                  fontFamily: "var(--serif-jp)", fontSize: 18,
                  padding: "4px 10px",
                  background: "var(--paper)",
                  border: "1px solid var(--hair-color)",
                  cursor: "pointer",
                }}
                aria-label={`Insérer ${s.k} (${s.label})`}
              >
                {s.k}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="categorie">Catégorie</label>
          <select id="categorie" name="categorie" className="form-select" defaultValue={actualite?.categorie ?? "Actualité"}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="date_publication">Date de publication</label>
          <input
            id="date_publication"
            name="date_publication"
            type="date"
            className="form-input"
            defaultValue={(actualite?.date_publication ?? today).slice(0, 10)}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="slug">
            Adresse web <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--stone)" }}>(laissez vide, c&apos;est rempli automatiquement)</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            className="form-input"
            defaultValue={actualite?.slug ?? ""}
            placeholder="se-remplit-tout-seul"
            style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}
          />
          <span style={{ fontSize: 11, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 4 }}>
            Apparaît à la fin du lien de l&apos;article (ex. <code>/actualites/stage-printemps-2026</code>). Sans intervention, généré depuis le titre.
          </span>
        </div>

        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label" htmlFor="extrait">
            Extrait <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--stone)" }}>(1-2 phrases, visible sur la liste)</span>
          </label>
          <textarea
            id="extrait"
            name="extrait"
            className="form-input"
            defaultValue={actualite?.extrait ?? ""}
            rows={3}
            required
            style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, resize: "vertical" }}
          />
        </div>

        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">
            Contenu de l&apos;article <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--stone)" }}>(utilisez la barre d&apos;outils pour mettre en forme)</span>
          </label>
          <MarkdownEditor
            name="body"
            defaultValue={actualite?.body ?? ""}
            rows={18}
            required
          />
        </div>

        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">
            Photo de couverture <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--stone)" }}>(affichée en haut de l&apos;article, optionnel)</span>
          </label>
          <ImageUpload name="photo_url" defaultValue={actualite?.photo_url ?? ""} />
        </div>

        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Statut</label>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input
                type="radio"
                name="statut"
                value="draft"
                defaultChecked={actualite?.statut !== "published"}
              />
              <span>Brouillon <span style={{ color: "var(--stone)", fontStyle: "italic" }}>— non visible sur le site</span></span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input
                type="radio"
                name="statut"
                value="published"
                defaultChecked={actualite?.statut === "published"}
              />
              <span>Publié <span style={{ color: "var(--stone)", fontStyle: "italic" }}>— visible publiquement</span></span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 24, borderTop: "1px solid var(--hair-color)" }}>
        <button type="submit" className="btn btn-primary">
          {mode === "create" ? "Créer l'actualité" : "Enregistrer les modifications"}
          <span className="btn-dot" aria-hidden />
        </button>
        <Link href="/admin/actualites" className="btn btn-secondary">Annuler</Link>
      </div>
    </form>
  );
}
