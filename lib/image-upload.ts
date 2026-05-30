/**
 * Upload + compression d'images côté client.
 *
 * Utilisé par l'éditeur d'article (images dans le corps) et par le champ
 * « image de couverture ». Avant l'envoi au serveur, l'image est :
 *   1. redimensionnée si elle dépasse MAX_DIMENSION (les photos de téléphone
 *      font souvent 4000-6000 px de large pour rien)
 *   2. ré-encodée en WebP (qualité 0.82) si c'est plus léger que l'original
 *
 * Les GIF (potentiellement animés) et les fichiers déjà petits sont laissés
 * intacts. Le serveur (route /api/admin/upload) revalide tout de toute façon.
 */

const MAX_DIMENSION = 1920; // largeur/hauteur max après compression
const WEBP_QUALITY = 0.82;
const SKIP_COMPRESS_BELOW = 200 * 1024; // < 200 Ko : pas la peine de recompresser

export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // doit rester aligné sur la route serveur

export class UploadError extends Error {}

/**
 * Réduit et ré-encode une image en WebP via un canvas.
 * Renvoie le fichier d'origine si la compression échoue ou n'apporte rien.
 */
export async function compressImage(file: File): Promise<File> {
  // GIF (animation) ou type non-bitmap : on ne touche pas.
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;
  if (file.size < SKIP_COMPRESS_BELOW) return file;
  if (typeof document === "undefined" || typeof createImageBitmap === "undefined") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    // Rien à gagner : déjà petit et pas en JPEG/PNG lourd → on garde l'original.
    if (scale === 1 && file.type === "image/webp") {
      bitmap.close?.();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file; // pas plus léger → on garde l'original

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp", lastModified: Date.now() });
  } catch {
    return file; // toute erreur de décodage → on envoie l'original
  }
}

export interface UploadResult {
  url: string;
  size: number;
  type: string;
}

/**
 * Compresse puis envoie une image. Lève UploadError avec un message lisible
 * en cas d'échec (taille, format, réseau, serveur).
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new UploadError("Ce fichier n'est pas une image.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("Image trop lourde (10 Mo maximum).");
  }

  const optimized = await compressImage(file);

  const fd = new FormData();
  fd.append("file", optimized);

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  } catch {
    throw new UploadError("Connexion impossible. Vérifiez votre réseau et réessayez.");
  }

  let data: { url?: string; size?: number; type?: string; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* réponse non-JSON */
  }

  if (!res.ok || !data.url) {
    throw new UploadError(data.message ?? "L'envoi de l'image a échoué.");
  }

  return { url: data.url, size: data.size ?? optimized.size, type: data.type ?? optimized.type };
}
