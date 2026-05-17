import type { Metadata } from "next";
import Link from "next/link";
import { getActualites } from "@/lib/data";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Tableau de bord",
  robots: { index: false },
};

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

async function countPending(): Promise<number> {
  if (!DB_READY) return 0;
  try {
    const rows = await query<{ n: number }>(
      "SELECT COUNT(*) AS n FROM preregistrations WHERE status = 'pending'"
    );
    return Number(rows[0]?.n ?? 0);
  } catch {
    return 0;
  }
}

export default async function AdminHome() {
  const [actus, pending] = await Promise.all([getActualites(50), countPending()]);
  const published = actus.filter((a) => a.statut === "published").length;
  const drafts = actus.length - published;

  return (
    <>
      <h1 className="admin-h1">Tableau de bord</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, marginBottom: 48 }}>
        <Stat kanji="入" label="Nouvelles pré-inscriptions" value={pending} href="/admin/preregistrations" />
        <Stat kanji="報" label="Actualités publiées" value={published} href="/admin/actualites" />
        <Stat kanji="✎" label="Brouillons" value={drafts} href="/admin/actualites" />
      </div>

      <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22, margin: "0 0 20px" }}>
        Que voulez-vous faire ?
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        <Action href="/admin/actualites/new" kanji="新" title="Publier une actualité" desc="Stage, compétition, info pratique…" />
        <Action href="/admin/actualites" kanji="報" title="Gérer les actualités" desc="Modifier, dépublier, supprimer" />
        <Action href="/admin/preregistrations" kanji="入" title="Voir les pré-inscriptions" desc="Suivre les demandes" />
      </div>
    </>
  );
}

function Stat({ kanji, label, value, href }: { kanji: string; label: string; value: number; href: string }) {
  return (
    <Link href={href} style={{ display: "block", padding: "24px 28px", background: "var(--paper)", border: "1px solid var(--hair-color)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 24 }}>{kanji}</span>
        <span style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, lineHeight: 1, fontFeatureSettings: "'tnum'" }}>{value}</span>
      </div>
      <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)", margin: 0 }}>{label}</p>
    </Link>
  );
}

function Action({ href, kanji, title, desc }: { href: string; kanji: string; title: string; desc: string }) {
  return (
    <Link href={href} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "24px 28px", background: "var(--paper)", border: "1px solid var(--hair-color)" }}>
      <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 24, lineHeight: 1 }}>{kanji}</span>
      <strong style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400 }}>{title}</strong>
      <span style={{ fontSize: 13, color: "var(--stone)" }}>{desc}</span>
      <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--sumi)", marginTop: 6 }}>Ouvrir →</span>
    </Link>
  );
}
