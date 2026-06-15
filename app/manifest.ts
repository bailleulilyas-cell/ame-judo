import type { MetadataRoute } from "next";
import { club } from "@/club.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: club.legalName,
    short_name: club.shortName,
    description: `Club de ${club.sport.toLowerCase()} à ${club.city} depuis ${club.foundingYear}.`,
    start_url: "/",
    display: "standalone",
    background_color: club.theme.paper,
    theme_color: club.theme.paper,
    lang: club.lang,
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
