"use client";

import Link from "next/link";
import type { Maitre } from "@/types";
import ImageUpload from "./ImageUpload";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  maitre?: Maitre | null;
  mode: "create" | "edit";
}

export default function MaitreForm({ action, maitre, mode }: Props) {
  return (
    <form action={action} style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="nom">Nom complet</label>
          <input id="nom" name="nom" type="text" defaultValue={maitre?.nom ?? ""} className="form-input" required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="ordre">Ordre</label>
          <input id="ordre" name="ordre" type="number" min={1} defaultValue={maitre?.ordre ?? 1} className="form-input" />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="role">Rôle</label>
        <input
          id="role" name="role" type="text"
          placeholder="Professeur principal, Professeur Judo & Ju-jitsu…"
          defaultValue={maitre?.role ?? ""}
          className="form-input"
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="grade">Grade</label>
          <input
            id="grade" name="grade" type="text"
            placeholder="5ᵉ Dan · Judo"
            defaultValue={maitre?.grade ?? ""}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="annees">Années de pratique</label>
          <input
            id="annees" name="annees" type="number" min={0}
            defaultValue={maitre?.annees ?? 0}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="citation">Citation</label>
        <textarea
          id="citation" name="citation"
          className="form-input"
          defaultValue={maitre?.citation ?? ""}
          rows={3}
          style={{ fontFamily: "var(--serif)", fontStyle: "italic", resize: "vertical" }}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label">Portrait</label>
        <ImageUpload name="photo_url" defaultValue={maitre?.photo_url ?? ""} />
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
        <button type="submit" className="btn btn-primary">
          {mode === "create" ? "Créer le maître" : "Enregistrer"}
          <span className="btn-dot" aria-hidden />
        </button>
        <Link href="/admin/maitres" className="btn btn-secondary">Annuler</Link>
      </div>
    </form>
  );
}
