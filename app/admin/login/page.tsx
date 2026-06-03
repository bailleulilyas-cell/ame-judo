import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSession, verifyPassword, isAuthenticated, loginRateCheck, loginRateReset } from "@/lib/auth";
import PasswordField from "@/components/PasswordField";

export const metadata: Metadata = {
  title: "Connexion administrateur",
  robots: { index: false },
};

async function login(formData: FormData) {
  "use server";
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "local";

  const rate = loginRateCheck(ip);
  if (!rate.allowed) {
    console.warn(`[admin/login] IP ${ip} bloquée — réessai dans ${rate.retryAfterSec}s`);
    redirect(`/admin/login?error=blocked&retry=${rate.retryAfterSec}`);
  }

  const password = (formData.get("password") as string) ?? "";
  const ok = await verifyPassword(password);

  if (!ok) {
    console.warn(`[admin/login] Échec depuis IP ${ip}`);
    redirect("/admin/login?error=1");
  }

  loginRateReset(ip);
  await createSession();
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; retry?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error, retry } = await searchParams;

  const blocked = error === "blocked";
  const retryMin = retry ? Math.ceil(Number(retry) / 60) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px var(--pad-x)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span lang="ja" style={{ fontFamily: "var(--serif-jp)", fontSize: 44, display: "block", marginBottom: 8 }}>管</span>
          <h1 className="title-md" style={{ marginBottom: 8 }}>Espace administrateur</h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)", fontSize: 14, margin: 0 }}>
            AME-JUDO — réservé au bureau du club
          </p>
        </div>

        <form action={login}>
          <PasswordField disabled={blocked} />

          {error === "1" && (
            <p className="form-error" style={{ marginBottom: 16 }} role="alert">
              Mot de passe incorrect.
            </p>
          )}
          {blocked && (
            <p className="form-error" style={{ marginBottom: 16 }} role="alert">
              Trop de tentatives. Réessayez dans {retryMin} minute{retryMin > 1 ? "s" : ""}.
            </p>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={blocked}>
            Se connecter
            <span className="btn-dot" aria-hidden />
          </button>
        </form>

        <p style={{ marginTop: 32, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--stone)", textAlign: "center" }}>
          <a href="/">← Retour au site</a>
        </p>
      </div>
    </div>
  );
}
