import Link from "next/link";

interface Props {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
  saved?: boolean;
}

export default function AdminPageHeader({ title, description, backHref, backLabel, action, saved }: Props) {
  return (
    <div style={{ marginBottom: 32 }}>
      {backHref && (
        <Link
          href={backHref}
          style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 16, display: "inline-block" }}
        >
          ← {backLabel ?? "Retour"}
        </Link>
      )}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <h1 className="admin-h1" style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: title }} />
        {action}
      </div>
      {description && (
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", marginTop: 8, marginBottom: 0 }}>
          {description}
        </p>
      )}
      {saved && (
        <div style={{
          marginTop: 16, padding: "10px 16px",
          background: "rgba(45,125,70,0.08)",
          borderLeft: "3px solid #2D7D46",
          color: "#2D7D46",
          fontSize: 13,
        }} role="status">
          ✓ Modifications enregistrées
        </div>
      )}
    </div>
  );
}
