"use client";

import { motion } from "framer-motion";
import type { BeyondGridItem, BeyondSectionDefinition } from "@/lib/beyondMedia";
import { SectionReveal } from "./SectionReveal";
import { BeyondImage } from "./BeyondImage";
import { BeyondGamingDisc } from "./BeyondGamingDisc";
import { BeyondVideo } from "./BeyondVideo";

function cellClass(span: BeyondGridItem["span"]) {
  switch (span) {
    case "full":
      return "beyond-grid-cell beyond-grid-cell--full";
    case "wide":
      return "beyond-grid-cell beyond-grid-cell--wide";
    case "tall":
      return "beyond-grid-cell beyond-grid-cell--tall";
    default:
      return "beyond-grid-cell";
  }
}

function isVideo(item: BeyondGridItem) {
  if (item.type === "video") return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(item.src);
}

export function BeyondMediaSection({ def }: { def: BeyondSectionDefinition }) {
  const headingId = `${def.id}-heading`;

  return (
    <section
      id={def.id}
      className={`beyond-media-section beyond-media-section--${def.variant}`}
      aria-labelledby={headingId}
    >
      <div className={`beyond-media-section-bg beyond-media-section-bg--${def.variant}`} />

      <div className="beyond-section-inner">
        <SectionReveal>
          <header className="beyond-media-section-header">
            <p className="beyond-media-section-eyebrow">{def.eyebrow}</p>
            <h2 id={headingId} className="beyond-media-section-title">
              {def.title}
            </h2>
          </header>
        </SectionReveal>

        <div className="beyond-media-grid">
          {def.items.map((item, idx) => (
            <motion.div
              key={`${def.id}-${idx}`}
              className={cellClass(item.span)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.04 }}
            >
              {isVideo(item) ? (
                <BeyondVideo
                  src={item.src}
                  className="beyond-grid-cell-media"
                />
              ) : def.variant === "gaming" ? (
                <BeyondGamingDisc
                  coverSrc={item.src}
                  priority={idx < 16}
                />
              ) : (
                <BeyondImage
                  src={item.src}
                  alt=""
                  className="beyond-grid-cell-media"
                  priority={idx < 18}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
