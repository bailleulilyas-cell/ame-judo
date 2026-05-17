import type { MetadataRoute } from "next";

const BASE_URL = "https://ame-judo.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/rgpd`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // TODO: ajouter les actualités depuis Supabase
  // const supabase = await createClient()
  // const { data: actus } = await supabase.from("actualites").select("slug, updated_at").eq("statut","published")
  // const actuRoutes = (actus ?? []).map(a => ({ url: `${BASE_URL}/actualites/${a.slug}`, lastModified: new Date(a.updated_at) }))

  return staticRoutes;
}
