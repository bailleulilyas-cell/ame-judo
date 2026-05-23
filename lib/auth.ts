/**
 * Authentification admin.
 *
 * - Mot de passe haché bcrypt stocké dans la table `settings`
 * - Fallback sur ADMIN_PASSWORD (.env) au premier démarrage
 * - Session JWT signée avec AUTH_SECRET, cookie httpOnly + secure (prod)
 * - Comparaison timing-safe contre les timing attacks
 * - Rate-limiting : 5 tentatives / 15 min → blocage 30 min
 * - Token version : invalide toutes les sessions à chaque changement de mot de passe
 */
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "ame_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET manquant ou trop court (32 caractères minimum)."
    );
  }
  return new TextEncoder().encode(secret);
}

// ─── Settings (DB) ────────────────────────────────────────────
async function readSetting(key: string): Promise<string | null> {
  try {
    const { query } = await import("@/lib/db");
    const rows = await query<{ value: string }>(
      "SELECT `value` FROM app_settings WHERE `key` = ? LIMIT 1",
      [key]
    );
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

async function writeSetting(key: string, value: string): Promise<boolean> {
  try {
    const { query } = await import("@/lib/db");
    await query(
      "INSERT INTO app_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
      [key, value]
    );
    return true;
  } catch {
    return false;
  }
}

async function getCurrentTokenVersion(): Promise<number> {
  const v = await readSetting("token_version");
  return v ? Number(v) || 1 : 1;
}

async function bumpTokenVersion(): Promise<void> {
  const next = (await getCurrentTokenVersion()) + 1;
  await writeSetting("token_version", String(next));
}

// ─── Session ──────────────────────────────────────────────────
export async function createSession(): Promise<void> {
  const tokenVersion = await getCurrentTokenVersion();
  const token = await new SignJWT({ role: "admin", v: tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    // Vérifie que la version du token correspond à la version courante (rotation)
    const tokenV = typeof payload.v === "number" ? payload.v : 1;
    const currentV = await getCurrentTokenVersion();
    if (tokenV !== currentV) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// ─── Mot de passe ─────────────────────────────────────────────
function constantTimeStringCompare(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  const max = Math.max(bufA.length, bufB.length, 1);
  const padA = new Uint8Array(max);
  const padB = new Uint8Array(max);
  padA.set(bufA);
  padB.set(bufB);
  const same = timingSafeEqual(padA, padB);
  return same && bufA.length === bufB.length;
}

export async function verifyPassword(input: string): Promise<boolean> {
  if (!input || input.length > 256) return false;

  // 1) Hash bcrypt en DB
  const dbHash = await readSetting("password_hash");
  if (dbHash && dbHash.startsWith("$2")) {
    try {
      return await bcrypt.compare(input, dbHash);
    } catch {
      return false;
    }
  }

  // 2) Fallback : mot de passe en clair dans .env (premier démarrage)
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return constantTimeStringCompare(input, expected);
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (!currentPassword || !newPassword) {
    return { ok: false, error: "Champs manquants." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  }
  if (newPassword.length > 128) {
    return { ok: false, error: "Le mot de passe est trop long (max 128 caractères)." };
  }

  const valid = await verifyPassword(currentPassword);
  if (!valid) {
    return { ok: false, error: "Mot de passe actuel incorrect." };
  }

  const hash = await bcrypt.hash(newPassword, 12);
  const saved = await writeSetting("password_hash", hash);
  if (!saved) {
    return { ok: false, error: "Erreur lors de la sauvegarde. Réessayez." };
  }

  // Invalide toutes les sessions existantes
  await bumpTokenVersion();
  // Renouvelle la session courante avec la nouvelle version
  await createSession();

  return { ok: true };
}

// ─── Rate-limiting connexion ──────────────────────────────────
type Attempt = { count: number; firstAt: number; blockedUntil: number };
const attempts = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 30 * 60 * 1000;

export function loginRateCheck(ip: string): { allowed: boolean; retryAfterSec?: number } {
  if (!ip || ip === "local" || ip === "unknown") return { allowed: true };
  const now = Date.now();
  const a = attempts.get(ip);

  if (a && a.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((a.blockedUntil - now) / 1000) };
  }

  if (!a || now - a.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now, blockedUntil: 0 });
    return { allowed: true };
  }

  a.count += 1;
  if (a.count > MAX_ATTEMPTS) {
    a.blockedUntil = now + BLOCK_MS;
    return { allowed: false, retryAfterSec: Math.ceil(BLOCK_MS / 1000) };
  }

  return { allowed: true };
}

export function loginRateReset(ip: string): void {
  attempts.delete(ip);
}
