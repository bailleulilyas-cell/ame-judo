"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Formule } from "@/types";

type FormState = "idle" | "loading" | "success" | "error";

function computeAge(day: number, month: number, year: number): number | null {
  if (!day || !month || !year) return null;
  const birth = new Date(year, month - 1, day);
  if (isNaN(birth.getTime()) || birth > new Date()) return null;
  let age = new Date().getFullYear() - year;
  const m = new Date().getMonth() - (month - 1);
  if (m < 0 || (m === 0 && new Date().getDate() < day)) age--;
  return age;
}

function isValidDate(day: number, month: number, year: number): boolean {
  if (!day || !month || !year) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  if (month < 1 || month > 12) return false;
  const lastDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDay) return false;
  const birth = new Date(year, month - 1, day);
  return birth <= new Date();
}

function formuleMatchesAge(f: Formule, age: number): boolean {
  if (f.age_min !== null && age < f.age_min) return false;
  if (f.age_max !== null && age > f.age_max) return false;
  return true;
}

function toBirthDateString(day: number, month: number, year: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AdhesionForm({ formules }: { formules: Formule[] }) {
  const [selected, setSelected] = useState<string>("");
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dd, setDd] = useState<string>("");
  const [mm, setMm] = useState<string>("");
  const [yyyy, setYyyy] = useState<string>("");
  const successRef = useRef<HTMLDivElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);

  const day = Number(dd) || 0;
  const month = Number(mm) || 0;
  const year = Number(yyyy) || 0;
  const age = computeAge(day, month, year);
  const dateComplete = dd.length > 0 && mm.length > 0 && yyyy.length === 4;
  const dateValid = isValidDate(day, month, year);
  const minor = age !== null && age < 18;

  const eligibleFormules = useMemo(() => {
    if (age === null) return formules.map((f) => f.id);
    return formules.filter((f) => formuleMatchesAge(f, age)).map((f) => f.id);
  }, [age, formules]);

  // Auto-sélection de la formule quand l'âge est connu et qu'une seule correspond
  useEffect(() => {
    if (age === null) return;
    const matching = formules.filter((f) => formuleMatchesAge(f, age));
    if (matching.length === 1) {
      setSelected(matching[0].id);
    } else if (matching.length === 0) {
      setSelected("");
    } else if (!matching.some((f) => f.id === selected)) {
      setSelected(matching[0].id);
    }
  }, [age, formules, selected]);

  useEffect(() => {
    if (state === "success") {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  const selectedFormule = formules.find((f) => f.id === selected);

  const handleDdChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 2);
    setDd(digits);
    if (digits.length === 2) mmRef.current?.focus();
  };
  const handleMmChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 2);
    setMm(digits);
    if (digits.length === 2) yyyyRef.current?.focus();
  };
  const handleYyyyChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setYyyy(digits);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const errs: Record<string, string> = {};
    const fullName = (data.get("fullName") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const phone = (data.get("phone") as string)?.trim();
    const parentName = (data.get("parentName") as string)?.trim();

    if (!fullName) errs.fullName = "Nom requis";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email invalide";
    if (!phone) errs.phone = "Téléphone requis";
    if (!dateComplete) errs.birthDate = "Date de naissance requise";
    else if (!dateValid) errs.birthDate = "Date invalide";

    // L'âge n'est jamais bloquant : on demande juste de choisir une formule.
    // Si elle ne colle pas pile à l'âge, le bureau ajustera (note plus bas).
    if (!selectedFormule) {
      errs.formule = "Merci de choisir une formule (le bureau confirmera si besoin).";
    }

    if (minor && !parentName) errs.parentName = "Nom du responsable légal requis";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setState("loading");

    try {
      const res = await fetch("/api/preregistrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          birthDate: toBirthDateString(day, month, year),
          plan: selectedFormule!.plan_key,
          parentName: minor ? parentName : undefined,
          parentRelation: minor ? (data.get("parentRelation") as string) : undefined,
          souhait_competition: data.get("souhait_competition") === "1",
          _honeypot: data.get("_honeypot"),
        }),
      });

      if (res.ok) {
        setState("success");
        form.reset();
        setDd(""); setMm(""); setYyyy(""); setSelected("");
      } else if (res.status === 409) {
        const json = await res.json();
        setErrors({ submit: json.message });
        setState("idle");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <h2 className="title-md" style={{ marginBottom: 20 }}>Choisir une formule.</h2>
      {age !== null && (
        <p style={{ fontSize: 13, color: "var(--stone)", fontFamily: "var(--serif)", fontStyle: "italic", marginBottom: 16 }}>
          Âge détecté : <strong style={{ color: "var(--sumi)" }}>{age} ans</strong>
          {eligibleFormules.length > 0
            ? " — la formule conseillée a été sélectionnée automatiquement (vous pouvez la changer)."
            : " — choisissez la formule la plus proche, le bureau confirmera avec vous."}
        </p>
      )}
      <div className="formules-grid" role="radiogroup" aria-label="Formules d'adhésion">
        {formules.map((f) => {
          const isConseille = age !== null && formuleMatchesAge(f, age);
          const isSelected = selected === f.id;
          return (
            <button
              key={f.id}
              type="button"
              className="formule"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(f.id)}
              style={{ position: "relative" }}
            >
              {isConseille && (
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--red)", background: "rgba(200,51,42,0.08)", padding: "3px 8px", border: "1px solid rgba(200,51,42,0.25)" }}>
                  Conseillé
                </span>
              )}
              <div className="formule-check" aria-hidden>{isSelected ? "✓" : ""}</div>
              <div className="formule-head">
                <span className="formule-kanji" lang="ja" aria-hidden>{f.kanji}</span>
                <span className="formule-age">{f.tranche_age}</span>
              </div>
              <h3 className="formule-name">{f.nom}</h3>
              <div className="formule-price">
                {f.prix}<span className="formule-currency">€</span>
              </div>
              <p className="formule-italique">{f.italique}</p>
              <div className="formule-slots">{f.slots_texte}</div>
            </button>
          );
        })}
      </div>
      {errors.formule && <p className="form-error" role="alert" style={{ marginTop: 12 }}>{errors.formule}</p>}
      {!errors.formule && age !== null && selectedFormule && !formuleMatchesAge(selectedFormule, age) && (
        <p style={{ marginTop: 12, fontSize: 13, color: "var(--sumi-soft)", fontFamily: "var(--serif)", fontStyle: "italic", background: "rgba(200,51,42,0.05)", borderLeft: "3px solid var(--red)", padding: "10px 14px" }}>
          Cette formule ne correspond pas tout à fait à l&apos;âge indiqué ({age} ans) — aucun souci,
          vous pouvez l&apos;envoyer : le bureau ajustera la formule avec vous.
        </p>
      )}

      {state === "success" ? (
        <div className="form-success" role="status" ref={successRef}>
          <h3 className="form-success-title">Pré-inscription bien reçue.</h3>
          <p className="form-success-jp" lang="ja">受け付け済み — un membre du bureau vous contactera sous 48h.</p>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <h2 className="form-title">Vos coordonnées.</h2>

          <input
            type="text"
            name="_honeypot"
            className="honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="fullName">
                Nom complet <span style={{ color: "var(--stone)", fontWeight: 400 }}>(de l&apos;inscrit·e)</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-input"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                required
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">
                Date de naissance <span style={{ color: "var(--stone)", fontWeight: 400 }}>(de l&apos;inscrit·e)</span>
              </label>
              <div
                className={`date-trio${errors.birthDate ? " is-invalid" : ""}`}
                role="group"
                aria-label="Date de naissance"
              >
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="JJ"
                  value={dd}
                  onChange={(e) => handleDdChange(e.target.value)}
                  aria-label="Jour"
                  maxLength={2}
                />
                <span className="date-trio-sep" aria-hidden>/</span>
                <input
                  ref={mmRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="MM"
                  value={mm}
                  onChange={(e) => handleMmChange(e.target.value)}
                  aria-label="Mois"
                  maxLength={2}
                />
                <span className="date-trio-sep" aria-hidden>/</span>
                <input
                  ref={yyyyRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="AAAA"
                  value={yyyy}
                  onChange={(e) => handleYyyyChange(e.target.value)}
                  aria-label="Année"
                  maxLength={4}
                />
              </div>
              {errors.birthDate && <span className="form-error">{errors.birthDate}</span>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                autoComplete="email"
                aria-invalid={!!errors.email}
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="phone">
                {minor ? "Téléphone du responsable" : "Téléphone"}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-input"
                autoComplete="tel"
                placeholder="06 00 00 00 00"
                aria-invalid={!!errors.phone}
                required
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="plan-display">Formule retenue</label>
              <input
                id="plan-display"
                type="text"
                className="form-input"
                value={selectedFormule?.nom ?? "—"}
                readOnly
                aria-readonly
              />
            </div>
          </div>

          {minor && (
            <>
              <div style={{ borderTop: "1px solid var(--hair-color)", margin: "20px 0 16px", paddingTop: 20 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 4 }}>
                  Responsable légal
                </p>
                <p style={{ fontSize: 13, color: "var(--stone)", marginBottom: 16, fontFamily: "var(--serif)", fontStyle: "italic" }}>
                  L&apos;inscrit·e étant mineur·e ({age} ans), merci de renseigner le responsable légal.
                </p>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label" htmlFor="parentName">Nom du responsable légal</label>
                  <input
                    id="parentName"
                    name="parentName"
                    type="text"
                    className="form-input"
                    autoComplete="off"
                    aria-invalid={!!errors.parentName}
                    required
                  />
                  {errors.parentName && <span className="form-error">{errors.parentName}</span>}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="parentRelation">Lien de parenté</label>
                  <select id="parentRelation" name="parentRelation" className="form-select">
                    <option value="mere">Mère</option>
                    <option value="pere">Père</option>
                    <option value="tuteur">Tuteur / tutrice légal·e</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, margin: "8px 0 4px" }}>
            <input
              id="souhait_competition"
              type="checkbox"
              name="souhait_competition"
              value="1"
              style={{ marginTop: 3, flexShrink: 0, accentColor: "var(--red)", width: 16, height: 16, cursor: "pointer" }}
            />
            <label htmlFor="souhait_competition" style={{ fontSize: 14, lineHeight: 1.5, cursor: "pointer" }}>
              Je souhaite participer à des <strong>compétitions</strong>.
            </label>
          </div>

          <p className="form-note">
            Deux séances d&apos;essai gratuites — aucun paiement requis à ce stade. En soumettant, vous
            acceptez notre <a href="/rgpd" style={{ borderBottom: "1px solid currentColor" }}>politique de confidentialité</a>.
          </p>

          {errors.submit && <p className="form-error" role="alert" style={{ marginBottom: 16 }}>{errors.submit}</p>}
          {state === "error" && <p className="form-error" role="alert" style={{ marginBottom: 16 }}>Une erreur est survenue. Réessayez ou contactez-nous par email.</p>}

          <button type="submit" className="btn btn-primary" disabled={state === "loading"} aria-busy={state === "loading"}>
            {state === "loading" ? (
              <>
                <span className="spinner" aria-hidden style={{ marginRight: 10 }} />
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer la pré-inscription
                <span className="btn-dot" aria-hidden />
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}
