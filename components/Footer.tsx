import Link from "next/link";
import Image from "next/image";
import SocialIcon from "./SocialIcon";
import { getSocialLinks } from "@/lib/data";
import { SOCIAL_PLATFORMS } from "@/lib/socials";

interface FooterProps {
  adresse?: { ligne1: string; ligne2: string; ligne3: string };
  email?: string;
  permanence?: string;
}

export default async function Footer({
  adresse = {
    ligne1: "Complexe Sportif Saint-Exupéry",
    ligne2: "Rue Kvot et Leydekkers",
    ligne3: "95120 Ermont",
  },
  email = "amejudoermont@gmail.com",
  permanence = "Mercredi 17h–20h30 · Samedi 11h–13h",
}: FooterProps) {
  const socials = await getSocialLinks();
  return (
    <footer className="footer" aria-label="Pied de page">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <div className="footer-brand-row">
              <Image
                src="/logo.png"
                alt="Logo AME-JUDO"
                width={56}
                height={56}
                className="footer-logo"
              />
              <div>
                <div className="footer-brand-text">AME-JUDO</div>
                <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.72)", marginTop: 4 }}>
                  Depuis 1978
                </div>
              </div>
            </div>
            <p className="footer-brand-sub">
              Club de judo à Ermont<br />
              depuis 1978.
            </p>
            <a
              href="https://lerelaisweb.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Site réalisé par Le Relais Web"
              className="footer-credit-inline"
            >
              <Image
                src="/logo-relais-web.png"
                alt="Le Relais Web"
                width={44}
                height={44}
                className="footer-credit-logo"
              />
              <span className="footer-credit-text">
                <span className="footer-credit-label">Réalisé par</span>
                <strong>Le Relais Web</strong>
              </span>
            </a>
          </div>

          <div>
            <p className="footer-col-title">Explorer</p>
            <ul className="footer-col-list">
              <li><Link href="/judo">Le judo</Link></li>
              <li><Link href="/horaires">Horaires</Link></li>
              <li><Link href="/maitres">Maîtres</Link></li>
              <li><Link href="/adhesion">Adhésion</Link></li>
              <li><Link href="/competition">Compétition</Link></li>
              <li><Link href="/actualites">Actualités</Link></li>
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
          <span>© 2026 AME-JUDO — Association loi 1901</span>
          <nav className="footer-legal" aria-label="Liens légaux">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/rgpd">Confidentialité</Link>
            <span lang="ja" aria-hidden style={{ fontFamily: "var(--serif-jp)" }}>
              一礼<span className="footer-mark-red" />
            </span>
          </nav>
        </div>

      </div>
    </footer>
  );
}
