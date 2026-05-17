"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log côté client uniquement, sans révéler la stack
    console.error("[client] erreur capturée", error.digest ?? "");
  }, [error]);

  return (
    <main id="main" style={{ minHeight: "70vh", display: "flex", alignItems: "center", background: "var(--bg)" }}>
      <div className="container center" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <span
          lang="ja"
          aria-hidden
          style={{
            fontFamily: "var(--serif-jp)",
            fontSize: "clamp(120px, 18vw, 220px)",
            color: "var(--sumi)",
            opacity: 0.07,
            lineHeight: 1,
            display: "block",
            marginBottom: -40,
          }}
        >
          困
        </span>
        <h1 className="title-lg" style={{ marginBottom: 12 }}>
          Une <em>chute</em> imprévue.
        </h1>
        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: 17,
            color: "var(--stone)",
            marginBottom: 40,
            maxWidth: 540,
            margin: "0 auto 40px",
          }}
        >
          Une erreur est survenue de notre côté. Nous avons été notifiés —
          en attendant, vous pouvez réessayer ou retourner à l&apos;accueil.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} className="btn btn-primary">
            Réessayer
            <span className="btn-dot" aria-hidden />
          </button>
          <Link href="/" className="btn btn-secondary btn-arrow">
            Retour à l&apos;accueil
          </Link>
        </div>
        {error.digest && (
          <p style={{ marginTop: 32, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone-soft)" }}>
            Code erreur · {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
