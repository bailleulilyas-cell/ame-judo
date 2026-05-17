import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AdhesionForm from "@/components/AdhesionForm";
import { getFormules } from "@/lib/data";

export const metadata: Metadata = {
  title: "Adhésion — Pré-inscription",
  description: "Pré-inscrivez-vous au club AME en quelques instants. Deux séances d'essai gratuites.",
};

export default async function AdhesionPage() {
  const formules = await getFormules();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>四</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">入門 · Adhésion</span>
            </div>
            <h1 className="page-hero-title">
              Pré-<em>inscription</em>.
            </h1>
            <p className="page-hero-sub">
              Choisissez votre formule et remplissez le formulaire — un membre du bureau vous recontactera dans les 48 heures.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <AdhesionForm formules={formules} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
