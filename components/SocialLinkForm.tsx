"use client";

import { useState } from "react";
import SocialIcon from "./SocialIcon";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/socials";
import type { SocialLink } from "@/types";

interface Props {
  link?: SocialLink | null;
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
}

const PLATFORM_KEYS = Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[];

export default function SocialLinkForm({ link, action, error }: Props) {
  const [platform, setPlatform] = useState<SocialPlatform>(link?.plateforme ?? "facebook");
  const [url, setUrl] = useState(link?.url ?? "");

  return (
    <form action={action} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 24 }}>
      {error && (
        <div className="form-error" role="alert" style={{ padding: "12px 16px", background: "rgba(200,51,42,0.08)", borderLeft: "3px solid var(--red)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--sumi)", color: "var(--bg)", flexShrink: 0,
          }}
          aria-hidden
        >
          <SocialIcon platform={platform} size={28} />
        </span>
        <div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 18, margin: 0 }}>{SOCIAL_PLATFORMS[platform].label}</p>
          <p style={{ fontSize: 12, color: "var(--stone)", margin: "2px 0 0", fontStyle: "italic", fontFamily: "var(--serif)" }}>
            Aperçu du logo affiché sur le site.
          </p>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="plateforme">Plateforme <span style={{ color: "var(--red)" }}>*</span></label>
        <select
          id="plateforme" name="plateforme"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
          className="form-select"
          required
        >
          {PLATFORM_KEYS.map((k) => (
            <option key={k} value={k}>{SOCIAL_PLATFORMS[k].label}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="url">Lien (URL) <span style={{ color: "var(--red)" }}>*</span></label>
        <input
          id="url" name="url" type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
          maxLength={500}
          placeholder={SOCIAL_PLATFORMS[platform].placeholder}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="ordre">Ordre d&apos;affichage</label>
        <input
          id="ordre" name="ordre" type="number"
          defaultValue={link?.ordre ?? 0}
          className="form-input"
          min={0}
          step={1}
          style={{ maxWidth: 140 }}
        />
      </div>

      <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          id="active" name="active" type="checkbox"
          defaultChecked={link?.active ?? true}
          style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--red)" }}
        />
        <label htmlFor="active" style={{ fontFamily: "var(--sans)", fontSize: 14, cursor: "pointer" }}>
          Visible sur le site (pied de page)
        </label>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
        <button type="submit" className="btn btn-primary">
          {link ? "Enregistrer" : "Ajouter le réseau"}
          <span className="btn-dot" aria-hidden />
        </button>
        <a href="/admin/reseaux" style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)" }}>
          Annuler
        </a>
      </div>
    </form>
  );
}
