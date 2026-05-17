#!/usr/bin/env node
/**
 * Génère un AUTH_SECRET aléatoire (32 octets, alphanumérique uniquement).
 * Évite les caractères qui posent problème à dotenv ($, +, /, =).
 *
 * Usage : node scripts/generate-secrets.mjs
 */
import { randomBytes } from "node:crypto";

// On filtre pour ne garder que [A-Za-z0-9] — évite les soucis dotenv avec $/+
const raw = randomBytes(64).toString("base64");
const secret = raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 48);

console.log("\nÀ copier dans .env.local :\n");
console.log(`AUTH_SECRET=${secret}\n`);
console.log("Pour le mot de passe admin, éditez simplement la ligne :");
console.log(`ADMIN_PASSWORD=votre-mot-de-passe\n`);
