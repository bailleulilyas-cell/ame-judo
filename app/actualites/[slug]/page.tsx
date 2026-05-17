import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getActualiteBySlug } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const actu = await getActualiteBySlug(slug);
  if (!actu) return { title: "Actualité introuvable" };
  return {
    title: actu.titre,
    description: actu.extrait,
    openGraph: actu.photo_url ? { images: [actu.photo_url] } : undefined,
  };
}

export default async function ActualiteDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actu = await getActualiteBySlug(slug);
  if (!actu) notFound();

  const dateStr = new Date(actu.date_publication).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = renderMarkdown(actu.body);

  return (
    <>
      <Nav />
      <main id="main">
        <article className="container article">
          <Link href="/actualites" className="article-back">
            ← Toutes les actualités
          </Link>

          <div className="article-kanji" lang="ja" aria-hidden>{actu.kanji}</div>

          <div className="article-meta">
            <span className="actu-cat-dot" aria-hidden />
            <span>{actu.categorie}</span>
            <span>·</span>
            <span>{dateStr}</span>
          </div>

          <h1 className="article-title">{actu.titre}</h1>

          {actu.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={actu.photo_url}
              alt={actu.titre}
              style={{
                width: "100%",
                maxHeight: 480,
                objectFit: "cover",
                marginBottom: 40,
                background: "var(--paper)",
              }}
            />
          )}

          <div
            className="article-body markdown-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <Footer />

      <style>{`
        .markdown-body h2 {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(24px, 3vw, 36px);
          letter-spacing: -0.02em;
          margin: 40px 0 16px;
        }
        .markdown-body h3 {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(20px, 2.2vw, 26px);
          margin: 32px 0 12px;
        }
        .markdown-body img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 24px 0;
        }
        .markdown-body a {
          color: var(--red);
          border-bottom: 1px solid currentColor;
        }
        .markdown-body blockquote {
          border-left: 3px solid var(--red);
          margin: 24px 0;
          padding: 8px 20px;
          font-style: italic;
          color: var(--sumi-soft);
        }
        .markdown-body ul, .markdown-body ol {
          margin: 0 0 24px 24px;
          padding: 0;
        }
        .markdown-body li {
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.75;
          margin: 6px 0;
        }
        .markdown-body hr {
          border: none;
          border-top: 1px solid var(--hair-color);
          margin: 40px 0;
        }
        .markdown-body strong { font-weight: 600; }
      `}</style>
    </>
  );
}
