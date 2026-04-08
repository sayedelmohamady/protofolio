"use client";

import { BeyondImage } from "./BeyondImage";

/** Bundled asset (original: postimg vinyl; see `reference/third-party/spinning-cd-license.txt`). */
const VINYL_SRC = "/images/beyond/gaming/vinyl.png";

export function BeyondGamingDisc({
  coverSrc,
  priority,
}: {
  coverSrc: string;
  priority?: boolean;
}) {
  return (
    <div className="beyond-grid-cell-media beyond-gaming-disc">
      <img
        className="beyond-gaming-disc__vinyl"
        src={VINYL_SRC}
        alt=""
        width={320}
        height={320}
        decoding="async"
      />
      <BeyondImage
        src={coverSrc}
        alt=""
        className="beyond-gaming-disc__cover"
        priority={priority}
      />
      <span className="beyond-gaming-disc__play" aria-hidden="true">
        ▶
      </span>
    </div>
  );
}
