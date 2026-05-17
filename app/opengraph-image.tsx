import { ImageResponse } from "next/og";

// Next.js convention : Open Graph image générée à la build
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AME — Arts Martiaux Ermontois · Judo, Ju-jitsu, Taïso à Ermont";

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
          background: "#F5F1EA",
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
          AME · Depuis 1978
        </div>

        <div
          style={{
            fontSize: 240,
            color: "#B5341E",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          道
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
          Arts Martiaux Ermontois
        </div>

        <div
          style={{
            fontSize: 28,
            fontStyle: "italic",
            color: "#6B6B6B",
            marginTop: 24,
          }}
        >
          Judo · Ju-jitsu · Taïso · Ermont (95)
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
          ame-judo.fr
        </div>
      </div>
    ),
    { ...size }
  );
}
