import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JustifiedGallery from "@/components/JustifiedGallery";
import { getGaleriePhotos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galerie — Le club en images",
  description: "Photos du club de judo AME-JUDO à Ermont (95) : cours, stages, compétitions et vie du dojo.",
  alternates: { canonical: "/galerie" },
  openGraph: {
    title: "Galerie — AME-JUDO Ermont",
    description: "Le club de judo AME-JUDO en images : cours, stages, compétitions.",
    url: "/galerie",
  },
};

export default async function GaleriePage() {
  const photos = await getGaleriePhotos();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>写</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">写真 · Galerie</span>
            </div>
            <h1 className="page-hero-title">
              Le club en <em>images</em>.
            </h1>
            <p className="page-hero-sub">
              Cours, stages, compétitions et moments de vie du dojo.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {photos.length === 0 ? (
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--stone)" }}>
                Les photos arrivent bientôt.
              </p>
            ) : (
              <JustifiedGallery items={photos} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
