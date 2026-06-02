import Link from "next/link";
import type { ScheduleSlot, Discipline } from "@/types";

interface Props {
  action: (formData: FormData) => void | Promise<void>;
  slot?: ScheduleSlot | null;
  disciplines: Discipline[];
  mode: "create" | "edit";
}

export default function SlotForm({ action, slot, disciplines, mode }: Props) {
  return (
    <form action={action} style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="jour">Jour</label>
          <select id="jour" name="jour" className="form-select" defaultValue={slot?.jour ?? "lundi"} required>
            <option value="lundi">Lundi</option>
            <option value="mercredi">Mercredi</option>
            <option value="jeudi">Jeudi</option>
            <option value="samedi">Samedi</option>
            <option value="dimanche">Dimanche</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="ordre">Ordre d&apos;affichage</label>
          <input
            id="ordre" name="ordre" type="number" min={0}
            defaultValue={slot?.ordre ?? 1}
            className="form-input"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="heure_debut">Heure de début</label>
          <input
            id="heure_debut" name="heure_debut" type="text"
            placeholder="19:00"
            defaultValue={slot?.heure_debut ?? ""}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="heure_fin">Heure de fin</label>
          <input
            id="heure_fin" name="heure_fin" type="text"
            placeholder="20:30"
            defaultValue={slot?.heure_fin ?? ""}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="discipline_id">Discipline associée</label>
        <select id="discipline_id" name="discipline_id" className="form-select" defaultValue={slot?.discipline_id ?? ""}>
          <option value="">— Aucune —</option>
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>{d.nom}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="discipline">Nom affiché (discipline)</label>
        <input
          id="discipline" name="discipline" type="text"
          placeholder="Judo"
          defaultValue={(slot as ScheduleSlot & { discipline?: string })?.discipline ?? ""}
          className="form-input"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="niveau">Niveau / public</label>
        <input
          id="niveau" name="niveau" type="text"
          placeholder="8/11 ans, Adultes +14 ans, Tous niveaux…"
          defaultValue={slot?.niveau ?? ""}
          className="form-input"
          required
        />
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--hair-color)" }}>
        <button type="submit" className="btn btn-primary">
          {mode === "create" ? "Créer le créneau" : "Enregistrer"}
          <span className="btn-dot" aria-hidden />
        </button>
        <Link href="/admin/horaires" className="btn btn-secondary">Annuler</Link>
      </div>
    </form>
  );
}
