"use client";

import {
  Alignment,
  Fit,
  Layout,
  useRive,
} from "@rive-app/react-canvas";
import { useCallback, useEffect, useMemo, useState } from "react";

const RIVE_BASE = "/riv/club-tie";

export const CLUB_RIVE_ANIMATIONS: { file: string; label: string }[] = [
  { file: "arrow-1.riv", label: "Arrow" },
  { file: "club-coin-product-shine.riv", label: "Coin shine" },
  { file: "club-snackbar-x.riv", label: "Snackbar close" },
  { file: "club-spinner.riv", label: "Spinner" },
  { file: "down-arrow-action-2.riv", label: "Down arrow" },
  { file: "mission-collect-views.riv", label: "Collect views" },
  { file: "mission-in-review.riv", label: "In review" },
  { file: "mission-locked-blocks.riv", label: "Locked blocks" },
  { file: "mission-sheet-completed-alt.riv", label: "Sheet completed (alt)" },
  { file: "mission-sheet-completed.riv", label: "Sheet completed" },
  { file: "mission-sheet-dc.riv", label: "Sheet DC" },
  { file: "mission-sheet-redo-alt.riv", label: "Sheet redo (alt)" },
  { file: "mission-sheet-redo.riv", label: "Sheet redo" },
  { file: "mission-sheet-x-alt.riv", label: "Sheet dismiss (alt)" },
  { file: "mission-sheet-x.riv", label: "Sheet dismiss" },
  { file: "redo.riv", label: "Redo" },
];

function ClubRiveHoverTile({
  src,
  label,
  reducedMotion,
}: {
  src: string;
  label: string;
  reducedMotion: boolean;
}) {
  const layout = useMemo(
    () =>
      new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    [],
  );

  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src,
      autoplay: false,
      layout,
    },
    { shouldResizeCanvasToContainer: true },
  );

  const play = useCallback(() => {
    if (reducedMotion) return;
    rive?.play();
  }, [rive, reducedMotion]);

  const pause = useCallback(() => {
    rive?.pause();
  }, [rive]);

  useEffect(() => {
    if (reducedMotion) rive?.pause();
  }, [rive, reducedMotion]);

  return (
    <figure
      className="club-gfx-tile club-gfx-tile--rive"
      role="listitem"
      aria-label={label}
      tabIndex={0}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      <div className="club-gfx-tile__media" ref={setContainerRef}>
        <RiveComponent
          aria-hidden
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <div className="club-gfx-tile__overlay" aria-hidden="true">
          <span className="club-gfx-tile__name">{label}</span>
        </div>
      </div>
    </figure>
  );
}

export function ClubRiveAnimationsGrid() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {CLUB_RIVE_ANIMATIONS.map(({ file, label }) => (
        <ClubRiveHoverTile
          key={file}
          src={`${RIVE_BASE}/${file}`}
          label={label}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}
