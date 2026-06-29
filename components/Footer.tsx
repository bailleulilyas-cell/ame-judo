import Link from "next/link";
import Image from "next/image";
import SocialIcon from "./SocialIcon";
import { getSocialLinks, getSettings } from "@/lib/data";
import { SOCIAL_PLATFORMS } from "@/lib/socials";
import { club, agency } from "@/club.config";

export default async function Footer() {
  const [socials, s] = await Promise.all([getSocialLinks(), getSettings()]);
  const adresse = { ligne1: s.adresse_ligne1, ligne2: s.adresse_ligne2, ligne3: s.adresse_ligne3 };
  const email = s.email;
  const permanence = s.permanence;
  return (
    <footer className="footer" aria-label="Pied de page">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <div className="footer-brand-row">
              <Image
                src="/logo.png"
                alt={`Logo ${club.name}`}
                width={56}
                height={56}
                className="footer-logo"
              />
              <div>
                <div className="footer-brand-text">{club.name}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.72)", marginTop: 4 }}>
                  Depuis {club.foundingYear}
                </div>
              </div>
            </div>
            <p className="footer-brand-sub">
              Club de {club.sport.toLowerCase()} à {club.city}<br />
              depuis {club.foundingYear}.
            </p>
          </div>

          <div>
            <p className="footer-col-title">Explorer</p>
            <ul className="footer-col-list">
              <li><Link href="/judo">Le judo</Link></li>
              <li><Link href="/horaires">Horaires</Link></li>
              <li><Link href="/maitres">Enseignants</Link></li>
              <li><Link href="/adhesion">Adhésion</Link></li>
              <li><Link href="/competition">Compétition</Link></li>
              <li><Link href="/actualites">Actualités</Link></li>
              <li><Link href="/galerie">Galerie</Link></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Le dojo</p>
            <p>
              {adresse.ligne1}<br />
              {adresse.ligne2}<br />
              {adresse.ligne3}
            </p>
          </div>

          <div>
            <p className="footer-col-title">Contact</p>
            <ul className="footer-col-list">
              <li><a href={`mailto:${email}`}>{email}</a></li>
            </ul>
            <p className="footer-col-title" style={{ marginTop: 24 }}>Permanence</p>
            <p>{permanence}</p>

            {socials.length > 0 && (
              <>
                <p className="footer-col-title" style={{ marginTop: 24 }}>Suivez-nous</p>
                <div className="footer-socials">
                  {socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social"
                      aria-label={SOCIAL_PLATFORMS[s.plateforme].label}
                    >
                      <SocialIcon platform={s.plateforme} size={20} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {club.name} — Association loi 1901</span>
          <nav className="footer-legal" aria-label="Liens légaux">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/rgpd">Confidentialité</Link>
            <span lang="ja" aria-hidden style={{ fontFamily: "var(--serif-jp)" }}>
              一礼<span className="footer-mark-red" />
            </span>
          </nav>
        </div>

        {/* Signature agence — « Réalisé par » + logo distant (ancre = marque seule). */}
        <div className="footer-signature">
          <span className="footer-signature-label">Réalisé par</span>
          <a
            href={agency.url}
            target="_blank"
            rel="noopener"
            className="footer-signature-link"
          >
            {/* logo distant (hors next/image) : alt = nom de marque → ancre du backlink */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={agency.logo}
              alt={agency.name}
              className="footer-signature-logo"
              height={22}
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>

      </div>
    </footer>
  );
}
