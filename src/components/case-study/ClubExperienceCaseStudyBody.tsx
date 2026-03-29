"use client";

import { useLayoutEffect, useRef } from "react";

export function ClubExperienceCaseStudyBody({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    el.innerHTML = html;
  }, [html]);

  return <div ref={hostRef} />;
}
