"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import "@/styles/case-study-section-nav-chrome.css";

function ensureSidebarNavChrome(sidebar: HTMLElement) {
  if (sidebar.dataset.sectionNavChrome === "1") return;
  const nav = sidebar.querySelector("ul.sidebar-nav");
  if (!nav?.parentNode) return;

  sidebar.dataset.sectionNavChrome = "1";

  const inner = document.createElement("div");
  inner.className = "sidebar-nav-inner";
  const glider = document.createElement("div");
  glider.className = "sidebar-nav-glider";
  glider.setAttribute("aria-hidden", "true");

  nav.parentNode.insertBefore(inner, nav);
  inner.appendChild(glider);
  inner.appendChild(nav);

  const progress = document.createElement("div");
  progress.className = "sidebar-nav-progress";
  progress.setAttribute("aria-hidden", "true");
  const fill = document.createElement("div");
  fill.className = "sidebar-nav-progress-fill";
  progress.appendChild(fill);
  sidebar.appendChild(progress);
}

function updateSidebarNavChrome(
  sidebar: HTMLElement,
  activeLink: HTMLAnchorElement | null,
  activeIndex: number,
  totalSections: number,
  atTop: boolean,
) {
  const inner = sidebar.querySelector<HTMLElement>(".sidebar-nav-inner");
  const glider = sidebar.querySelector<HTMLElement>(".sidebar-nav-glider");
  const fill = sidebar.querySelector<HTMLElement>(".sidebar-nav-progress-fill");
  if (!inner || !glider || !fill) return;

  if (atTop || !activeLink) {
    glider.classList.remove("is-visible");
    fill.style.width = "0%";
    return;
  }

  glider.classList.add("is-visible");
  const ir = inner.getBoundingClientRect();
  const lr = activeLink.getBoundingClientRect();
  const left = lr.left - ir.left + inner.scrollLeft;
  const width = lr.width;
  glider.style.left = `${Math.max(0, left)}px`;
  glider.style.width = `${Math.max(0, width)}px`;

  const pct =
    totalSections > 0 ? ((activeIndex + 1) / totalSections) * 100 : 0;
  fill.style.width = `${pct}%`;
}

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
      "h3",
      ".challenge-lead > p",
      ".principles-dek",
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
      ".lead",
      ".section-lead",
      "blockquote",
      ".club-tie-intro-video",
      ".overview-video-wrap",
    ].join(", ");

    function staggerChildren(section: HTMLElement) {
      if (prefersReduced) return;
      const items = section.querySelectorAll<HTMLElement>(CHILD_SELS);
      items.forEach((el, i) => {
        if (el.dataset.rvC) return;
        el.dataset.rvC = "1";
        const delay = Math.min(i, 12) * 72; // cap ~864 ms, smoother cascade
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
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" },
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

  /* Product-flow sticky headers: shrink index + title while scrolling stacked screens */
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;
    const scope = root.querySelector<HTMLElement>(
      ".case-study-club, .case-study-gatherup",
    );
    if (!scope) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const flows = Array.from(
      scope.querySelectorAll<HTMLElement>(
        ".pf-flow:has(> .ss-strip.ss-strip--stack)",
      ),
    );
    if (flows.length === 0) return;

    type FlowCompact = { target: number; current: number };
    const compactByFlow = new Map<HTMLElement, FlowCompact>();
    for (const flow of flows) {
      compactByFlow.set(flow, { target: 0, current: 0 });
    }

    /** Ease-out while ramping compact so shrink feels smooth, not linear. */
    function easeOutCubic(t: number) {
      const x = Math.min(1, Math.max(0, t));
      return 1 - (1 - x) ** 3;
    }

    let scrollRaf = 0;
    let smoothRaf = 0;

    const measureCompactRange = (flow: HTMLElement) => {
      const strip = flow.querySelector<HTMLElement>(
        ":scope > .ss-strip.ss-strip--stack",
      );
      const h = strip?.offsetHeight ?? 400;
      return Math.min(Math.max(200, Math.round(h * 0.16)), 340);
    };

    const applyTargets = () => {
      scrollRaf = 0;

      for (const flow of flows) {
        const header = flow.querySelector<HTMLElement>(
          ":scope > .wrap.pf-header",
        );
        const strip = flow.querySelector<HTMLElement>(
          ":scope > .ss-strip.ss-strip--stack",
        );
        if (!header || !strip) continue;

        /*
         * Start compacting only once the vertical stack scrolls up into the
         * pinned header (strip top crosses the header’s bottom edge), not when
         * the header first becomes sticky.
         */
        const headway =
          header.getBoundingClientRect().bottom -
          strip.getBoundingClientRect().top;
        const rangePx = reduced ? 1 : measureCompactRange(flow);
        const raw = headway / rangePx;
        const linear = reduced ? 0 : Math.min(1, Math.max(0, raw));
        const p = easeOutCubic(linear);
        const st = compactByFlow.get(flow);
        if (st) st.target = p;
      }
      ensureSmoothLoop();
    };

    const SMOOTH = 0.22;

    const smoothStep = () => {
      let moving = false;
      for (const flow of flows) {
        const st = compactByFlow.get(flow);
        if (!st) continue;
        const d = st.target - st.current;
        if (Math.abs(d) > 0.002) {
          st.current += d * SMOOTH;
          moving = true;
        } else {
          st.current = st.target;
        }
        flow.style.setProperty("--pf-compact", st.current.toFixed(4));
      }
      smoothRaf = moving ? requestAnimationFrame(smoothStep) : 0;
    };

    function ensureSmoothLoop() {
      if (!smoothRaf) {
        smoothRaf = requestAnimationFrame(smoothStep);
      }
    }

    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(applyTargets);
    };

    applyTargets();
    ensureSmoothLoop();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (smoothRaf) cancelAnimationFrame(smoothRaf);
      for (const flow of flows) {
        flow.style.removeProperty("--pf-compact");
      }
      compactByFlow.clear();
    };
  }, []);

  /* Hero parallax — any case study with `.hero` (CSS hero entrance keeps transform free at scroll 0) */
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const hero = root.querySelector<HTMLElement>(".hero");
    if (!hero) return;

    const headerEls = hero.querySelectorAll<HTMLElement>(
      ".hero-brand, .hero-title, .hero-dek",
    );
    const visualEls = hero.querySelectorAll<HTMLElement>(
      ".hero-mockup, .hero-screens, .hero-meta, .hero-divider",
    );
    if (headerEls.length === 0) return;

    const headerFactor = 0.14;
    const visualFactor = 0.38;
    const scrollCap = () =>
      Math.min(window.scrollY, window.innerHeight * 1.35);

    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = scrollCap();
      const tyHeader = y * headerFactor;
      const tyVisual = y * visualFactor;
      if (tyHeader < 0.5 && tyVisual < 0.5) {
        headerEls.forEach((el) => el.style.removeProperty("transform"));
        visualEls.forEach((el) => el.style.removeProperty("transform"));
        return;
      }
      headerEls.forEach((el) => {
        el.style.transform = `translate3d(0, ${tyHeader}px, 0)`;
      });
      visualEls.forEach((el) => {
        el.style.transform = `translate3d(0, ${tyVisual}px, 0)`;
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      headerEls.forEach((el) => el.style.removeProperty("transform"));
      visualEls.forEach((el) => el.style.removeProperty("transform"));
    };
  }, []);

  /* Muted autoplay loops — call play() for Safari / after reveal.
   * Skip data-hover-play (GatherUp cards); LazyVideoPlayer owns those. */
  useEffect(() => {
    const root = document.getElementById("case-study-root");
    if (!root) return;
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>(
        ".club-tie-intro-video video, .vibe-split__media video, .overview-video-wrap video, video[data-autoplay]",
      ),
    ).filter((v) => !v.hasAttribute("data-hover-play"));
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
              target.getBoundingClientRect().top + window.scrollY - 56 - 48 - 16;
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

      const archLayer = t.closest(".arch-layer");
      if (archLayer && root.contains(archLayer)) {
        const isActive = archLayer.classList.contains("active");
        root.querySelectorAll(".arch-layer").forEach((l) => l.classList.remove("active"));
        if (!isActive) archLayer.classList.add("active");
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

      const flowToggle = t.closest("[data-flow-expand]") as HTMLElement | null;
      if (flowToggle && root.contains(flowToggle)) {
        const cardId = flowToggle.getAttribute("data-flow-expand");
        const card = cardId ? root.querySelector(`#${cardId}`) : null;
        if (card) {
          const isExpanded = card.classList.toggle("is-expanded");
          flowToggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
          const label = flowToggle.querySelector(".flow-map-card__toggle-label");
          if (label) {
            const collapsedText = flowToggle.dataset.flowLabel ?? "View full flow";
            label.textContent = isExpanded ? "Collapse" : collapsedText;
          }
          // Trigger SVG redraw after the transition settles
          setTimeout(() => window.dispatchEvent(new Event("resize")), 650);
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

    const sidebar = sidebarLinks[0]?.closest(".sidebar") as HTMLElement | null;
    if (sidebar) ensureSidebarNavChrome(sidebar);

    const inner = sidebar?.querySelector<HTMLElement>(".sidebar-nav-inner");
    if (inner && !inner.dataset.scrollSync) {
      inner.dataset.scrollSync = "1";
    }

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
      const sectionNavH = sidebar
        ? parseInt(
            getComputedStyle(sidebar).getPropertyValue("--section-nav-h"),
            10,
          ) || 50
        : 50;
      const scrollY = window.scrollY + navH + sectionNavH + 40;
      let currentId = sectionIds[0];

      for (let i = 0; i < sectionIds.length; i++) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          currentId = sectionIds[i];
        }
      }

      const atTop = window.scrollY < 200;

      if (atTop) {
        sidebarLinks.forEach((l) => l.classList.remove("active"));
        if (sidebar) {
          updateSidebarNavChrome(sidebar, null, -1, sectionIds.length, true);
        }
        return;
      }

      let activeLink: HTMLAnchorElement | null = null;
      sidebarLinks.forEach((link) => {
        if (link.getAttribute("data-section") === currentId) {
          link.classList.add("active");
          activeLink = link;
        } else {
          link.classList.remove("active");
        }
      });

      if (sidebar) {
        const idx = sectionIds.indexOf(currentId);
        updateSidebarNavChrome(
          sidebar,
          activeLink,
          idx,
          sectionIds.length,
          false,
        );
      }
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
    inner?.addEventListener("scroll", onScroll, { passive: true });
    updateActive();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      inner?.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Button component explorer */
  useEffect(() => {
    const previewEl = document.getElementById("btn-preview") as HTMLElement | null;
    if (!previewEl) return;
    const preview = previewEl;

    const state = { variant: "primary", size: "md", bstate: "" };
    const VARIANTS = ["bp-primary","bp-secondary","bp-subtle","bp-hls","bp-hll"];
    const SIZES    = ["bp-xs","bp-sm","bp-md","bp-lg"];
    const BSTATES  = ["bps-interact","bps-pressed","bps-focused","bps-disabled","bps-loading"];

    function applyState() {
      VARIANTS.forEach(c => preview.classList.remove(c));
      SIZES.forEach(c => preview.classList.remove(c));
      BSTATES.forEach(c => preview.classList.remove(c));
      preview.classList.add("bp-" + state.variant);
      preview.classList.add("bp-" + state.size);
      if (state.bstate) preview.classList.add(state.bstate);
    }

    const chips = Array.from(document.querySelectorAll<HTMLButtonElement>(".btn-chip"));
    const handlers: Array<() => void> = [];
    chips.forEach((btn) => {
      const handler = () => {
        const prop = btn.dataset.prop;
        const val  = btn.dataset.val ?? "";
        if (!prop) return;
        chips.filter(b => b.dataset.prop === prop).forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        if (prop === "variant") state.variant = val;
        if (prop === "size")    state.size    = val;
        if (prop === "state")   state.bstate  = val;
        applyState();
      };
      btn.addEventListener("click", handler);
      handlers.push(handler);
    });

    applyState();

    return () => {
      chips.forEach((btn, i) => btn.removeEventListener("click", handlers[i]));
    };
  }, []);

  /* ── Interactive User Flow diagram ── */
  useEffect(() => {
    const section = document.getElementById("user-flow");
    if (!section) return;
    const wrap = document.getElementById("uf-wrap") as HTMLElement | null;
    const svgEl = document.getElementById("uf-svg") as SVGSVGElement | null;
    if (!wrap || !svgEl) return;

    let autoTimer: ReturnType<typeof setInterval> | null = null;
    let initialized = false;

    const MAIN_ORDER = [
      "enter-app", "access-club", "member-check",
      "dashboard", "discover", "select-mission",
      "act", "submit-proof", "validation",
      "earn", "progress", "return",
    ];

    interface UfEdge {
      from: string; to: string;
      type: "straight" | "branch" | "merge" | "loop" | "link";
      label?: string; labelCls?: string;
    }
    const EDGES: UfEdge[] = [
      // ── main flow ──
      { from: "enter-app",      to: "access-club",    type: "straight" },
      { from: "access-club",    to: "member-check",   type: "straight" },
      { from: "member-check",   to: "join-club",      type: "branch",   label: "No",  labelCls: "branch" },
      { from: "member-check",   to: "dashboard",      type: "straight", label: "Yes", labelCls: "yes" },
      { from: "join-club",      to: "dashboard",      type: "merge" },
      { from: "dashboard",      to: "discover",       type: "straight" },
      { from: "discover",       to: "select-mission", type: "straight" },
      { from: "select-mission", to: "act",            type: "straight" },
      { from: "act",            to: "submit-proof",   type: "straight" },
      { from: "submit-proof",   to: "validation",     type: "straight" },
      { from: "validation",     to: "edit-resubmit",  type: "branch",   label: "No",  labelCls: "branch" },
      { from: "validation",     to: "earn",           type: "straight", label: "Yes", labelCls: "yes" },
      { from: "edit-resubmit",  to: "earn",           type: "merge" },
      { from: "earn",           to: "progress",       type: "straight" },
      { from: "progress",       to: "return",         type: "straight" },
      { from: "return",         to: "discover",       type: "loop" },
      // ── onboarding flow ──
      { from: "browse",         to: "details",        type: "link" },
      { from: "details",        to: "join-onb",       type: "link" },
      { from: "join-onb",       to: "overview-onb",   type: "link" },
      { from: "overview-onb",   to: "dashboard",      type: "link" },
      // ── re-engagement flow ──
      { from: "inactive",       to: "notified",       type: "link" },
      { from: "notified",       to: "opens-app",      type: "link" },
      { from: "opens-app",      to: "discover",       type: "link" },
      // ── drop-off flow ──
      { from: "paused",         to: "reminder-drop",  type: "link" },
      { from: "reminder-drop",  to: "resume-drop",    type: "link" },
      { from: "resume-drop",    to: "act",            type: "link" },
      // ── profile flow ──
      { from: "dashboard",      to: "stats",          type: "link" },
      { from: "stats",          to: "achievements",   type: "link" },
      { from: "achievements",   to: "edit-profile",   type: "link" },
      // ── reward flow ──
      { from: "earn",           to: "view-reward",    type: "link" },
      { from: "view-reward",    to: "redeem",         type: "link" },
      { from: "redeem",         to: "confirm-rwd",    type: "link" },
      // ── progress flow ──
      { from: "progress",       to: "gain-pts",       type: "link" },
      { from: "gain-pts",       to: "level-up",       type: "link" },
      { from: "level-up",       to: "unlock",         type: "link" },
    ];

    function getR(id: string) {
      const el = wrap!.querySelector(`[data-uf-id="${id}"]`) as HTMLElement | null;
      if (!el) return null;
      const er = el.getBoundingClientRect();
      const wr = wrap!.getBoundingClientRect();
      return {
        top:    er.top    - wr.top,
        bottom: er.bottom - wr.top,
        left:   er.left   - wr.left,
        right:  er.right  - wr.left,
        cx: er.left + er.width  / 2 - wr.left,
        cy: er.top  + er.height / 2 - wr.top,
      };
    }

    function ns(tag: string) {
      return document.createElementNS("http://www.w3.org/2000/svg", tag);
    }

    function mkArrow(id: string, color: string): SVGMarkerElement {
      const m = ns("marker") as SVGMarkerElement;
      m.setAttribute("id", id);
      m.setAttribute("markerWidth", "7"); m.setAttribute("markerHeight", "7");
      m.setAttribute("refX", "5"); m.setAttribute("refY", "3.5");
      m.setAttribute("orient", "auto");
      const p = ns("polygon") as SVGPolygonElement;
      p.setAttribute("points", "0 1, 6 3.5, 0 6");
      p.setAttribute("fill", color);
      m.appendChild(p);
      return m;
    }

    function drawSVG() {
      const wr = wrap!.getBoundingClientRect();
      svgEl!.setAttribute("viewBox", `0 0 ${wr.width} ${wr.height}`);
      svgEl!.style.width  = wr.width  + "px";
      svgEl!.style.height = wr.height + "px";
      svgEl!.innerHTML = "";

      const defs = ns("defs");
      defs.appendChild(mkArrow("ufa-main",   "rgba(150,103,247,0.55)"));
      defs.appendChild(mkArrow("ufa-branch", "rgba(245,158,11,0.65)"));
      defs.appendChild(mkArrow("ufa-loop",   "rgba(34,211,238,0.7)"));
      defs.appendChild(mkArrow("ufa-side",   "rgba(255,255,255,0.2)"));
      svgEl!.appendChild(defs);

      for (const edge of EDGES) {
        const fr = getR(edge.from);
        const tr = getR(edge.to);
        if (!fr || !tr) continue;

        let d = "";
        let edgeCls = "uf-edge ";
        let markerId = "ufa-main";
        let labelPos: { x: number; y: number } | null = null;

        if (edge.type === "straight") {
          const x = fr.cx;
          const y1 = fr.bottom + 2;
          const y2 = tr.top   - 2;
          const mid = (y1 + y2) / 2;
          d = `M ${x},${y1} C ${x},${mid} ${x},${mid} ${x},${y2}`;
          edgeCls += "uf-edge-main";
          if (edge.label) labelPos = { x: x + 10, y: (y1 + y2) / 2 };
        } else if (edge.type === "branch") {
          // decision (col2) left-center → branch node (col1) right-center
          const x1 = fr.left  - 2;  const y1 = fr.cy;
          const x2 = tr.right + 2;  const y2 = tr.cy;
          const cx1 = x1 - 36; const cx2 = x2 + 20;
          d = `M ${x1},${y1} C ${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
          edgeCls += "uf-edge-branch"; markerId = "ufa-branch";
          if (edge.label) labelPos = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 10 };
        } else if (edge.type === "merge") {
          // branch node (col1) right-center → main node (col2) left-center (same row)
          const x1 = fr.right + 2; const y1 = fr.cy;
          const x2 = tr.left  - 2; const y2 = tr.cy;
          const mx = (x1 + x2) / 2;
          d = `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`;
          edgeCls += "uf-edge-branch"; markerId = "ufa-branch";
        } else if (edge.type === "loop") {
          // Route loop arc to the LEFT of the main flow (avoids col-4 nodes)
          const sx = fr.left - 2; const sy = fr.cy;
          const ex = tr.left - 2; const ey = tr.cy;
          const lx = 10; // fixed left anchor in SVG coords (within wrap padding)
          d = `M ${sx},${sy} C ${lx},${sy} ${lx},${ey} ${ex},${ey}`;
          edgeCls += "uf-edge-loop"; markerId = "ufa-loop";
        } else if (edge.type === "link") {
          // Auto-direction: horizontal if nodes are in different columns, vertical if same
          const dxAbs = Math.abs(tr.cx - fr.cx);
          if (dxAbs > 60) {
            // Cross-column connection
            let sx2: number, sy2: number, ex2: number, ey2: number;
            if (tr.left > fr.right + 10) {
              sx2 = fr.right + 1; sy2 = fr.cy;
              ex2 = tr.left  - 1; ey2 = tr.cy;
            } else {
              sx2 = fr.left  - 1; sy2 = fr.cy;
              ex2 = tr.right + 1; ey2 = tr.cy;
            }
            const mx2 = (sx2 + ex2) / 2;
            d = `M ${sx2},${sy2} C ${mx2},${sy2} ${mx2},${ey2} ${ex2},${ey2}`;
          } else {
            // Same-column (vertical) connection
            const x2 = fr.cx;
            const y12 = fr.bottom + 1; const y22 = tr.top - 1;
            const mid2 = (y12 + y22) / 2;
            d = `M ${x2},${y12} C ${x2},${mid2} ${x2},${mid2} ${x2},${y22}`;
          }
          edgeCls += "uf-edge-side"; markerId = "ufa-side";
        }
        if (!d) continue;

        const path = ns("path") as SVGPathElement;
        path.setAttribute("d", d);
        path.setAttribute("class", edgeCls);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        if (edge.type === "branch" || edge.type === "merge") {
          path.setAttribute("stroke-dasharray", "5 4");
        } else if (edge.type === "loop") {
          path.setAttribute("stroke-dasharray", "6 5");
        } else if (edge.type === "link") {
          const dxAbsCheck = Math.abs(tr.cx - fr.cx);
          if (dxAbsCheck > 60) path.setAttribute("stroke-dasharray", "3 3");
        }
        path.setAttribute("marker-end", `url(#${markerId})`);
        svgEl!.appendChild(path);

        // Animate draw with stroke-dashoffset
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        path.dataset.ufLen = String(len);
        path.dataset.ufDash = edge.type === "branch" || edge.type === "merge" ? "5 4"
                            : edge.type === "loop" ? "6 5"
                            : edge.type === "link" && Math.abs(tr.cx - fr.cx) > 60 ? "3 3"
                            : "";

        if (labelPos && edge.label) {
          const t = ns("text") as SVGTextElement;
          t.setAttribute("x", String(labelPos.x));
          t.setAttribute("y", String(labelPos.y));
          t.setAttribute("class", `uf-edge-label${edge.labelCls ? ` uf-edge-label--${edge.labelCls}` : ""}`);
          t.textContent = edge.label;
          svgEl!.appendChild(t);
        }
      }

      // Position loop label (left side arc)
      const retR = getR("return");
      const disR = getR("discover");
      const loopLbl = document.getElementById("uf-loop-label");
      if (retR && disR && loopLbl) {
        const my = (retR.cy + disR.cy) / 2;
        loopLbl.style.left  = "2px";
        loopLbl.style.top   = my + "px";
        loopLbl.style.transform = "translateY(-50%) rotate(-90deg)";
        loopLbl.style.transformOrigin = "center center";
      }
    }

    function animatePaths(delay = 120) {
      if (!svgEl) return;
      svgEl.querySelectorAll<SVGPathElement>("[data-uf-len]").forEach((path, i) => {
        const len = parseFloat(path.dataset.ufLen || "0");
        path.style.strokeDashoffset = String(len);
        path.style.transition = "";
        setTimeout(() => {
          path.style.transition = `stroke-dashoffset 0.55s cubic-bezier(0.22,1,0.36,1)`;
          path.style.strokeDashoffset = "0";
          setTimeout(() => {
            const dash = path.dataset.ufDash || "";
            path.style.transition = "";
            path.style.strokeDasharray = dash || "none";
            path.style.strokeDashoffset = "";
          }, 560);
        }, delay + i * 70);
      });
      setTimeout(() => {
        document.getElementById("uf-loop-label")?.classList.add("uf-label-on");
      }, delay + EDGES.length * 70 + 400);
    }

    function revealNodes() {
      const items = wrap!.querySelectorAll<HTMLElement>(".uf-node, .uf-decision");
      items.forEach((el, i) => {
        el.style.transition =
          `opacity 0.4s ease ${i * 50}ms, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("uf-visible")));
      });
    }

    function setActive(id: string) {
      wrap!.querySelectorAll(".uf-node, .uf-decision").forEach(el => el.classList.remove("uf-active"));
      wrap!.querySelector(`[data-uf-id="${id}"]`)?.classList.add("uf-active");
    }

    function startAuto() {
      let i = 0;
      setActive(MAIN_ORDER[0]);
      autoTimer = setInterval(() => {
        i = (i + 1) % MAIN_ORDER.length;
        setActive(MAIN_ORDER[i]);
      }, 750);
    }

    function init() {
      if (initialized) return;
      initialized = true;
      drawSVG();
      revealNodes();
      animatePaths(80);
      setTimeout(startAuto, 900);
    }

    // Watch for the section reveal
    const mo = new MutationObserver(() => {
      if (section.classList.contains("visible")) {
        mo.disconnect();
        setTimeout(init, 120);
      }
    });
    mo.observe(section, { attributes: true, attributeFilter: ["class"] });
    if (section.classList.contains("visible")) { mo.disconnect(); setTimeout(init, 120); }

    // Pause on hover, resume on leave
    const onEnter = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };
    const onLeave = () => { if (!autoTimer && initialized) startAuto(); };
    const onClick = (e: Event) => {
      const node = (e.target as HTMLElement).closest("[data-uf-id]") as HTMLElement | null;
      if (!node) return;
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      const id = node.getAttribute("data-uf-id");
      if (id) setActive(id);
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("click", onClick);

    // Redraw on resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (initialized) drawSVG(); }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mo.disconnect();
      if (autoTimer) clearInterval(autoTimer);
      clearTimeout(resizeTimer);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
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

  /* ── Hero Carousel (CSS 3D virtual-scroll) ── */
  useEffect(() => {
    const source = document.getElementById("hero-carousel");
    if (!source) return;

    const section = source.closest<HTMLElement>(".hc-section");
    if (!section) return;
    if (section.classList.contains("hc-section--hidden")) return;

    const stage = section.querySelector<HTMLElement>(".hc-stage");
    const placeholder = section.querySelector<HTMLElement>(".hc-placeholder");
    const dotsOuter = section.querySelector<HTMLElement>(".hc-dots-outer");
    const sourceCards = Array.from(
      source.querySelectorAll<HTMLElement>("[data-hc-card]"),
    );
    if (!stage || sourceCards.length < 2) return;

    const cardCount = sourceCards.length;
    const VIRTUAL = cardCount * 100;
    const CENTER = 3; // center slot in the 7-slot keyframe table

    // 7-slot keyframe table: [far-L-off, L2, L1, center, R1, R2, far-R-off]
    const KFS = [
      { tx: -800, sc: 0.55, ry: 28, op: 0, z: 5 },
      { tx: -600, sc: 0.68, ry: 22, op: 0.5, z: 10 },
      { tx: -440, sc: 0.82, ry: 14, op: 1, z: 20 },
      { tx: 0, sc: 1.0, ry: 0, op: 1, z: 30 },
      { tx: 440, sc: 0.82, ry: -14, op: 1, z: 20 },
      { tx: 600, sc: 0.68, ry: -22, op: 0.5, z: 10 },
      { tx: 800, sc: 0.55, ry: -28, op: 0, z: 5 },
    ] as const;

    function lerpKF(slotF: number) {
      const lo = Math.max(0, Math.min(KFS.length - 2, Math.floor(slotF)));
      const hi = lo + 1;
      const t = slotF - lo;
      const a = KFS[lo],
        b = KFS[hi];
      return {
        tx: a.tx + (b.tx - a.tx) * t,
        sc: a.sc + (b.sc - a.sc) * t,
        ry: a.ry + (b.ry - a.ry) * t,
        op: a.op + (b.op - a.op) * t,
        z: Math.round(a.z + (b.z - a.z) * t),
      };
    }

    function getCfg() {
      const w = window.innerWidth;
      // 16:9 landscape cards
      if (w >= 1024) return { cw: 400, ch: 225, persp: 1400 };
      if (w >= 640) return { cw: 320, ch: 180, persp: 1100 };
      return { cw: 240, ch: 135, persp: 900 };
    }

    // ── Build DOM ──
    const wrap = document.createElement("div");
    wrap.className = "hc-wrap";
    wrap.setAttribute("tabindex", "0");

    const perspEl = document.createElement("div");
    perspEl.className = "hc-perspective";

    const visual = document.createElement("div");
    visual.className = "hc-visual";

    const scrollEl = document.createElement("div");
    scrollEl.className = "hc-scroll";

    const spacerL = document.createElement("div");
    spacerL.className = "hc-spacer";
    const canvas = document.createElement("div");
    canvas.className = "hc-canvas";
    const spacerR = document.createElement("div");
    spacerR.className = "hc-spacer";

    scrollEl.append(spacerL, canvas, spacerR);
    perspEl.append(visual, scrollEl);
    wrap.append(perspEl);
    stage.append(wrap);

    const cards: HTMLElement[] = [];
    const dotEls: HTMLElement[] = [];

    for (let i = 0; i < cardCount; i++) {
      const card = document.createElement("div");
      card.className = "hc-card";
      const inner = document.createElement("div");
      inner.className = "hc-card-inner";
      inner.appendChild(sourceCards[i].cloneNode(true));
      card.appendChild(inner);
      visual.appendChild(card);
      cards.push(card);

      if (dotsOuter) {
        const dot = document.createElement("button");
        dot.className = "hc-dot";
        dot.setAttribute("aria-label", `Card ${i + 1}`);
        dotsOuter.appendChild(dot);
        dotEls.push(dot);
      }
    }

    let cfg = getCfg();
    let activeReal = Math.floor(cardCount / 2);

    function applyLayout() {
      cfg = getCfg();
      perspEl.style.perspective = cfg.persp + "px";
      const spacerW = Math.floor(stage!.offsetWidth / 2);
      canvas.style.width = VIRTUAL * cfg.cw + "px";
      spacerL.style.width = spacerW + "px";
      spacerR.style.width = spacerW + "px";
      cards.forEach((c) => {
        c.style.width = cfg.cw + "px";
        c.style.height = cfg.ch + "px";
      });
      const virtualCenter = Math.floor(VIRTUAL / 2);
      scrollEl.scrollLeft = (virtualCenter + activeReal) * cfg.cw;
    }

    function updateCards() {
      const offset = scrollEl.scrollLeft;
      const centerFloat = offset / cfg.cw;
      const centerInCards = centerFloat % cardCount;
      const half = cardCount / 2;

      for (let i = 0; i < cardCount; i++) {
        let dist = i - centerInCards;
        // Wrap to [-half, half)
        dist = ((dist % cardCount) + cardCount + half) % cardCount - half;
        const kf = lerpKF(CENTER + dist);
        cards[i].style.transform = `translateX(${kf.tx}px) scale(${kf.sc}) rotateY(${kf.ry}deg)`;
        cards[i].style.opacity = String(kf.op);
        cards[i].style.zIndex = String(kf.z);
      }

      const center = ((Math.round(centerFloat) % cardCount) + cardCount) % cardCount;
      activeReal = center;
      dotEls.forEach((d, i) => {
        d.dataset.active = i === center ? "true" : "false";
      });
    }

    let snapTimer: ReturnType<typeof setTimeout>;

    function onScroll() {
      updateCards();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        const offset = scrollEl.scrollLeft;
        const snapped = Math.round(offset / cfg.cw) * cfg.cw;
        if (Math.abs(offset - snapped) > 1)
          scrollEl.scrollTo({ left: snapped, behavior: "smooth" });
      }, 80);
    }

    scrollEl.addEventListener("scroll", onScroll, { passive: true });

    // Click to center
    visual.addEventListener("click", (e) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".hc-card");
      if (!card) return;
      const idx = cards.indexOf(card);
      if (idx < 0) return;
      const offset = scrollEl.scrollLeft;
      const cv = ((Math.round(offset / cfg.cw) % cardCount) + cardCount) % cardCount;
      let diff = idx - cv;
      const half = cardCount / 2;
      if (diff > half) diff -= cardCount;
      if (diff < -half) diff += cardCount;
      scrollEl.scrollBy({ left: diff * cfg.cw, behavior: "smooth" });
    });

    // Dot clicks
    if (dotsOuter) {
      dotsOuter.addEventListener("click", (e) => {
        const dot = (e.target as HTMLElement).closest<HTMLElement>(".hc-dot");
        if (!dot) return;
        const idx = dotEls.indexOf(dot);
        if (idx < 0) return;
        const offset = scrollEl.scrollLeft;
        const cv = ((Math.round(offset / cfg.cw) % cardCount) + cardCount) % cardCount;
        let diff = idx - cv;
        const half = cardCount / 2;
        if (diff > half) diff -= cardCount;
        if (diff < -half) diff += cardCount;
        scrollEl.scrollBy({ left: diff * cfg.cw, behavior: "smooth" });
      });
    }

    // Keyboard
    wrap.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollEl.scrollBy({ left: -cfg.cw, behavior: "smooth" });
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        scrollEl.scrollBy({ left: cfg.cw, behavior: "smooth" });
        e.preventDefault();
      }
    });

    // Resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        applyLayout();
        updateCards();
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Init
    requestAnimationFrame(() => {
      applyLayout();
      updateCards();
      setTimeout(() => {
        wrap.style.opacity = "1";
        if (placeholder) placeholder.style.opacity = "0";
        setTimeout(() => {
          if (placeholder) placeholder.style.display = "none";
        }, 400);
      }, 250);
    });

    return () => {
      clearTimeout(snapTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <div id="case-study-root">{children}</div>;
}
