"use client";

import Link from "next/link";
import type { GaleriePhoto } from "@/types";
import ImageUpload from "./ImageUpload";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  photo?: GaleriePhoto | null;
  mode: "create" | "edit";
  error?: string;
}

export default function GalerieForm({ action, photo, mode, error }: Props) {
  return (
    <form action={action} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
      {error && (
        <div className="form-error" role="alert" style={{ padding: "12px 16px", background: "rgba(200,51,42,0.08)", borderLeft: "3px solid var(--red)" }}>
          {error}
        </div>
      )}

      <div className="form-field">
        <label className="form-label">Photo</label>
        <ImageUpload name="url" defaultValue={photo?.url ?? ""} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="legende">Légende <span style={{ color: "var(--stone)", fontWeight: 400 }}>(facultative)</span></label>
          <input id="legende" name="legende" type="text" maxLength={200} defaultValue={photo?.legende ?? ""} className="form-input" placeholder="Ex. Stage de fin d'année" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="ordre">Ordre <span style={{ color: "var(--stone)", fontWeight: 400 }}>(0 = à la fin)</span></label>
          <input id="ordre" name="ordre" type="number" min={0} defaultValue={photo?.ordre ?? 0} className="form-input" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
        <button type="submit" className="btn btn-primary">
          {mode === "create" ? "Ajouter la photo" : "Enregistrer"}
          <span className="btn-dot" aria-hidden />
        </button>
        <Link href="/admin/galerie" className="btn btn-secondary">Annuler</Link>
      </div>
    </form>
  );
}
