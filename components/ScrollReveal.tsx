"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;       // ms
  threshold?: number;   // 0..1
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

/**
 * Révèle son contenu en fondu + translation lorsque l'élément entre dans le viewport.
 * Respecte `prefers-reduced-motion` : aucune animation si l'utilisateur le préfère.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.12,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            observer.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
