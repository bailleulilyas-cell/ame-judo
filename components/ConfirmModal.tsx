"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  itemName?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  itemName,
  description = "Cette action est définitive. La donnée ne pourra pas être restaurée.",
  confirmLabel = "Oui, supprimer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(20, 16, 12, 0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg)",
          borderTop: "3px solid var(--red)",
          maxWidth: 460,
          width: "100%",
          padding: "28px 32px 24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          fontFamily: "var(--sans)",
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>
          Confirmation requise
        </div>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, lineHeight: 1.25, margin: "0 0 12px", color: "var(--sumi)" }}>
          {title}
        </h2>

        {itemName && (
          <p style={{ fontSize: 14, margin: "0 0 14px", color: "var(--sumi)" }}>
            <span style={{ color: "var(--stone)" }}>Élément concerné : </span>
            <strong style={{ fontFamily: "var(--serif)", fontWeight: 500 }}>{itemName}</strong>
          </p>
        )}

        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", margin: "0 0 24px", lineHeight: 1.55 }}>
          {description}
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            style={{
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "10px 18px",
              background: "transparent",
              border: "1px solid var(--hair-strong)",
              color: "var(--sumi)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "10px 18px",
              background: "var(--red)",
              border: "1px solid var(--red)",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
