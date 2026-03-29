"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function CaseStudyRevealInit({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ── Dismiss page transition overlay ── */
    const overlay = document.getElementById("pt-overlay");
    if (overlay?.classList.contains("pt-covering")) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add("pt-revealing");
          const onEnd = () => {
            overlay.classList.remove("pt-covering", "pt-revealing");
            overlay.removeEventListener("transitionend", onEnd);
          };
          overlay.addEventListener("transitionend", onEnd);
        });
      });
    }

    /* ── Stagger key children when a section reveals ── */
    const CHILD_SELS = [
      ".section-label",
      "h2",
      ".hero-eyebrow",
      ".hero-dek",
      ".hero-divider",
      ".hero-meta",
      ".kpi-card",
      ".problem-card",
      ".insight-card",
      ".cs-mockup",
      ".badge-row",
      ".role-card",
      ".vibe-split",
      ".design-card",
      ".process-step",
      ".comp-col",
      ".image-pair",
      ".image-trio",
    ].join(", ");

    function staggerChildren(section: HTMLElement) {
      if (prefersReduced) return;
      const items = section.querySelectorAll<HTMLElement>(CHILD_SELS);
      items.forEach((el, i) => {
        if (el.dataset.rvC) return;
        el.dataset.rvC = "1";
        const delay = Math.min(i, 7) * 65; // cap at 455 ms
        el.style.setProperty("--rv-d", `${delay}ms`);
        el.classList.add("rv-child");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => el.classList.add("rv-on"));
        });
      });
    }

    /* ── Section-level reveals ── */
    const reveals = root.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            staggerChildren(e.target as HTMLElement);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" },
    );

    reveals.forEach((el) => {
      obs.observe(el);
    });

    const t = window.setTimeout(() => {
      reveals.forEach((el) => {
        if (!el.classList.contains("visible")) {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            el.classList.add("visible");
            staggerChildren(el);
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
      ".club-tie-intro-video video, .vibe-split__media video, .overview-video-wrap video, video[src^='/videos/']",
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

  /* Persist scroll position across reloads */
  useEffect(() => {
    const key = `scroll-y:${window.location.pathname}`;

    const saved = sessionStorage.getItem(key);
    if (saved) {
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => window.scrollTo(0, y));
    }

    const onBeforeUnload = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
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

  /* Atomic design graph: draw edges between actual node positions */
  useEffect(() => {
    const graph = document.getElementById("adg");
    if (!graph) return;
    const svg = graph.querySelector<SVGSVGElement>(".adg-svg");
    if (!svg) return;

    const EDGES: [string, string, string][] = [
      ["ae1", "an-btn", "an-hdr"],
      ["ae2", "an-avt", "an-hdr"],
      ["ae3", "an-img", "an-med"],
      ["ae4", "an-rwg", "an-ftr"],
      ["ae5", "an-val", "an-ftr"],
      ["ae6", "an-hdr", "an-card"],
      ["ae7", "an-med", "an-card"],
      ["ae8", "an-ftr", "an-card"],
      ["ae9", "an-card", "an-tpl1"],
      ["ae11", "an-list", "an-tpl3"],
      ["ae12", "an-list", "an-tpl4"],
    ];

    function updateEdges() {
      const gr = graph!.getBoundingClientRect();
      svg!.setAttribute("viewBox", `0 0 ${gr.width} ${gr.height}`);

      for (const [edgeId, fromId, toId] of EDGES) {
        const path = document.getElementById(edgeId);
        const fromBox = document.getElementById(fromId)?.querySelector(".adg-node-box");
        const toBox = document.getElementById(toId)?.querySelector(".adg-node-box");
        if (!path || !fromBox || !toBox) continue;

        const fr = fromBox.getBoundingClientRect();
        const tr = toBox.getBoundingClientRect();

        const x1 = fr.left + fr.width / 2 - gr.left;
        const y1 = fr.top - gr.top;
        const x2 = tr.left + tr.width / 2 - gr.left;
        const y2 = tr.bottom - gr.top;

        const cy1 = y1 - (y1 - y2) * 0.35;
        const cy2 = y2 + (y1 - y2) * 0.35;
        path.setAttribute("d", `M ${x1},${y1} C ${x1},${cy1} ${x2},${cy2} ${x2},${y2}`);
      }
    }

    requestAnimationFrame(() => requestAnimationFrame(updateEdges));
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  return <div id="case-study-root">{children}</div>;
}
