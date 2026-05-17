import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updatePassword } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Changer le mot de passe",
  robots: { index: false },
};

async function changePassword(formData: FormData) {
  "use server";
  const current = (formData.get("current") as string) ?? "";
  const next = (formData.get("next") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (next !== confirm) {
    redirect("/admin/password?error=mismatch");
  }

  const result = await updatePassword(current, next);
  if (!result.ok) {
    const code = result.error?.includes("actuel") ? "wrong" : "error";
    redirect(`/admin/password?error=${code}`);
  }

  redirect("/admin/password?success=1");
}

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <>
      <h1 className="admin-h1">Mot de passe</h1>
      <p style={{ color: "var(--stone)", marginBottom: 32, fontFamily: "var(--serif)", fontStyle: "italic" }}>
        Choisissez un mot de passe d'au moins 8 caractères.
      </p>

      {success && (
        <div role="alert" style={{
          marginBottom: 24, padding: "14px 20px",
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          color: "#166534", borderRadius: 4, fontSize: 14,
        }}>
          Mot de passe mis à jour avec succès.
        </div>
      )}

      <form action={changePassword} style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 20 }}>

        <div className="form-field">
          <label className="form-label" htmlFor="current">Mot de passe actuel</label>
          <input
            id="current" name="current" type="password"
            className={`form-input${error === "wrong" ? " is-invalid" : ""}`}
            required autoFocus autoComplete="current-password"
          />
          {error === "wrong" && (
            <p className="form-error" role="alert">Mot de passe actuel incorrect.</p>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="next">Nouveau mot de passe</label>
          <input
            id="next" name="next" type="password"
            className="form-input"
            required minLength={8} autoComplete="new-password"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="confirm">Confirmer le nouveau mot de passe</label>
          <input
            id="confirm" name="confirm" type="password"
            className={`form-input${error === "mismatch" ? " is-invalid" : ""}`}
            required minLength={8} autoComplete="new-password"
          />
          {error === "mismatch" && (
            <p className="form-error" role="alert">Les mots de passe ne correspondent pas.</p>
          )}
        </div>

        {error === "error" && (
          <p className="form-error" role="alert">Une erreur est survenue. Réessayez.</p>
        )}

        <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          Enregistrer
          <span className="btn-dot" aria-hidden />
        </button>
      </form>
    </>
  );
}
