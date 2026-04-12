"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ClubRiveAnimationsGrid = dynamic(
  () =>
    import("@/components/case-study/ClubRiveAnimationsGrid").then(
      (mod) => mod.ClubRiveAnimationsGrid,
    ),
  { ssr: false },
);

export function ClubTieCaseStudyBody({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [riveRoot, setRiveRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    el.innerHTML = html;
    const mount = el.querySelector<HTMLElement>("#club-rive-root");
    setRiveRoot(mount);
  }, [html]);

  return (
    <>
      <div ref={hostRef} />
      {riveRoot
        ? createPortal(<ClubRiveAnimationsGrid />, riveRoot)
        : null}
    </>
  );
}
