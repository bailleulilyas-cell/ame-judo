import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getPreregistrationById, updatePreregistration } from "@/lib/actions/preregistrations";

export const metadata: Metadata = { title: "Modifier une pré-inscription", robots: { index: false } };

const STATUS_OPTIONS = [
  { value: "pending", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "accepted", label: "Accepté" },
  { value: "rejected", label: "Refusé" },
];

const PLAN_OPTIONS = [
  { value: "baby", label: "Baby Judo (4-5 ans)" },
  { value: "benjamin", label: "Benjamin (6-13 ans)" },
  { value: "senior", label: "Senior (14 ans et +)" },
];

export default async function PreregistrationEdit({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getPreregistrationById(id);
  if (!row) notFound();

  const update = updatePreregistration.bind(null, id);
  const submittedAt = new Date(row.submitted_at);
  const birth = new Date(row.birth_date);
  const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 86400000));
  const isMinor = age < 18;

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${row.full_name}</em>`}
        backHref="/admin/preregistrations"
        backLabel="Toutes les pré-inscriptions"
      />

      <div style={{ background: "var(--paper)", border: "1px solid var(--hair-color)", padding: "16px 20px", marginBottom: 24, fontSize: 13, color: "var(--stone)" }}>
        Reçue le <strong style={{ color: "var(--sumi)" }}>{submittedAt.toLocaleString("fr-FR")}</strong>
        {" · "}Âge actuel : <strong style={{ color: "var(--sumi)" }}>{age} ans</strong>
      </div>

      <form action={update} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="full_name">Nom complet</label>
          <input id="full_name" name="full_name" type="text" defaultValue={row.full_name} className="form-input" required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={row.email} className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="phone">Téléphone</label>
            <input id="phone" name="phone" type="tel" defaultValue={row.phone ?? ""} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="birth_date">Date de naissance</label>
            <input id="birth_date" name="birth_date" type="date" defaultValue={row.birth_date.slice(0, 10)} className="form-input" required />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-field">
            <label className="form-label" htmlFor="plan">Formule</label>
            <select id="plan" name="plan" defaultValue={row.plan} className="form-select" required>
              {PLAN_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="status">Statut</label>
            <select id="status" name="status" defaultValue={row.status} className="form-select" required>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {(isMinor || row.parent_name) && (
          <>
            <div style={{ borderTop: "1px solid var(--hair-color)", paddingTop: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
                Responsable légal {!isMinor && <span style={{ fontWeight: 400 }}>(inscrit·e majeur·e — champs conservés à titre indicatif)</span>}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-field">
                <label className="form-label" htmlFor="parent_name">Nom du responsable</label>
                <input id="parent_name" name="parent_name" type="text" defaultValue={row.parent_name ?? ""} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="parent_relation">Lien de parenté</label>
                <select id="parent_relation" name="parent_relation" defaultValue={row.parent_relation ?? ""} className="form-select">
                  <option value="">—</option>
                  <option value="mere">Mère</option>
                  <option value="pere">Père</option>
                  <option value="tuteur">Tuteur / tutrice légal·e</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="form-field">
          <label className="form-label" htmlFor="notes">Notes internes (bureau uniquement)</label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={row.notes ?? ""}
            rows={5}
            className="form-input"
            placeholder="Ex. appelé le 12/05, intéressé par les cours du samedi…"
            style={{ resize: "vertical", fontFamily: "var(--sans)" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
          <button type="submit" className="btn btn-primary">
            Enregistrer
            <span className="btn-dot" aria-hidden />
          </button>
        </div>
      </form>
    </>
  );
}
