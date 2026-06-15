import type { MetadataRoute } from "next";
import { club } from "@/club.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/preview", "/api"],
    },
    sitemap: `${club.url}/sitemap.xml`,
  };
}
