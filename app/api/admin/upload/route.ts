import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { isAuthenticated } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo (les PDF peuvent être plus lourds que les images)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"] as const;
type AllowedMime = (typeof ALLOWED)[number];

const EXT_FROM_MIME: Record<AllowedMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

// Magic bytes (signatures binaires) — empêche un attaquant d'uploader
// un fichier exécutable renommé en .jpg.
function detectMimeFromBytes(buf: Buffer): AllowedMime | null {
  if (buf.length < 12) return null;
  // JPEG : FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // PNG : 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  // GIF : 47 49 46 38
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  // WEBP : RIFF....WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "image/webp";
  // PDF : 25 50 44 46 (%PDF)
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return "application/pdf";
  return null;
}

// Rate-limit en mémoire — protège contre admin compromis qui spammerait l'upload
const uploadHits = new Map<string, number[]>();
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const window = 60 * 1000;
  const hits = (uploadHits.get(key) ?? []).filter((t) => now - t < window);
  if (hits.length >= 10) return true;
  hits.push(now);
  uploadHits.set(key, hits);
  return false;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  if (isRateLimited("admin")) {
    return NextResponse.json({ message: "Trop d'uploads. Patientez une minute." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!(ALLOWED as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { message: "Format non supporté (JPG, PNG, WEBP, GIF ou PDF uniquement)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "Fichier trop volumineux (10 Mo max)." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validation magic bytes (le type MIME déclaré est falsifiable)
  const realMime = detectMimeFromBytes(buffer);
  if (!realMime || realMime !== file.type) {
    return NextResponse.json(
      { message: "Le contenu du fichier ne correspond pas à son format." },
      { status: 400 }
    );
  }

  const ext = EXT_FROM_MIME[realMime];
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  // ─── Production (Vercel) : Vercel Blob ───
  // En prod le filesystem est read-only. Quand BLOB_READ_WRITE_TOKEN est
  // configuré (Settings Vercel → Storage → Blob), on l'utilise.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const key = `uploads/${yyyy}/${mm}/${id}`;
      const blob = await put(key, buffer, {
        access: "public",
        contentType: realMime,
        addRandomSuffix: false,
        cacheControlMaxAge: 31536000,
      });
      return NextResponse.json(
        { url: blob.url, size: file.size, type: realMime },
        { status: 200 }
      );
    } catch (err) {
      console.error("[upload] Vercel Blob erreur :", err);
      return NextResponse.json({ message: "Erreur d'enregistrement." }, { status: 500 });
    }
  }

  // ─── Dev (local) : filesystem ───
  try {
    const dir = path.join(process.cwd(), "public", "uploads", yyyy, mm);
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, id), buffer);
    return NextResponse.json(
      { url: `/uploads/${yyyy}/${mm}/${id}`, size: file.size, type: realMime },
      { status: 200 }
    );
  } catch (err) {
    console.error("[upload] Filesystem erreur :", err);
    return NextResponse.json({ message: "Erreur d'enregistrement." }, { status: 500 });
  }
}
