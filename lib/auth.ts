/**
 * Authentification admin.
 *
 * - Mot de passe haché bcrypt stocké dans la table `settings` (DB)
 * - Fallback sur ADMIN_PASSWORD (.env) au premier démarrage
 * - Session JWT signée avec AUTH_SECRET, cookie httpOnly
 * - Comparaison timing-safe contre les timing attacks
 * - Rate-limiting : 5 tentatives / 15 min → blocage 30 min
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

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
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
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

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

async function getStoredHash(): Promise<string | null> {
  try {
    const { query } = await import("@/lib/db");
    const rows = await query<{ value: string }>(
      "SELECT `value` FROM settings WHERE `key` = 'password_hash' LIMIT 1"
    );
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

export async function verifyPassword(input: string): Promise<boolean> {
  if (!input) return false;

  // Priorité 1 : hash bcrypt stocké en DB
  const dbHash = await getStoredHash();
  if (dbHash && dbHash.startsWith("$2")) {
    try {
      return await bcrypt.compare(input, dbHash);
    } catch {
      return false;
    }
  }

  // Priorité 2 : mot de passe en clair dans .env (premier démarrage)
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

  const valid = await verifyPassword(currentPassword);
  if (!valid) {
    return { ok: false, error: "Mot de passe actuel incorrect." };
  }

  const hash = await bcrypt.hash(newPassword, 12);

  try {
    const { query } = await import("@/lib/db");
    await query(
      "INSERT INTO settings (`key`, `value`) VALUES ('password_hash', ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
      [hash]
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Erreur lors de la sauvegarde. Réessayez." };
  }
}

// ─── Rate-limiting connexion ──────────────────────────────────
type Attempt = { count: number; firstAt: number; blockedUntil: number };
const attempts = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 30 * 60 * 1000;

export function loginRateCheck(ip: string): { allowed: boolean; retryAfterSec?: number } {
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
