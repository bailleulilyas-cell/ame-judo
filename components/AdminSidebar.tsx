"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { title: "Contenu",      items: [
    { href: "/admin",                  kanji: "公", label: "Dashboard" },
    { href: "/admin/actualites",       kanji: "報", label: "Actualités" },
    { href: "/admin/galerie",          kanji: "写", label: "Galerie" },
  ]},
  { title: "Pages",        items: [
    { href: "/admin/horaires",         kanji: "時", label: "Horaires" },
    { href: "/admin/maitres",          kanji: "師", label: "Enseignants" },
    { href: "/admin/bureau",           kanji: "会", label: "Bureau" },
    { href: "/admin/formules",         kanji: "入", label: "Formules" },
    { href: "/admin/documents",        kanji: "書", label: "Documents" },
  ]},
  { title: "Configuration", items: [
    { href: "/admin/parametres",       kanji: "便", label: "Contact / Pied de page" },
    { href: "/admin/reseaux",          kanji: "絆", label: "Réseaux sociaux" },
    { href: "/admin/password",         kanji: "鍵", label: "Mot de passe" },
  ]},
];

async function logout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Barre mobile (cachée sur desktop) */}
      <div className="admin-topbar">
        <span className="admin-topbar-brand">AME-JUDO · Admin</span>
        <button
          type="button"
          className="admin-burger"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      <aside className={`admin-side${open ? " open" : ""}`} aria-label="Navigation admin">
        <div className="admin-side-brand">
          <span style={{ fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "0.12em" }}>AME-JUDO · Admin</span>
          <p style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginTop: 4 }}>
            Bureau du club
          </p>
        </div>

        <nav className="admin-nav">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <div style={{ padding: "12px 24px 6px", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--stone-soft)" }}>
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const active = pathname === item.href ||
                  (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={close} className={`admin-nav-link${active ? " active" : ""}`}>
                    <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 16 }} aria-hidden>{item.kanji}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--hair-color)", display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/" className="admin-nav-link" style={{ padding: 0 }} onClick={close}>↗ Voir le site</Link>
          <button
            type="button"
            onClick={logout}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--stone)", padding: 0, textAlign: "left",
            }}
          >
            Se déconnecter →
          </button>
        </div>
      </aside>

      {/* Overlay (mobile, quand le tiroir est ouvert) */}
      <div className={`admin-overlay${open ? " open" : ""}`} onClick={close} aria-hidden />
    </>
  );
}
