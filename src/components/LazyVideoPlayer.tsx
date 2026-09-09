"use client";

import { useEffect } from "react";

/**
 * Replaces eager `autoplay` on <video> tags with viewport-gated playback.
 * `caseStudyHtml.ts` rewrites `autoplay` to `data-autoplay` and sets
 * preload="none"; this hook watches for those nodes and calls play()/pause()
 * as they enter/leave the viewport. The browser only fetches the bytes once
 * play() is called, so off-screen videos cost nothing on first load.
 *
 * Videos with `data-hover-play` play only while the parent card is hovered
 * (or focused on touch via click/focus).
 */
export function LazyVideoPlayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observed = new WeakSet<HTMLVideoElement>();
    const hoverBound = new WeakSet<HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (video.hasAttribute("data-hover-play")) continue;
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

    const attachAutoplay = (video: HTMLVideoElement) => {
      if (observed.has(video)) return;
      observed.add(video);
      io.observe(video);
    };

    const attachHoverPlay = (video: HTMLVideoElement) => {
      const card =
        video.closest<HTMLElement>(".gu-showcase-card") ||
        video.closest<HTMLElement>("[data-hover-card]") ||
        video.parentElement;
      if (!card || hoverBound.has(card)) return;
      hoverBound.add(card);

      const videosInCard = () =>
        Array.from(
          card.querySelectorAll<HTMLVideoElement>("video[data-hover-play]"),
        );

      const play = () => {
        card.classList.add("is-playing");
        for (const v of videosInCard()) {
          const promise = v.play();
          if (promise && typeof promise.catch === "function") {
            promise.catch(() => {});
          }
        }
      };
      const pause = () => {
        card.classList.remove("is-playing");
        for (const v of videosInCard()) {
          if (!v.paused) v.pause();
        }
      };

      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", pause);
      card.addEventListener("focusin", play);
      card.addEventListener("focusout", (e) => {
        if (!card.contains((e as FocusEvent).relatedTarget as Node | null)) {
          pause();
        }
      });

      // Touch: tap card to toggle
      card.addEventListener(
        "click",
        () => {
          if (window.matchMedia("(hover: hover)").matches) return;
          const anyPlaying = videosInCard().some((v) => !v.paused);
          if (anyPlaying) pause();
          else play();
        },
        { passive: true },
      );
    };

    const scan = () => {
      document
        .querySelectorAll<HTMLVideoElement>("video[data-autoplay]")
        .forEach(attachAutoplay);
      document
        .querySelectorAll<HTMLVideoElement>("video[data-hover-play]")
        .forEach(attachHoverPlay);
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
