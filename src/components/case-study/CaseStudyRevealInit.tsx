"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function CaseStudyRevealInit({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;

    const reveals = root.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "100px 0px -20px 0px" },
    );

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 0.07}s`;
      obs.observe(el);
    });

    const t = window.setTimeout(() => {
      reveals.forEach((el) => {
        if (!el.classList.contains("visible")) {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            el.classList.add("visible");
            obs.unobserve(el);
          }
        }
      });
    }, 400);

    return () => {
      window.clearTimeout(t);
      obs.disconnect();
    };
  }, []);

  /* Club TIE: muted autoplay loops — call play() for Safari / after reveal. */
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;
    const videos = root.querySelectorAll<HTMLVideoElement>(
      ".club-tie-intro-video video, .vibe-split__media video",
    );
    if (videos.length === 0) return;

    const tryPlayAll = () => {
      videos.forEach((v) => {
        void v.play().catch(() => {});
      });
    };
    tryPlayAll();
    videos.forEach((v) => v.addEventListener("loadeddata", tryPlayAll));

    const onVis = () => {
      if (document.visibilityState === "visible") tryPlayAll();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      videos.forEach((v) =>
        v.removeEventListener("loadeddata", tryPlayAll),
      );
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      const sidebarA = t.closest(
        ".sidebar-nav a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (sidebarA && root.contains(sidebarA)) {
        const href = sidebarA.getAttribute("href");
        if (href?.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const y =
              target.getBoundingClientRect().top + window.scrollY - 56 - 24;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
        return;
      }

      const tabBtn = t.closest("[data-case-tab]");
      if (tabBtn && root.contains(tabBtn)) {
        const id = tabBtn.getAttribute("data-case-tab");
        if (id) {
          e.preventDefault();
          root.querySelectorAll(".tab-btn").forEach((b) => {
            b.classList.remove("active");
          });
          root.querySelectorAll(".tab-panel").forEach((p) => {
            p.classList.remove("active");
          });
          tabBtn.classList.add("active");
          root.querySelector(`#tab-${id}`)?.classList.add("active");
        }
        return;
      }

      const foundationTab = t.closest("[data-foundation-tab]");
      if (foundationTab && root.contains(foundationTab)) {
        const key = foundationTab.getAttribute("data-foundation-tab");
        if (key) {
          e.preventDefault();
          const palette = foundationTab.closest(".foundation-palette");
          if (palette) {
            palette.querySelectorAll(".foundation-tab-btn").forEach((b) => {
              b.classList.remove("active");
              b.setAttribute("aria-selected", "false");
            });
            palette.querySelectorAll(".foundation-tab-panel").forEach((p) => {
              p.classList.remove("is-active");
            });
            foundationTab.classList.add("active");
            foundationTab.setAttribute("aria-selected", "true");
            palette.querySelector(`#foundation-sem-${key}`)?.classList.add("is-active");
          }
        }
        return;
      }

      const lotHead = t.closest("#loan-officer-timeline .lot-head");
      if (lotHead && root.contains(lotHead)) {
        const item = lotHead.closest(".lot-item");
        if (item) {
          item.classList.toggle("is-collapsed");
          const open = !item.classList.contains("is-collapsed");
          lotHead.setAttribute("aria-expanded", open ? "true" : "false");
        }
      }
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  /* Scroll spy: reference HTML inlined this script; body extraction drops <script> tags. */
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;

    const sidebarLinks = root.querySelectorAll<HTMLAnchorElement>(
      ".sidebar-nav a[data-section]",
    );
    if (sidebarLinks.length === 0) return;

    const sectionIds: string[] = [];
    sidebarLinks.forEach((link) => {
      const id = link.getAttribute("data-section");
      if (id && id !== "hero-top") sectionIds.push(id);
    });

    function updateActive() {
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
          10,
        ) || 56;
      const scrollY = window.scrollY + navH + 80;
      let currentId = sectionIds[0];

      for (let i = 0; i < sectionIds.length; i++) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          currentId = sectionIds[i];
        }
      }

      if (window.scrollY < 200) {
        sidebarLinks.forEach((l) => l.classList.remove("active"));
        return;
      }

      sidebarLinks.forEach((link) => {
        if (link.getAttribute("data-section") === currentId) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateActive();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div id="case-study-root">{children}</div>;
}
