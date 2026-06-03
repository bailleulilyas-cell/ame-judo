"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { title: "Contenu",      items: [
    { href: "/admin",                  kanji: "公", label: "Dashboard" },
    { href: "/admin/actualites",       kanji: "報", label: "Actualités" },
  ]},
  { title: "Pages",        items: [
    { href: "/admin/hero",             kanji: "頭", label: "Accueil (Hero)" },
    { href: "/admin/about",            kanji: "魂", label: "L'âme du club" },
    { href: "/admin/disciplines",      kanji: "柔", label: "Le judo" },
    { href: "/admin/horaires",         kanji: "時", label: "Horaires" },
    { href: "/admin/maitres",          kanji: "師", label: "Maîtres" },
    { href: "/admin/formules",         kanji: "入", label: "Formules" },
    { href: "/admin/documents",        kanji: "書", label: "Documents" },
  ]},
  { title: "Demandes",     items: [
    { href: "/admin/preregistrations", kanji: "願", label: "Pré-inscriptions" },
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
  return (
    <aside className="admin-side" aria-label="Navigation admin">
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
                <Link key={item.href} href={item.href} className={`admin-nav-link${active ? " active" : ""}`}>
                  <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 16 }} aria-hidden>{item.kanji}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--hair-color)", display: "flex", flexDirection: "column", gap: 12 }}>
        <Link href="/" className="admin-nav-link" style={{ padding: 0 }}>↗ Voir le site</Link>
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
  );
}
