import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db, queryOne } from "@/lib/db";
import type { Formule } from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);
const RESEND_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_KEY && RESEND_KEY.startsWith("re_") ? new Resend(RESEND_KEY) : null;

const VALID_PLANS = ["baby", "benjamin", "senior"] as const;
type Plan = (typeof VALID_PLANS)[number];

// Limites strictes (anti payload massif + cohérence DB)
const LIMITS = {
  fullName: 120,
  email: 255,
  phone: 32,
  parentName: 120,
  parentRelation: 32,
} as const;

const RELATION_VALUES = ["mere", "pere", "tuteur", "autre"] as const;

// Rate-limit en mémoire (par instance lambda). Pour un site low-traffic c'est suffisant.
const rateMap = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  if (!ip || ip === "unknown") return false; // ne pas bloquer si IP non détectable
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 h
  const hits = (rateMap.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= 3) return true;
  hits.push(now);
  rateMap.set(ip, hits);
  return false;
}

function getClientIp(req: NextRequest): string {
  // Sur Vercel : x-vercel-forwarded-for est fiable. Fallback sur x-forwarded-for.
  const vercel = req.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() ?? "unknown";
}

function computeAge(dob: string): number {
  const birth = new Date(dob);
  let age = new Date().getFullYear() - birth.getFullYear();
  const m = new Date().getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < birth.getDate())) age--;
  return age;
}

function cleanString(v: unknown, maxLength: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLength);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  // Honeypot — bot
  if (body._honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const fullName = cleanString(body.fullName, LIMITS.fullName);
  const email = cleanString(body.email, LIMITS.email).toLowerCase();
  const phone = cleanString(body.phone, LIMITS.phone);
  const birthDate = typeof body.birthDate === "string" ? body.birthDate : "";
  const plan = typeof body.plan === "string" ? body.plan : "";

  if (!fullName) {
    return NextResponse.json({ message: "Nom requis." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ message: "Email invalide." }, { status: 400 });
  }
  if (!phone || !/^[+\d\s().-]{6,}$/.test(phone)) {
    return NextResponse.json({ message: "Téléphone invalide." }, { status: 400 });
  }
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || new Date(birthDate) > new Date()) {
    return NextResponse.json({ message: "Date de naissance invalide." }, { status: 400 });
  }
  if (!VALID_PLANS.includes(plan as Plan)) {
    return NextResponse.json({ message: "Formule invalide." }, { status: 400 });
  }

  const age = computeAge(birthDate);
  if (age < 0 || age > 120) {
    return NextResponse.json({ message: "Date de naissance invalide." }, { status: 400 });
  }
  const isMinor = age < 18;

  let planLabel = plan;
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

  const souhaitCompetition = body.souhait_competition === true;

  // Champs responsable légal (mineurs)
  let cleanParentName: string | null = null;
  let cleanParentRelation: string | null = null;
  if (isMinor) {
    cleanParentName = cleanString(body.parentName, LIMITS.parentName);
    if (!cleanParentName) {
      return NextResponse.json({ message: "Responsable légal requis pour un·e mineur·e." }, { status: 400 });
    }
    const rel = cleanString(body.parentRelation, LIMITS.parentRelation);
    if (rel && (RELATION_VALUES as readonly string[]).includes(rel)) {
      cleanParentRelation = rel;
    }
  }

  try {
    if (DB_READY) {
      const [existing] = await db.execute(
        "SELECT id FROM preregistrations WHERE email = ? AND birth_date = ? AND status IN ('pending','contacted') LIMIT 1",
        [email, birthDate]
      );
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { message: "Une pré-inscription est déjà en cours pour ce dossier. Nous vous contacterons." },
          { status: 409 }
        );
      }
      await db.execute(
        "INSERT INTO preregistrations (full_name, email, phone, birth_date, plan, status, parent_name, parent_relation, souhait_competition) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)",
        [fullName, email, phone, birthDate, plan, cleanParentName, cleanParentRelation, souhaitCompetition ? 1 : 0]
      );
    }

    if (resend) {
      try {
        await Promise.all([
          resend.emails.send({
            from: process.env.FROM_EMAIL ?? "AME-JUDO <noreply@ame-judo.fr>",
            to: email,
            subject: "AME-JUDO — Votre pré-inscription est bien reçue",
            html: confirmationHtml(fullName, planLabel),
          }),
          resend.emails.send({
            from: process.env.FROM_EMAIL ?? "AME-JUDO <noreply@ame-judo.fr>",
            to: process.env.BUREAU_EMAIL ?? "amejudoermont@gmail.com",
            subject: `Nouvelle pré-inscription — ${fullName} — ${planLabel}`,
            html: bureauHtml(fullName, email, phone, birthDate, planLabel, cleanParentName, cleanParentRelation, souhaitCompetition),
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

// ─── Helpers HTML email ──────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function confirmationHtml(name: string, plan: string) {
  const n = escapeHtml(name);
  const p = escapeHtml(plan);
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#F5F1EA;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:40px auto;background:#FBFAF6;border:1px solid #ddd;">
    <div style="padding:32px 40px;border-bottom:1px solid #eee;">
      <p style="font-family:Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6B6B6B;margin:0 0 8px;">AME-JUDO · Arts Martiaux Ermontois</p>
      <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin:0;">Pré-inscription reçue</h1>
    </div>
    <div style="padding:32px 40px;">
      <p>Bonjour ${n},</p>
      <p>Votre pré-inscription pour la formule <strong>${p}</strong> est bien enregistrée.</p>
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

function bureauHtml(name: string, email: string, phone: string, dob: string, plan: string, parentName: string | null, parentRelation: string | null, competition = false) {
  const age = computeAge(dob);
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const ph = escapeHtml(phone);
  const p = escapeHtml(plan);
  const pn = parentName ? escapeHtml(parentName) : "";
  const pr = parentRelation ? RELATION_LABELS[parentRelation] ?? escapeHtml(parentRelation) : "";
  const parentRows = pn ? `
      <tr><td colspan="2" style="padding:16px 0 4px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#6B6B6B;">Responsable légal</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;width:140px;">Nom</td><td>${pn}</td></tr>
      ${pr ? `<tr><td style="padding:8px 0;color:#6B6B6B;">Lien</td><td>${pr}</td></tr>` : ""}` : "";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#F5F1EA;font-family:Helvetica,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#FBFAF6;border:1px solid #ddd;padding:32px 40px;">
    <h2 style="font-size:20px;margin:0 0 24px;">Nouvelle pré-inscription</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#6B6B6B;width:140px;">Nom</td><td>${n}</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Email</td><td><a href="mailto:${e}">${e}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Téléphone</td><td><a href="tel:${ph}">${ph}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Âge</td><td>${age} ans (né·e le ${new Date(dob).toLocaleDateString("fr-FR")})</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Formule</td><td>${p}</td></tr>
      <tr><td style="padding:8px 0;color:#6B6B6B;">Compétition</td><td>${competition ? "✓ Oui" : "Non"}</td></tr>
      ${parentRows}
    </table>
  </div>
</body></html>`;
}
