import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className="container center" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <span
            style={{
              fontFamily: "var(--serif-jp)",
              fontSize: "clamp(120px, 18vw, 220px)",
              color: "var(--sumi)",
              opacity: 0.07,
              lineHeight: 1,
              display: "block",
              marginBottom: -40,
            }}
            lang="ja"
            aria-hidden
          >
            失
          </span>
          <h1 className="title-lg" style={{ marginBottom: 12 }}>
            Cette page s&apos;est <em>perdue</em> en chemin.
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--stone)", marginBottom: 40 }}>
            Erreur 404 — la page que vous cherchez n&apos;existe pas.
          </p>
          <Link href="/" className="btn btn-secondary btn-arrow">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
