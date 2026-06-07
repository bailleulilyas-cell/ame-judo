import type { NextConfig } from "next";

// CSP — équilibre sécurité / fonctionnalité.
// 'unsafe-inline' sur style nécessaire (nombreux style={} inline).
// 'unsafe-inline' / 'unsafe-eval' sur script car Next.js streaming + hydratation.
// Pour un site low-risk (vitrine club) c'est un bon compromis.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: fonts.gstatic.com",
  "connect-src 'self' vitals.vercel-insights.com",
  "frame-src 'self' https://maps.google.com https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "accelerometer=()",
      "gyroscope=()",
      "fullscreen=(self)",
    ].join(", "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Anti enumération technologique
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.94", "*.local"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Pour les images uploadées sur Vercel Blob (quand activé)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Cache long pour les assets statiques
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Logo (présent sur chaque page, LCP) : cache 1 jour au lieu de max-age=0
      {
        source: "/logo.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  async redirects() {
    return [
      // Ancienne URL /voies → nouvelle URL /judo (préserve le SEO)
      { source: "/voies", destination: "/judo", permanent: true },
      { source: "/voies/:slug", destination: "/judo", permanent: true },
      // URLs tapées à la main (audit) → pages réelles, au lieu d'un 404
      { source: "/le-judo", destination: "/judo", permanent: true },
      { source: "/documents", destination: "/adhesion#documents-section", permanent: true },
    ];
  },
};

export default nextConfig;
