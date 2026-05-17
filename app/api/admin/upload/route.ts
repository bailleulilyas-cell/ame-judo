import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { isAuthenticated } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT_FROM_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
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
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { message: "Format non supporté (JPG, PNG, WEBP ou GIF uniquement)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "Fichier trop volumineux (5 Mo max)." },
      { status: 400 }
    );
  }

  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dir = path.join(process.cwd(), "public", "uploads", yyyy, mm);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  const ext = EXT_FROM_MIME[file.type] ?? "bin";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, id), buffer);

  const url = `/uploads/${yyyy}/${mm}/${id}`;
  return NextResponse.json({ url, size: file.size, type: file.type }, { status: 200 });
}
