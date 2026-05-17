// Squelette générique pendant la navigation
export default function Loading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
      role="status"
      aria-live="polite"
      aria-label="Chargement"
    >
      <div style={{ textAlign: "center" }}>
        <span
          lang="ja"
          aria-hidden
          style={{
            fontFamily: "var(--serif-jp)",
            fontSize: 48,
            color: "var(--red)",
            display: "block",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        >
          道
        </span>
        <style>{`@keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}`}</style>
      </div>
    </div>
  );
}
