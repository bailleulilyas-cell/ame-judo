"use client";

import { useState } from "react";
import type { AdhesionDocument } from "@/types";

interface Props {
  document?: AdhesionDocument | null;
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
}

export default function DocumentForm({ document, action, error }: Props) {
  const [url, setUrl] = useState(document?.url && document.url !== "#" ? document.url : "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (file: File) => {
    setUploadError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setUrl(data.url);
      } else {
        setUploadError(data.message ?? "Erreur d'upload.");
      }
    } catch {
      setUploadError("Erreur réseau pendant l'upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={action} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 24 }}>
      {error && (
        <div className="form-error" role="alert" style={{ padding: "12px 16px", background: "rgba(200,51,42,0.08)", borderLeft: "3px solid var(--red)" }}>
          {error}
        </div>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="nom">Nom du document <span style={{ color: "var(--red)" }}>*</span></label>
        <input
          id="nom" name="nom" type="text"
          defaultValue={document?.nom ?? ""}
          className="form-input"
          maxLength={120}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description" name="description"
          defaultValue={document?.description ?? ""}
          className="form-input"
          rows={3}
          placeholder="Une courte phrase qui décrit le document (ex: « Modèle à faire compléter par votre médecin. »)"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="kanji">Kanji</label>
          <input
            id="kanji" name="kanji" type="text"
            defaultValue={document?.kanji ?? ""}
            className="form-input"
            maxLength={8}
            placeholder="証"
            style={{ fontFamily: "var(--serif-jp)", fontSize: 22, textAlign: "center" }}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="ordre">Ordre d&apos;affichage</label>
          <input
            id="ordre" name="ordre" type="number"
            defaultValue={document?.ordre ?? 0}
            className="form-input"
            min={0}
            step={1}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="url">
          Lien du document <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <p style={{ fontSize: 12, color: "var(--stone)", margin: "0 0 10px", fontFamily: "var(--serif)", fontStyle: "italic" }}>
          Vous pouvez soit téléverser un fichier PDF, soit coller un lien externe.
        </p>
        <input
          id="url" name="url" type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
          maxLength={500}
          placeholder="https://… ou /uploads/2026/05/document.pdf"
          required
        />

        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <label
            className="btn btn-secondary"
            style={{ cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}
          >
            {uploading ? (
              <><span className="spinner" aria-hidden style={{ marginRight: 8 }} />Téléversement…</>
            ) : (
              "📎  Téléverser un PDF"
            )}
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              hidden
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
          </label>
          {url && url !== "#" && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sumi)", borderBottom: "1px solid var(--hair-strong)" }}
            >
              Aperçu →
            </a>
          )}
        </div>
        {uploadError && (
          <p className="form-error" role="alert" style={{ marginTop: 8 }}>{uploadError}</p>
        )}
      </div>

      <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          id="active" name="active" type="checkbox"
          defaultChecked={document?.active ?? true}
          style={{ width: 18, height: 18, cursor: "pointer" }}
        />
        <label htmlFor="active" style={{ fontFamily: "var(--sans)", fontSize: 14, cursor: "pointer" }}>
          Document visible publiquement sur la page Adhésion
        </label>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
        <button type="submit" className="btn btn-primary">
          {document ? "Enregistrer" : "Créer le document"}
          <span className="btn-dot" aria-hidden />
        </button>
        <a href="/admin/documents" style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)" }}>
          Annuler
        </a>
      </div>
    </form>
  );
}
