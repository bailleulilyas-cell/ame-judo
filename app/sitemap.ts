import type { MetadataRoute } from "next";
import { getActualites } from "@/lib/data";

const BASE_URL = "https://ame-judo.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                       lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/judo`,             lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE_URL}/horaires`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/maitres`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/adhesion`,         lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE_URL}/competition`,      lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE_URL}/actualites`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/galerie`,          lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/contact`,          lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE_URL}/rgpd`,             lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  // Actualités publiées
  let actuRoutes: MetadataRoute.Sitemap = [];
  try {
    const actus = await getActualites(200);
    actuRoutes = actus
      .filter((a) => a.statut === "published")
      .map((a) => ({
        url: `${BASE_URL}/actualites/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(a.date_publication),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      }));
  } catch {
    // Si la DB est down, on retourne au moins les routes statiques
  }

  return [...staticRoutes, ...actuRoutes];
}
