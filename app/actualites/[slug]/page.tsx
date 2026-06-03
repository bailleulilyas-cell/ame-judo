import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getActualiteBySlug } from "@/lib/data";
import { renderArticleBody } from "@/lib/markdown";

const SITE_URL = "https://ame-judo.fr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const actu = await getActualiteBySlug(slug);
  if (!actu) return { title: "Actualité introuvable" };
  const ogImg = actu.photo_url
    ? [{ url: actu.photo_url, alt: actu.titre }]
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: actu.titre }];
  return {
    title: actu.titre,
    description: actu.extrait,
    alternates: { canonical: `/actualites/${slug}` },
    openGraph: {
      type: "article",
      title: actu.titre,
      description: actu.extrait,
      url: `${SITE_URL}/actualites/${slug}`,
      publishedTime: actu.date_publication,
      modifiedTime: actu.updated_at || actu.date_publication,
      images: ogImg,
    },
    twitter: {
      card: "summary_large_image",
      title: actu.titre,
      description: actu.extrait,
      images: ogImg.map((i) => i.url),
    },
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

  const html = renderArticleBody(actu.body_html, actu.body);

  // JSON-LD Article + BreadcrumbList
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: actu.titre,
    description: actu.extrait,
    datePublished: actu.date_publication,
    dateModified: actu.updated_at || actu.date_publication,
    image: actu.photo_url ? [actu.photo_url] : [`${SITE_URL}/opengraph-image`],
    author: { "@type": "Organization", name: "AME-JUDO — Arts Martiaux Ermontois" },
    publisher: { "@type": "Organization", name: "AME-JUDO", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/actualites/${slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Actualités", item: `${SITE_URL}/actualites` },
      { "@type": "ListItem", position: 3, name: actu.titre, item: `${SITE_URL}/actualites/${slug}` },
    ],
  };

  return (
    <>
      <Nav />
      <main id="main">
        <article className="container article">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span className="breadcrumb-sep" aria-hidden>·</span>
            <Link href="/actualites">Actualités</Link>
            <span className="breadcrumb-sep" aria-hidden>·</span>
            <span className="breadcrumb-current" aria-current="page">{actu.titre}</span>
          </nav>

          <div className="article-kanji" lang="ja" aria-hidden>{actu.kanji}</div>

          <div className="article-meta">
            <span className="actu-cat-dot" aria-hidden />
            <span>{actu.categorie}</span>
            <span>·</span>
            <time dateTime={actu.date_publication}>{dateStr}</time>
          </div>

          <h1 className="article-title">{actu.titre}</h1>

          {actu.extrait && <p className="article-lead">{actu.extrait}</p>}

          {actu.photo_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className="article-cover" src={actu.photo_url} alt={actu.titre} />
          )}

          <div
            className="article-body markdown-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
