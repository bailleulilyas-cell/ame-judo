import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db, queryOne } from "@/lib/db";
import type { Formule } from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);
const RESEND_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_KEY && RESEND_KEY.startsWith("re_") ? new Resend(RESEND_KEY) : null;

const VALID_PLANS = ["baby", "benjamin", "senior"] as const;
type Plan = (typeof VALID_PLANS)[number];

const rateMap = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const hits = (rateMap.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= 3) return true;
  hits.push(now);
  rateMap.set(ip, hits);
  return false;
}

function computeAge(dob: string): number {
  const birth = new Date(dob);
  let age = new Date().getFullYear() - birth.getFullYear();
  const m = new Date().getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < birth.getDate())) age--;
  return age;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const { fullName, email, phone, birthDate, plan, parentName, parentRelation, _honeypot } = body;

  if (_honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!fullName?.trim()) {
    return NextResponse.json({ message: "Nom requis." }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Email invalide." }, { status: 400 });
  }
  if (!phone?.trim()) {
    return NextResponse.json({ message: "Téléphone requis." }, { status: 400 });
  }
  if (!birthDate || new Date(birthDate) > new Date()) {
    return NextResponse.json({ message: "Date de naissance invalide." }, { status: 400 });
  }
  if (!VALID_PLANS.includes(plan as Plan)) {
    return NextResponse.json({ message: "Formule invalide." }, { status: 400 });
  }

  const age = computeAge(birthDate);
  const isMinor = age < 18;

  let planLabel = plan as string;
  if (DB_READY) {
    const formule = await queryOne<Formule>(
      "SELECT * FROM formules WHERE plan_key = ? LIMIT 1",
      [plan]
    );
    if (!formule) {
      return NextResponse.json({ message: "Formule introuvable." }, { status: 400 });
    }
    if (formule.age_min !== null && age < formule.age_min) {
      return NextResponse.json(
        { message: `Cette formule est réservée aux ${formule.age_min} ans et plus.` },
        { status: 400 }
      );
    }
    if (formule.age_max !== null && age > formule.age_max) {
      return NextResponse.json(
        { message: `Cette formule est réservée aux ${formule.age_max} ans et moins.` },
        { status: 400 }
      );
    }
    planLabel = `${formule.nom} (${formule.tranche_age})`;
  }

  if (isMinor && !parentName?.trim()) {
    return NextResponse.json({ message: "Responsable légal requis pour un·e mineur·e." }, { status: 400 });
  }

  const cleanName = fullName.trim();
  const cleanEmail = email.toLowerCase().trim();
  const cleanPhone = phone.trim();
  const cleanParentName = isMinor && parentName ? String(parentName).trim() : null;
  const cleanParentRelation = isMinor && parentRelation ? String(parentRelation).trim() : null;

  try {
    if (DB_READY) {
      const [existing] = await db.execute(
        "SELECT id FROM preregistrations WHERE email = ? AND birth_date = ? AND status IN ('pending','contacted') LIMIT 1",
        [cleanEmail, birthDate]
      );
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { message: "Une pré-inscription est déjà en cours pour ce dossier. Nous vous contacterons." },
          { status: 409 }
        );
      }
      await db.execute(
        "INSERT INTO preregistrations (full_name, email, phone, birth_date, plan, status, parent_name, parent_relation) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)",
        [cleanName, cleanEmail, cleanPhone, birthDate, plan, cleanParentName, cleanParentRelation]
      );
    }

    if (resend) {
      try {
        await Promise.all([
          resend.emails.send({
            from: process.env.FROM_EMAIL ?? "AME <noreply@ame-judo.fr>",
            to: cleanEmail,
            subject: "AME — Votre pré-inscription est bien reçue",
            html: confirmationHtml(cleanName, planLabel),
          }),
          resend.emails.send({
            from: process.env.FROM_EMAIL ?? "AME <noreply@ame-judo.fr>",
            to: process.env.BUREAU_EMAIL ?? "amejudoermont@gmail.com",
            subject: `Nouvelle pré-inscription — ${cleanName} — ${planLabel}`,
            html: bureauHtml(cleanName, cleanEmail, cleanPhone, birthDate, planLabel, cleanParentName, cleanParentRelation),
          }),
        ]);
      } catch (mailErr) {
        console.warn("[preregistrations] Email non envoyé (la pré-inscription reste enregistrée) :", mailErr);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[preregistrations] Erreur :", err);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

function confirmationHtml(name: string, plan: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#F5F1EA;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:40px auto;background:#FBFAF6;border:1px solid #ddd;">
    <div style="padding:32px 40px;border-bottom:1px solid #eee;">
      <p style="font-family:Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6B6B6B;margin:0 0 8px;">AME · Arts Martiaux Ermontois</p>
      <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin:0;">Pré-inscription reçue</h1>
    </div>
    <div style="padding:32px 40px;">
      <p>Bonjour ${name},</p>
      <p>Votre pré-inscription pour la formule <strong>${plan}</strong> est bien enregistrée.</p>
      <p>Un membre du bureau vous contactera dans les 48 heures pour convenir de vos séances d'essai.</p>
      <p><strong>Deux séances d'essai gratuites</strong> vous attendent avant tout engagement.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="font-size:13px;color:#6B6B6B;"><strong>Adresse du dojo</strong><br>Complexe Sportif Saint-Exupéry<br>Rue Kvot et Leydekkers, 95120 Ermont</p>
    </div>
  </div>
</body></html>`;
}

const RELATION_LABELS: Record<string, string> = {
  mere: "Mère",
  pere: "Père",
  tuteur: "Tuteur / tutrice légal·e",
  autre: "Autre",
};

function bureauHtml(name: string, email: string, phone: string, dob: string, plan: string, parentName: string | null, parentRelation: string | null) {
  const age = computeAge(dob);
  const parentRows = parentName ? `
      <tr><td colspan="2" style="padding:16px 0 4px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#6B6B6B;">Responsable légal</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;width:140px;">Nom</td><td>${parentName}</td></tr>
      ${parentRelation ? `<tr><td style="padding:8px 0;color:#6B6B6B;">Lien</td><td>${RELATION_LABELS[parentRelation] ?? parentRelation}</td></tr>` : ""}` : "";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#F5F1EA;font-family:Helvetica,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#FBFAF6;border:1px solid #ddd;padding:32px 40px;">
    <h2 style="font-size:20px;margin:0 0 24px;">Nouvelle pré-inscription</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#6B6B6B;width:140px;">Nom</td><td>${name}</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Téléphone</td><td><a href="tel:${phone}">${phone}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Âge</td><td>${age} ans (né·e le ${new Date(dob).toLocaleDateString("fr-FR")})</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Formule</td><td>${plan}</td></tr>
      ${parentRows}
    </table>
  </div>
</body></html>`;
}
