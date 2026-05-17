"use client";

import { useRef, useState } from "react";

interface Props {
  name: string;
  defaultValue?: string | null;
  label?: string;
}

export default function ImageUpload({ name, defaultValue = "" }: Props) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setError(data.message ?? "Erreur d'upload.");
      else setUrl(data.url);
    } catch {
      setError("Impossible d'envoyer l'image.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Aperçu"
            style={{
              width: 160,
              height: 120,
              objectFit: "cover",
              border: "1px solid var(--hair-color)",
              background: "var(--paper)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--stone)", fontFamily: "ui-monospace, monospace" }}>{url}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: "8px 14px",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  border: "1px solid var(--hair-strong)",
                  background: "var(--paper)",
                  color: "var(--sumi)",
                  cursor: "pointer",
                }}
              >
                {uploading ? "Envoi…" : "Remplacer"}
              </button>
              <button
                type="button"
                onClick={() => setUrl("")}
                style={{
                  padding: "8px 14px",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  border: "1px solid var(--red)",
                  background: "transparent",
                  color: "var(--red)",
                  cursor: "pointer",
                }}
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              padding: "20px 28px",
              fontSize: 13,
              border: "2px dashed var(--hair-strong)",
              background: "var(--paper)",
              color: "var(--sumi)",
              cursor: "pointer",
              width: "100%",
              fontFamily: "var(--sans)",
            }}
          >
            {uploading ? "Envoi en cours…" : "📷  Choisir une image"}
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      {error && (
        <p style={{ color: "var(--red)", fontSize: 12, margin: 0 }} role="alert">{error}</p>
      )}

      <p style={{ fontSize: 11, color: "var(--stone)", margin: 0 }}>
        JPG, PNG, WEBP ou GIF · 5 Mo max
      </p>
    </div>
  );
}
