import type { Metadata } from "next";
import { query } from "@/lib/db";
import type { Preregistration } from "@/types";
import PreregistrationRow from "@/components/PreregistrationRow";
import { getFormulesAdmin } from "@/lib/actions/cms";

export const metadata: Metadata = {
  title: "Pré-inscriptions — Admin",
  robots: { index: false },
};

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

const STATUS_FILTERS = [
  { value: "", label: "Tous" },
  { value: "pending", label: "Nouveaux" },
  { value: "contacted", label: "Contactés" },
  { value: "accepted", label: "Acceptés" },
  { value: "rejected", label: "Refusés" },
];

async function fetchRows(): Promise<Preregistration[]> {
  if (!DB_READY) return [];
  try {
    return await query<Preregistration>(
      "SELECT * FROM preregistrations ORDER BY submitted_at DESC LIMIT 500"
    );
  } catch { return []; }
}

export default async function PreregistrationsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; status?: string; plan?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").toLowerCase().trim();
  const statusFilter = params.status ?? "";
  const planFilter = params.plan ?? "";

  const [allRows, formules] = await Promise.all([fetchRows(), getFormulesAdmin()]);
  const planLabels: Record<string, string> = {};
  for (const f of formules) planLabels[f.plan_key] = f.nom;
  const PLAN_FILTERS = [{ value: "", label: "Toutes" }, ...formules.map((f) => ({ value: f.plan_key, label: f.nom }))];

  const rows = allRows.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (planFilter && r.plan !== planFilter) return false;
    if (q && !r.full_name.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) return false;
    return true;
  });

  const stats = {
    total: allRows.length,
    pending: allRows.filter((r) => r.status === "pending").length,
    contacted: allRows.filter((r) => r.status === "contacted").length,
    accepted: allRows.filter((r) => r.status === "accepted").length,
    rejected: allRows.filter((r) => r.status === "rejected").length,
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <h1 className="admin-h1" style={{ margin: 0 }}>Pré-inscriptions</h1>
        {DB_READY && allRows.length > 0 && (
          <a href="/api/admin/preregistrations/export" className="btn btn-primary" download>
            Exporter vers Excel
            <span className="btn-dot" aria-hidden />
          </a>
        )}
      </div>

      {!DB_READY && (
        <div style={{ background: "rgba(200,51,42,0.06)", borderLeft: "3px solid var(--red)", padding: "16px 20px", marginBottom: 32, fontFamily: "var(--serif)", fontSize: 14 }}>
          <strong>Base MySQL non configurée.</strong> Les pré-inscriptions ne sont pas stockées tant que la base n&apos;est pas connectée.
        </div>
      )}

      {DB_READY && (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Nouveaux" value={stats.pending} color="var(--red)" />
            <StatCard label="Contactés" value={stats.contacted} color="#A88A2C" />
            <StatCard label="Acceptés" value={stats.accepted} color="#2D7D46" />
            <StatCard label="Refusés" value={stats.rejected} color="var(--stone)" />
          </div>

          {/* Filters */}
          <form method="GET" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-field" style={{ flex: "1 1 240px", minWidth: 200 }}>
              <label className="form-label" htmlFor="q">Recherche (nom ou email)</label>
              <input
                id="q"
                name="q"
                type="text"
                defaultValue={q}
                placeholder="Ex. Dupont, dupont@gmail.com"
                className="form-input"
              />
            </div>
            <div className="form-field" style={{ flex: "0 1 180px" }}>
              <label className="form-label" htmlFor="status">Statut</label>
              <select id="status" name="status" defaultValue={statusFilter} className="form-select">
                {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-field" style={{ flex: "0 1 180px" }}>
              <label className="form-label" htmlFor="plan">Formule</label>
              <select id="plan" name="plan" defaultValue={planFilter} className="form-select">
                {PLAN_FILTERS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-secondary">Filtrer</button>
            {(q || statusFilter || planFilter) && (
              <a href="/admin/preregistrations" className="btn btn-ghost">Réinitialiser</a>
            )}
          </form>

          <p style={{ fontSize: 12, color: "var(--stone)", marginBottom: 16 }}>
            {rows.length} résultat{rows.length > 1 ? "s" : ""}
            {rows.length !== allRows.length && ` sur ${allRows.length}`}
          </p>
        </>
      )}

      {rows.length === 0 ? (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
          {allRows.length === 0
            ? "Aucune pré-inscription enregistrée pour le moment."
            : "Aucun résultat pour ces filtres."}
        </p>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid var(--hair-color)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 880 }}>
            <thead style={{ background: "var(--paper)" }}>
              <tr style={{ borderBottom: "1px solid var(--hair-strong)" }}>
                {["Reçue le", "Nom", "Email", "Naissance", "Formule", "Statut", ""].map((h) => (
                  <th key={h} style={{ textAlign: h === "" ? "right" : "left", padding: "12px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => <PreregistrationRow key={r.id} row={r} planLabel={planLabels[r.plan] ?? r.plan} />)}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ padding: "16px 18px", background: "var(--paper)", border: "1px solid var(--hair-color)" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--serif)", fontWeight: 300, fontSize: 32, lineHeight: 1, color: color ?? "var(--sumi)", fontFeatureSettings: "'tnum'" }}>
        {value}
      </div>
    </div>
  );
}
