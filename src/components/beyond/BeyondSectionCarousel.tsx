"use client";

import { useEffect, useRef } from "react";
import type { BeyondGridItem, BeyondSectionDefinition } from "@/lib/beyondMedia";
import { BeyondImage } from "./BeyondImage";

function firstStillSrc(def: BeyondSectionDefinition): string | null {
  for (const it of def.items) {
    if (isVideo(it)) continue;
    return it.src;
  }
  return null;
}

function isVideo(item: BeyondGridItem) {
  if (item.type === "video") return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(item.src);
}

export function BeyondSectionCarousel({
  sections,
}: {
  sections: BeyondSectionDefinition[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onWheel = (e: WheelEvent) => {
      if (mq.matches) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollWidth <= clientWidth + 1) return;

      const deltaY = e.deltaY;
      const deltaX = e.deltaX;
      if (Math.abs(deltaX) >= Math.abs(deltaY)) return;

      const atStart = scrollLeft <= 1;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
      if (deltaY < 0 && atStart) return;
      if (deltaY > 0 && atEnd) return;

      e.preventDefault();
      el.scrollLeft += deltaY * 0.85;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      className="beyond-section-carousel"
      aria-label="Section previews"
    >
      <p className="beyond-section-carousel-hint">Explore</p>
      <div
        ref={wrapRef}
        className="beyond-section-carousel-track-wrap"
        tabIndex={0}
        role="region"
        aria-label="Horizontal previews — use the mouse wheel to scroll sideways"
      >
        <div className="beyond-section-carousel-track">
          {sections.map((def) => {
            const src = firstStillSrc(def);
            return (
              <a
                key={def.id}
                href={`#${def.id}`}
                className={`beyond-section-carousel-slide beyond-section-carousel-slide--${def.variant}`}
                data-cursor-hover
              >
                {src ? (
                  <BeyondImage
                    src={src}
                    alt=""
                    className="beyond-section-carousel-slide-media"
                  />
                ) : (
                  <div
                    className="beyond-section-carousel-slide-fallback"
                    aria-hidden
                  />
                )}
                <div className="beyond-section-carousel-slide-meta">
                  <p className="beyond-section-carousel-slide-eyebrow">
                    {def.eyebrow}
                  </p>
                  <p className="beyond-section-carousel-slide-title">
                    {def.title}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
