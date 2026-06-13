"use client";

import { useEffect, useState } from "react";

type Props = {
  /** URL du widget HelloAsso (…/widget ou …/widget-bouton) */
  src: string;
  /** Hauteur de l'iframe en px (hauteur fixe du bouton, ou hauteur initiale du widget) */
  height?: number;
  /**
   * Ajuste automatiquement la hauteur selon le contenu (widget complet).
   * À laisser à false pour le bouton, qui a une hauteur fixe.
   */
  autoResize?: boolean;
  title?: string;
};

/**
 * Intègre un widget HelloAsso (bouton d'adhésion ou formulaire complet).
 *
 * HelloAsso fournit un <iframe> avec, pour le widget complet, un `onload` inline
 * qui écoute les messages `postMessage` pour ajuster la hauteur. Cet attribut
 * inline ne s'exécute pas en React : on reproduit la logique via useEffect quand
 * `autoResize` est activé, en filtrant l'origine du message pour la sécurité.
 */
export default function HelloAssoWidget({
  src,
  height = 70,
  autoResize = false,
  title = "Adhésion en ligne — HelloAsso",
}: Props) {
  const [h, setH] = useState(height);

  useEffect(() => {
    if (!autoResize) return;
    function onMessage(e: MessageEvent) {
      // On n'accepte que les messages émis par HelloAsso.
      if (typeof e.origin === "string" && !e.origin.includes("helloasso.com")) return;
      const data = e.data as { height?: number } | undefined;
      const next = typeof data?.height === "number" ? data.height : NaN;
      // Le widget ne fait que grandir (jamais rétrécir) pour éviter les sauts.
      if (Number.isFinite(next) && next > 0) setH((prev) => (next > prev ? next : prev));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [autoResize]);

  return (
    <iframe
      src={src}
      title={title}
      allow="payment"
      loading="lazy"
      style={{ width: "100%", height: h, border: "none", display: "block", background: "transparent" }}
    />
  );
}
