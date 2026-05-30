"use client";

// Page d'erreur "ultime" pour les crashs qui empêchent même le layout de se charger.
// Doit définir son propre <html> et <body>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F1EA",
          fontFamily: "Georgia, serif",
          color: "#1A1A1A",
          padding: 40,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <div lang="ja" style={{ fontSize: 80, color: "#C8332A", marginBottom: 12 }}>
            道
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            Une chute imprévue.
          </h1>
          <p style={{ fontSize: 16, color: "#6B6B6B", lineHeight: 1.6, marginBottom: 28 }}>
            Une erreur critique nous empêche d&apos;afficher le site. Nous travaillons à la régler.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#1A1A1A",
              color: "#F5F1EA",
              border: "none",
              padding: "14px 28px",
              fontFamily: "Helvetica, sans-serif",
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
