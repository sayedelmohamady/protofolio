"use client";

import { useEffect } from "react";

/**
 * Replaces eager `autoplay` on <video> tags with viewport-gated playback.
 * `caseStudyHtml.ts` rewrites `autoplay` to `data-autoplay` and sets
 * preload="none"; this hook watches for those nodes and calls play()/pause()
 * as they enter/leave the viewport. The browser only fetches the bytes once
 * play() is called, so off-screen videos cost nothing on first load.
 */
export function LazyVideoPlayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observed = new WeakSet<HTMLVideoElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (video.paused) {
              const promise = video.play();
              if (promise && typeof promise.catch === "function") {
                promise.catch(() => {});
              }
            }
          } else {
            if (!video.paused) video.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );

    const attach = (video: HTMLVideoElement) => {
      if (observed.has(video)) return;
      observed.add(video);
      io.observe(video);
    };

    const scan = () => {
      document
        .querySelectorAll<HTMLVideoElement>("video[data-autoplay]")
        .forEach(attach);
    };

    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
