"use client";
import { useState } from "react";

export default function PasswordField({ disabled }: { disabled?: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-field" style={{ marginBottom: 20 }}>
      <label className="form-label" htmlFor="password">Mot de passe</label>
      <div style={{ position: "relative" }}>
        <input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          className="form-input"
          required
          autoFocus
          autoComplete="current-password"
          disabled={disabled}
          style={{ paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            padding: 4,
            color: "var(--stone)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
