import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Le Judo — la voie de la souplesse",
  description:
    "Discipline olympique fondée en 1882 par Jigoro Kano. Au club AME, le judo s'enseigne dans toutes ses dimensions — technique, mental, et corps. Du baby-judo aux adultes confirmés.",
  alternates: { canonical: "/judo" },
  openGraph: {
    title: "Le Judo — au club AME",
    description: "Une discipline. Un cheminement. Une école.",
  },
};

export default function JudoPage() {
  return (
    <>
      <Nav />
      <main id="main">

        {/* ─── HERO ─── */}
        <section className="page-hero judo-hero">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>道</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">柔道 · Le judo</span>
            </div>

            <span className="judo-hero-kanji" lang="ja" aria-hidden>柔</span>

            <h1 className="page-hero-title">
              La voie de la <em>souplesse</em>.
            </h1>
            <p className="page-hero-sub">
              Discipline olympique fondée par Jigoro Kano en 1882, le judo n&apos;est pas
              un simple sport : c&apos;est une école du corps, de la décision, et du respect.
              Au club AME, c&apos;est la seule voie que nous enseignons — et nous le faisons
              dans toute sa profondeur.
            </p>
          </div>
        </section>

        {/* ─── 01 · ORIGINE ─── */}
        <ScrollReveal as="section" className="section section--paper">
          <div className="container judo-grid">
            <div className="judo-grid-aside">
              <div className="section-header">
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">一 · Origine</span>
              </div>
              <div className="judo-bigdate" aria-hidden>1882</div>
              <p className="judo-bigdate-cap">Naissance d&apos;une voie</p>
            </div>

            <div className="judo-grid-body">
              <h2 className="title-md">
                Un héritage <em>moderne</em>,<br />
                des racines <em>anciennes</em>.
              </h2>
              <p className="judo-prose">
                À la fin du XIXᵉ siècle, le jeune <strong>Jigoro Kano</strong> étudie les écoles
                de ju-jitsu traditionnelles, héritières des techniques de combat des samouraïs.
                Il en garde l&apos;efficacité technique et en retire la dangerosité — pour faire
                du combat un outil d&apos;éducation. Le 5 février 1882, dans un petit temple
                d&apos;Eishōji à Tokyo, il fonde son école : le <em>Kodokan</em>, et nomme sa
                pratique <strong>jūdō</strong> — &laquo;&nbsp;la voie de la souplesse&nbsp;&raquo;.
              </p>
              <p className="judo-prose">
                Le judo devient discipline olympique en <strong>1964</strong> aux Jeux de Tokyo.
                Il est aujourd&apos;hui pratiqué par plus de <strong>50 millions</strong> de
                personnes dans le monde — du club de quartier au plus haut niveau international.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 02 · TECHNIQUES ─── */}
        <ScrollReveal as="section" className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>二</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">技 · Trois familles</span>
            </div>

            <h2 className="title-lg" style={{ marginBottom: 16 }}>
              Une grammaire <em>complète</em>.
            </h2>
            <p className="lead">
              Le judo se structure autour de trois grands ensembles techniques —
              chacun enseigné progressivement, du tout petit à l&apos;adulte confirmé.
            </p>

            <div className="judo-tech-grid">
              <article className="judo-tech">
                <span className="judo-tech-kanji" lang="ja" aria-hidden>投</span>
                <p className="judo-tech-romaji">Nage-waza</p>
                <h3 className="judo-tech-name">Les projections debout</h3>
                <p className="judo-tech-text">
                  Hanches, jambes, épaules, sacrifices. Le cœur visible du judo —
                  celui qu&apos;on voit en compétition. <em>Apprendre à projeter, c&apos;est
                  d&apos;abord apprendre à tomber.</em>
                </p>
              </article>

              <article className="judo-tech">
                <span className="judo-tech-kanji" lang="ja" aria-hidden>固</span>
                <p className="judo-tech-romaji">Katame-waza</p>
                <h3 className="judo-tech-name">Le travail au sol</h3>
                <p className="judo-tech-text">
                  Immobilisations, étranglements, clés de bras. Une partie souvent
                  moins spectaculaire mais essentielle — qui demande patience,
                  précision, et sens du déséquilibre.
                </p>
              </article>

              <article className="judo-tech">
                <span className="judo-tech-kanji" lang="ja" aria-hidden>形</span>
                <p className="judo-tech-romaji">Kata</p>
                <h3 className="judo-tech-name">Les formes traditionnelles</h3>
                <p className="judo-tech-text">
                  Séquences codifiées transmises sans changement depuis Kano.
                  Le kata est la mémoire vivante du judo : on y apprend ce qui ne
                  peut pas être pratiqué en combat libre.
                </p>
              </article>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 03 · ESPRIT ─── */}
        <ScrollReveal as="section" className="section section--sand">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>三</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">心 · L&apos;esprit</span>
            </div>

            <h2 className="title-lg" style={{ marginBottom: 16 }}>
              Deux principes,<br />
              une <em>vie entière</em>.
            </h2>
            <p className="lead">
              Au-delà de la technique, Jigoro Kano a transmis deux principes
              fondateurs. Au club, nous y revenons sans cesse — sur le tatami, mais aussi en dehors.
            </p>

            <div className="judo-principles">
              <div className="judo-principle">
                <span className="judo-principle-jp" lang="ja">精力善用</span>
                <p className="judo-principle-romaji">Seiryoku-zen&apos;yō</p>
                <h3 className="judo-principle-fr">
                  &laquo;&nbsp;Le meilleur usage de l&apos;énergie.&nbsp;&raquo;
                </h3>
                <p className="judo-principle-text">
                  Faire avec ce que l&apos;on a, pas contre. La force de l&apos;adversaire
                  devient un appui ; la fatigue, une occasion d&apos;ajuster. Une philosophie
                  qui dépasse largement le tatami.
                </p>
              </div>

              <div className="judo-principle">
                <span className="judo-principle-jp" lang="ja">自他共栄</span>
                <p className="judo-principle-romaji">Jita-kyōei</p>
                <h3 className="judo-principle-fr">
                  &laquo;&nbsp;Prospérité mutuelle.&nbsp;&raquo;
                </h3>
                <p className="judo-principle-text">
                  Je ne progresse que si mon partenaire progresse aussi. L&apos;adversaire
                  n&apos;est pas un ennemi à vaincre — c&apos;est celui qui me permet
                  d&apos;apprendre. On grandit ensemble, ou on ne grandit pas.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 04 · AU CLUB ─── */}
        <ScrollReveal as="section" className="section">
          <div className="container judo-grid">
            <div className="judo-grid-aside">
              <div className="section-header">
                <span className="section-header-rule" aria-hidden />
                <span className="section-header-label">四 · Au dojo</span>
              </div>
              <blockquote className="judo-quote">
                « On entre en saluant.<br />On part en saluant. »
              </blockquote>
              <p className="judo-quote-attr">— Tradition AME</p>
            </div>

            <div className="judo-grid-body">
              <h2 className="title-md">
                Notre <em>pédagogie</em>.
              </h2>
              <p className="judo-prose">
                Au club AME, le judo s&apos;enseigne depuis bientôt cinquante ans dans
                un esprit fidèle à celui de Kano : <strong>rigueur dans le geste,
                bienveillance dans la transmission</strong>. Nos professeurs sont tous
                gradés, formés à la pédagogie de l&apos;enfant comme à celle de
                l&apos;adulte, et engagés dans la vie du club bien au-delà du tatami.
              </p>
              <p className="judo-prose">
                Nous accueillons tous les niveaux — du tout débutant à la ceinture noire,
                de l&apos;élève qui pratique pour le plaisir à celui qui prépare la
                compétition. <em>Personne n&apos;est laissé de côté</em>, et personne
                n&apos;est obligé d&apos;aller plus vite que son rythme.
              </p>
              <p className="judo-prose">
                La compétition existe au club — départementale, régionale — mais elle
                n&apos;est jamais imposée. Ceux qui veulent y aller sont accompagnés ;
                ceux qui préfèrent pratiquer pour eux-mêmes trouvent ici exactement
                la même attention.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 05 · POUR QUI ─── */}
        <ScrollReveal as="section" className="section section--paper">
          <div className="container">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>五</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">人 · Pour qui</span>
            </div>

            <h2 className="title-lg" style={{ marginBottom: 16 }}>
              Une voie ouverte<br />
              à <em>tous les âges</em>.
            </h2>

            <div className="judo-public-grid">
              <div className="judo-public">
                <span className="judo-public-kanji" lang="ja" aria-hidden>幼</span>
                <p className="judo-public-age">4 — 5 ans</p>
                <h3 className="judo-public-name">Éveil Judo</h3>
                <p className="judo-public-text">
                  Découverte du tatami, du salut, et des premières chutes — par le jeu.
                  Motricité, équilibre, plaisir de bouger ensemble.
                </p>
              </div>

              <div className="judo-public">
                <span className="judo-public-kanji" lang="ja" aria-hidden>少</span>
                <p className="judo-public-age">6 — 13 ans</p>
                <h3 className="judo-public-name">Enfants &amp; pré-ados</h3>
                <p className="judo-public-text">
                  Apprentissage progressif des techniques, des règles, et des valeurs.
                  Passage de ceintures, premières confrontations bienveillantes.
                </p>
              </div>

              <div className="judo-public">
                <span className="judo-public-kanji" lang="ja" aria-hidden>大</span>
                <p className="judo-public-age">14 ans et +</p>
                <h3 className="judo-public-name">Ados &amp; adultes</h3>
                <p className="judo-public-text">
                  Pratique complète — technique, mental, condition physique.
                  Débutants bienvenus, anciens judokas accueillis avec joie.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── CTA ─── */}
        <section className="section">
          <div className="container judo-cta">
            <div className="section-header">
              <span className="section-header-dot" aria-hidden />
              <span className="section-header-num" lang="ja" aria-hidden>入</span>
              <span className="section-header-rule" aria-hidden />
              <span className="section-header-label">入門 · Commencer</span>
            </div>
            <h2 className="title-lg">
              Deux séances <em>gratuites</em>,<br />
              pour décider en connaissance.
            </h2>
            <p className="lead">
              Pas de paiement à la pré-inscription. Vous venez essayer, vous voyez si
              ça vous parle, et vous décidez ensuite.
            </p>
            <div className="judo-cta-buttons">
              <Link href="/adhesion" className="btn btn-primary">
                Pré-inscription
                <span className="btn-dot" aria-hidden />
              </Link>
              <Link href="/horaires" className="btn btn-secondary btn-arrow">
                Voir les horaires
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
