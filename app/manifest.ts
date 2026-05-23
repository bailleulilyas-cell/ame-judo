import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AME — Arts Martiaux Ermontois",
    short_name: "AME",
    description: "Club de judo à Ermont depuis 1978.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F1EA",
    theme_color: "#F5F1EA",
    lang: "fr-FR",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
