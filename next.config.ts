import type { NextConfig } from "next";

const securityHeaders = [
  // Empêche l'embedding du site dans une iframe externe (anti clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Bloque le sniffing MIME (force le navigateur à respecter Content-Type)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limite ce qu'on envoie comme Referer aux sites externes
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive l'accès au caméra / micro / géoloc par défaut
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Force HTTPS pendant 1 an (effectif en production seulement)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.94", "*.local"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
