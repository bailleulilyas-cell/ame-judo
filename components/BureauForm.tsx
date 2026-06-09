"use client";

import Link from "next/link";
import type { BureauMembre } from "@/types";
import ImageUpload from "./ImageUpload";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  membre?: BureauMembre | null;
  mode: "create" | "edit";
}

export default function BureauForm({ action, membre, mode }: Props) {
  return (
    <form action={action} style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" type="text" defaultValue={membre?.prenom ?? ""} className="form-input" required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="nom">Nom</label>
          <input id="nom" name="nom" type="text" defaultValue={membre?.nom ?? ""} className="form-input" required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="ordre">Ordre</label>
          <input id="ordre" name="ordre" type="number" min={0} defaultValue={membre?.ordre ?? 0} className="form-input" />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="poste">Poste</label>
        <input
          id="poste" name="poste" type="text"
          placeholder="Président, Trésorier, Secrétaire…"
          defaultValue={membre?.poste ?? ""}
          className="form-input"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description" name="description"
          className="form-input"
          defaultValue={membre?.description ?? ""}
          rows={3}
          placeholder="Quelques mots sur son rôle, son parcours…"
          style={{ fontFamily: "var(--serif)", resize: "vertical" }}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Photo</label>
        <ImageUpload name="photo_url" defaultValue={membre?.photo_url ?? ""} />
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
        <button type="submit" className="btn btn-primary">
          {mode === "create" ? "Créer le membre" : "Enregistrer"}
          <span className="btn-dot" aria-hidden />
        </button>
        <Link href="/admin/bureau" className="btn btn-secondary">Annuler</Link>
      </div>
    </form>
  );
}
