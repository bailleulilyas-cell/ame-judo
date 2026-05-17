"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/voies", kanji: "道", label: "Voies" },
  { href: "/horaires", kanji: "時", label: "Horaires" },
  { href: "/maitres", kanji: "師", label: "Maîtres" },
  { href: "/adhesion", kanji: "入", label: "Adhésion" },
  { href: "/actualites", kanji: "報", label: "Actualités" },
  { href: "/contact", kanji: "便", label: "Contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;
      if (y > 240 && y > lastY.current) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="nav" ref={navRef} aria-label="Navigation principale">
      <div className="nav-inner">
        <Link href="/" className="nav-brand" aria-label="AME — Accueil">
          <Image
            src="/logo.png"
            alt="Logo AME"
            width={44}
            height={44}
            className="nav-logo"
            priority
          />
          <span className="nav-brand-text">
            <span className="nav-brand-name">AME</span>
            <span className="nav-brand-sub">Arts Martiaux Ermontois</span>
          </span>
        </Link>

        <ul className={`nav-links${open ? " is-open" : ""}`}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link${isActive ? " active" : ""}`}
                >
                  <span className="nav-kanji" aria-hidden>{item.kanji}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/adhesion" className="nav-cta">
          S&apos;inscrire
          <span className="nav-cta-dot" aria-hidden />
        </Link>

        <button
          className={`nav-burger${open ? " is-open" : ""}`}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
