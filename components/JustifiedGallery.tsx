"use client";

import { useEffect, useRef, useState } from "react";

interface Item {
  id: string;
  url: string;
  legende: string | null;
}

// Passe l'image par l'optimiseur Next (redimensionnement + AVIF/WebP) au lieu
// de servir le fichier d'origine en pleine résolution. Le ratio est préservé,
// donc la mise en page justifiée (calculée via onLoad) reste identique.
// 828 = taille autorisée par défaut (deviceSizes) — large mais bien plus léger.
function optimized(url: string, w = 828, q = 72): string {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}`;
}

/**
 * Galerie « lignes justifiées » (à la Google Photos / Flickr).
 * Lit le ratio réel de chaque image, puis cale chaque ligne pour que toutes
 * les photos d'une ligne aient la même hauteur et remplissent la largeur.
 * → aucun recadrage, aucun trou, s'adapte à n'importe quel format.
 */
export default function JustifiedGallery({
  items,
  fillLastRow = false,
}: {
  items: Item[];
  fillLastRow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const ratios = useRef<Map<string, number>>(new Map());
  const [, bump] = useState(0); // force le recalcul quand un ratio est connu

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gap = 6;
  const target = width < 520 ? 150 : width < 900 ? 190 : 230;

  type Row = { items: Item[]; height: number };
  const rows: Row[] = [];
  if (width > 0) {
    let cur: Item[] = [];
    let arSum = 0;
    items.forEach((it, idx) => {
      const ar = ratios.current.get(it.id) ?? 1.4;
      cur.push(it);
      arSum += ar;
      const naturalWidth = arSum * target + gap * (cur.length - 1);
      const isLast = idx === items.length - 1;
      if (naturalWidth >= width) {
        const h = (width - gap * (cur.length - 1)) / arSum;
        rows.push({ items: cur, height: h });
        cur = [];
        arSum = 0;
      } else if (isLast) {
        const h = fillLastRow ? (width - gap * (cur.length - 1)) / arSum : target;
        rows.push({ items: cur, height: h });
      }
    });
  }

  return (
    <div ref={ref} className="jgal">
      {rows.map((row, i) => (
        <div className="jgal-row" key={i} style={{ height: row.height }}>
          {row.items.map((it) => {
            const ar = ratios.current.get(it.id) ?? 1.4;
            return (
              <figure className="jgal-item" key={it.id} style={{ width: row.height * ar }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimized(it.url)}
                  alt={it.legende ?? "Photo du club AME-JUDO"}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      const r = img.naturalWidth / img.naturalHeight;
                      if (ratios.current.get(it.id) !== r) {
                        ratios.current.set(it.id, r);
                        bump((v) => v + 1);
                      }
                    }
                  }}
                />
                {it.legende && <figcaption className="jgal-caption">{it.legende}</figcaption>}
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}
