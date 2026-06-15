import { ImageResponse } from "next/og";
import { club } from "@/club.config";

// Next.js convention : Open Graph image générée à la build
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = club.seo.titleDefault;

export const runtime = "edge";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: club.theme.paper,
          fontFamily: "serif",
          color: "#1A1A1A",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#A8A192",
          }}
        >
          {club.og.eyebrow}
        </div>

        <div
          style={{
            fontSize: 240,
            color: club.theme.accent,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          {club.theme.kanjiHero}
        </div>

        <div
          style={{
            fontSize: 78,
            fontWeight: 300,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {club.og.title}
        </div>

        <div
          style={{
            fontSize: 28,
            fontStyle: "italic",
            color: "#6B6B6B",
            marginTop: 24,
          }}
        >
          {club.og.subtitle}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#A8A192",
          }}
        >
          {club.domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
