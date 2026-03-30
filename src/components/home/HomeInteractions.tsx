"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function HomeInteractions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  /* ── Case card page transition ── */
  useEffect(() => {
    const overlay = document.getElementById("pt-overlay");

    const onClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest(
        "a.case-card",
      ) as HTMLAnchorElement | null;
      if (!card) return;
      const href = card.getAttribute("href");
      if (!href || !href.startsWith("/")) return;

      e.preventDefault();
      if (overlay) {
        overlay.classList.remove("pt-revealing");
        void overlay.offsetHeight; // force reflow to reset transition
        overlay.classList.add("pt-covering");
      }
      window.setTimeout(() => {
        routerRef.current.push(href);
      }, 420);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const root = document.getElementById("home-root");
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ── Dismiss overlay when arriving from a case study ── */
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

    /* ── Cursor glow ── */
    const glow = root.querySelector<HTMLElement>("#cursorGlow");
    const hero = root.querySelector<HTMLElement>(".hero");
    let glowX = 0,
      glowY = 0,
      curX = 0,
      curY = 0;
    let glowRaf: number;

    const onMouseMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        if (mx >= 0 && mx <= 100 && my >= 0 && my <= 100) {
          hero.style.setProperty("--mx", `${mx}%`);
          hero.style.setProperty("--my", `${my}%`);
        }
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    function updateGlow() {
      glowX += (curX - glowX) * 0.06;
      glowY += (curY - glowY) * 0.06;
      if (glow) {
        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";
      }
      glowRaf = requestAnimationFrame(updateGlow);
    }
    glowRaf = requestAnimationFrame(updateGlow);

    /* ── Smooth scroll helper ── */
    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }
    function smoothScrollToY(targetY: number, duration = 680) {
      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
        return;
      }
      const start = window.scrollY;
      const dist = targetY - start;
      const t0 = performance.now();
      function step(now: number) {
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo(0, start + dist * easeOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    /* ── Smooth layered parallax — RAF loop with lerp ── */
    const heroInner = root.querySelector<HTMLElement>(".hero-inner");
    const heroOrbs = root.querySelectorAll<HTMLElement>(".hero-orb");
    // Per-orb parallax multipliers (bg → mid → accent orb)
    const ORB_SPEEDS = [0.16, 0.26, 0.10] as const;

    let rawScrollY = window.scrollY;
    let smoothScrollY = rawScrollY;
    let parallaxRaf: number;

    // Mobile: reduce intensity to avoid motion sickness on small screens
    let isMobile = window.matchMedia("(max-width: 768px)").matches;
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const onMQChange = (e: MediaQueryListEvent) => { isMobile = e.matches; };
    mqMobile.addEventListener("change", onMQChange);

    function runParallax() {
      rawScrollY = window.scrollY;
      // Lerp toward raw scroll — 0.072 ≈ ~14-frame ease-out feel
      smoothScrollY += (rawScrollY - smoothScrollY) * 0.072;

      if (!prefersReducedMotion && hero) {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > -50) {
          const intensity = isMobile ? 0.35 : 1.0;
          const py = smoothScrollY * intensity;

          // Layer 1 – Background (gradient mesh + grid): slowest drift downward
          hero.style.setProperty("--px-bg", `${py * 0.13}px`);

          // Layer 2 – Orbs (midground): each at its own speed for depth
          heroOrbs.forEach((orb, i) => {
            const speed = (ORB_SPEEDS[i] ?? 0.16) * intensity;
            orb.style.setProperty("--px-orb", `${py * speed}px`);
          });

          // Layer 3 – Foreground content: counter-parallax lift + fade/scale out
          if (heroInner) {
            const heroH = hero.offsetHeight;
            // Fade begins at 80px scroll; fully faded at ~55% of hero height
            const fadeStart = 80;
            const fadeEnd = heroH * 0.55;
            const fadeProgress = Math.min(
              Math.max((smoothScrollY - fadeStart) / (fadeEnd - fadeStart), 0),
              1,
            );
            // Smooth the progress with an ease-out curve
            const easedFade = 1 - Math.pow(1 - fadeProgress, 2);

            const fgY = py * -0.065;          // gentle upward counter-drift
            const driftY = easedFade * 28 * intensity; // accelerates as it fades
            const opacity = 1 - easedFade * 0.42;
            const scaleOut = 1 - easedFade * 0.038;

            heroInner.style.transform = `translate3d(0, ${fgY + driftY}px, 0) scale(${scaleOut})`;
            heroInner.style.opacity = String(Math.max(0.55, opacity));
          }
        }
      }

      parallaxRaf = requestAnimationFrame(runParallax);
    }
    parallaxRaf = requestAnimationFrame(runParallax);

    /* ── Nav hide/show + active section ── */
    let lastScroll = 0;
    const nav = root.querySelector<HTMLElement>("#mainNav");
    const navPill = root.querySelector<HTMLElement>("#navPill");
    const navLinksEl = root.querySelector<HTMLElement>("#navLinks");
    const sectionOrder = [
      "work",
      "articles",
      "about",
      "experience",
      "contact",
    ];

    function positionNavPill(link: Element | null) {
      if (!navPill || !navLinksEl || !link) {
        if (navPill) navPill.style.opacity = "0";
        return;
      }
      const ur = navLinksEl.getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      navPill.style.opacity = "1";
      navPill.style.width = `${lr.width}px`;
      navPill.style.left = `${lr.left - ur.left}px`;
    }

    const expStepperList = root.querySelector<HTMLElement>(
      "#experience .experience-stepper-list",
    );

    function updateExperienceSpine() {
      if (!expStepperList) return;
      if (prefersReducedMotion) {
        expStepperList.style.setProperty("--exp-spine-progress", "1");
        return;
      }
      const rect = expStepperList.getBoundingClientRect();
      const vh = window.innerHeight;
      const y = window.scrollY;
      const listTopDoc = rect.top + y;
      const listH = rect.height;
      const anchor = y + vh * 0.42;
      const start = listTopDoc + listH * 0.04;
      const end = listTopDoc + listH * 0.96;
      const span = Math.max(120, end - start);
      let p = (anchor - start) / span;
      p = Math.max(0, Math.min(1, p));
      expStepperList.style.setProperty("--exp-spine-progress", String(p));
    }

    function updateActiveNav() {
      if (!root) return;
      const navH = (nav ? nav.offsetHeight : 64) + 28;
      let activeId: string | null = null;
      for (const id of sectionOrder) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= navH) activeId = id;
      }
      root.querySelectorAll(".nav-links a[data-section]").forEach((a) => {
        const ds = (a as HTMLElement).dataset.section;
        a.classList.toggle("is-active", activeId !== null && ds === activeId);
      });
      const activeLink = activeId
        ? root.querySelector(`.nav-links a[data-section="${activeId}"]`)
        : null;
      positionNavPill(activeLink);
    }

    const onScroll = () => {
      const curr = window.scrollY;
      if (nav) {
        if (curr > lastScroll && curr > 200) nav.classList.add("hidden");
        else nav.classList.remove("hidden");
      }
      lastScroll = curr;
      updateActiveNav();
      updateExperienceSpine();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      const activeLink = root.querySelector(".nav-links a.is-active");
      positionNavPill(activeLink);
      updateExperienceSpine();
    };
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => {
      updateActiveNav();
      updateExperienceSpine();
    });

    /* ── Scroll reveals ── */
    const rvObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = Number(
              (e.target as HTMLElement).dataset.revealDelay || 0,
            );
            window.setTimeout(() => e.target.classList.add("visible"), delay);
            rvObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    root.querySelectorAll(".rv").forEach((el) => rvObs.observe(el));

    /* ── Staggered case card reveal ── */
    root.querySelectorAll<HTMLElement>(".case-card").forEach((card, idx) => {
      card.dataset.revealDelay = String(100 * idx);
    });

    /* ── Case study filter (All / Digital product / Design system) ── */
    const filterBar = root.querySelector<HTMLElement>("#casesFilter");

    function applyCaseFilter(filter: string) {
      if (!root) return;
      const wraps = root.querySelectorAll<HTMLElement>(
        ".case-card-sticky-wrap[data-case-type]",
      );
      wraps.forEach((wrap) => {
        const type = wrap.dataset.caseType;
        const show = filter === "all" || type === filter;
        wrap.classList.toggle("case-filter-hidden", !show);
      });
      if (filter === "all") {
        wraps.forEach((wrap) => {
          const bz = wrap.dataset.baseZ;
          if (bz) wrap.style.setProperty("--card-z", bz);
        });
      } else {
        let z = 1;
        wraps.forEach((wrap) => {
          if (wrap.classList.contains("case-filter-hidden")) return;
          wrap.style.setProperty("--card-z", String(z));
          z += 1;
        });
      }
      const clubVideo = root.querySelector<HTMLVideoElement>(
        ".case-card--club-tie .case-card-thumb-video",
      );
      const clubWrap = root.querySelector<HTMLElement>(
        ".case-card--club-tie",
      )?.closest<HTMLElement>(".case-card-sticky-wrap");
      if (clubVideo && clubWrap) {
        if (clubWrap.classList.contains("case-filter-hidden")) {
          void clubVideo.pause();
        } else if (!prefersReducedMotion) {
          void clubVideo.play().catch(() => {});
        }
      }
    }

    const onFilterClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest(
        "button[data-filter]",
      ) as HTMLButtonElement | null;
      if (!btn || !filterBar?.contains(btn)) return;
      const filter = btn.dataset.filter ?? "all";
      applyCaseFilter(filter);
      filterBar.querySelectorAll("button[data-filter]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
    };

    filterBar?.addEventListener("click", onFilterClick);

    const clubCardVideo = root.querySelector<HTMLVideoElement>(
      ".case-card--club-tie .case-card-thumb-video",
    );
    let clubVideoIo: IntersectionObserver | null = null;
    let clubVideoOnVis: (() => void) | null = null;
    let clubVideoOnLoaded: (() => void) | null = null;
    if (clubCardVideo) {
      clubCardVideo.removeAttribute("poster");
      if (prefersReducedMotion) {
        clubCardVideo.removeAttribute("autoplay");
        void clubCardVideo.pause();
      } else {
        const tryPlay = () => {
          void clubCardVideo.play().catch(() => {});
        };
        clubVideoOnLoaded = tryPlay;
        const clubCard = clubCardVideo.closest<HTMLElement>(".case-card");
        tryPlay();
        clubCardVideo.addEventListener("loadeddata", tryPlay);
        clubVideoIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              if (clubCardVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
                clubCardVideo.load();
              }
              tryPlay();
            });
          },
          { threshold: 0.06, rootMargin: "80px 0px" },
        );
        if (clubCard) clubVideoIo.observe(clubCard);
        clubVideoOnVis = () => {
          if (document.visibilityState === "visible") tryPlay();
        };
        document.addEventListener("visibilitychange", clubVideoOnVis);
      }
    }

    /* ── About skills toggle ── */
    const aboutSkillsExpand = root.querySelector<HTMLElement>(
      "#aboutSkillsExpand",
    );
    const aboutSkillsToggle = root.querySelector<HTMLElement>(
      "#aboutSkillsToggle",
    );
    if (aboutSkillsExpand && aboutSkillsToggle) {
      const toggleLabel = aboutSkillsToggle.querySelector(
        ".about-skills-toggle-text",
      );
      aboutSkillsToggle.addEventListener("click", () => {
        const open = aboutSkillsExpand.classList.toggle("is-open");
        aboutSkillsToggle.setAttribute(
          "aria-expanded",
          open ? "true" : "false",
        );
        if (toggleLabel)
          toggleLabel.textContent = open
            ? "Show fewer skills"
            : "Show all skills";
      });
    }

    /* ── Hero showcase tilt + spotlight ── */
    const heroShowcaseShell = root.querySelector<HTMLElement>(
      ".hero-showcase-shell",
    );
    let heroShowcaseHandlers: {
      move: (e: MouseEvent) => void;
      leave: () => void;
    } | null = null;
    if (heroShowcaseShell && !prefersReducedMotion) {
      const move = (e: MouseEvent) => {
        const rect = heroShowcaseShell.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return;

        heroShowcaseShell.style.setProperty(
          "--hero-tilt-x",
          `${(x - 0.5) * 10}deg`,
        );
        heroShowcaseShell.style.setProperty(
          "--hero-tilt-y",
          `${(0.5 - y) * 10}deg`,
        );
        heroShowcaseShell.style.setProperty(
          "--hero-shift-x",
          `${(x - 0.5) * 18}px`,
        );
        heroShowcaseShell.style.setProperty(
          "--hero-shift-y",
          `${(y - 0.5) * 18}px`,
        );
        heroShowcaseShell.style.setProperty("--hero-glow-x", `${x * 100}%`);
        heroShowcaseShell.style.setProperty("--hero-glow-y", `${y * 100}%`);
      };
      const leave = () => {
        heroShowcaseShell.style.removeProperty("--hero-tilt-x");
        heroShowcaseShell.style.removeProperty("--hero-tilt-y");
        heroShowcaseShell.style.removeProperty("--hero-shift-x");
        heroShowcaseShell.style.removeProperty("--hero-shift-y");
        heroShowcaseShell.style.removeProperty("--hero-glow-x");
        heroShowcaseShell.style.removeProperty("--hero-glow-y");
      };
      heroShowcaseShell.addEventListener("mousemove", move);
      heroShowcaseShell.addEventListener("mouseleave", leave);
      heroShowcaseHandlers = { move, leave };
    }

    /* ── Magnetic buttons ── */
    const magnetics = root.querySelectorAll<HTMLElement>(".magnetic");
    const magneticHandlers: Array<{
      el: HTMLElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];
    magnetics.forEach((el) => {
      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      };
      const leave = () => {
        el.style.transform = "";
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      magneticHandlers.push({ el, move, leave });
    });

    /* ── Hash links smooth scroll ── */
    const hashClickHandler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a || !root.contains(a)) return;
      const href = a.getAttribute("href");
      if (!href || href === "#" || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = (nav ? nav.offsetHeight : 64) + 10;
      const y = target.getBoundingClientRect().top + window.scrollY - navH;
      smoothScrollToY(y);
    };
    root.addEventListener("click", hashClickHandler);

    /* ── Tilt + parallax on case study cards ── */
    const cards = root.querySelectorAll<HTMLElement>(".case-card");
    const cardHandlers: Array<{
      card: HTMLElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];
    cards.forEach((card) => {
      const visual = card.querySelector<HTMLElement>(".case-card-visual");
      const content = card.querySelector<HTMLElement>(".case-card-content");
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--card-mx", `${mx}%`);
        card.style.setProperty("--card-my", `${my}%`);
        card.style.setProperty("--deco-x", `${x * 12}px`);
        card.style.setProperty("--deco-y", `${y * -10}px`);
        card.style.transform = `translateY(-5px) perspective(1000px) rotateX(${y * -2.5}deg) rotateY(${x * 2.5}deg) scale(1.004)`;
        if (visual)
          visual.style.transform = `translate3d(${x * -6}px, ${y * -4}px, 0)`;
        if (content)
          content.style.transform = `translate3d(${x * 4}px, ${y * 2}px, 0)`;
      };
      const leave = () => {
        card.style.transform = "";
        card.style.setProperty("--deco-x", "0px");
        card.style.setProperty("--deco-y", "0px");
        if (visual) visual.style.transform = "";
        if (content) content.style.transform = "";
      };
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      cardHandlers.push({ card, move, leave });
    });

    /* ── Pressable click feedback ── */
    const pressables = root.querySelectorAll<HTMLElement>(".pressable");
    const pressHandlers: Array<{
      el: HTMLElement;
      down: () => void;
      clear: () => void;
    }> = [];
    pressables.forEach((el) => {
      const down = () => el.classList.add("is-pressed");
      const clear = () => el.classList.remove("is-pressed");
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointerup", clear);
      el.addEventListener("pointerleave", clear);
      el.addEventListener("blur", clear);
      pressHandlers.push({ el, down, clear });
    });

    /* ── Articles rail: vertical wheel → horizontal scroll + arrow keys ── */
    const articlesRail = root.querySelector<HTMLElement>("#articlesRail");
    const onArticlesWheel = (e: WheelEvent) => {
      if (!articlesRail) return;
      if (!articlesRail.contains(e.target as Node)) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const maxScroll = articlesRail.scrollWidth - articlesRail.clientWidth;
      if (maxScroll <= 2) return;
      const { scrollLeft } = articlesRail;
      const atStart = scrollLeft <= 2;
      const atEnd = scrollLeft >= maxScroll - 2;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      articlesRail.scrollLeft += e.deltaY;
    };
    const onArticlesKeyDown = (e: KeyboardEvent) => {
      if (!articlesRail || e.target !== articlesRail) return;
      const step = Math.min(360, articlesRail.clientWidth * 0.85);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        articlesRail.scrollBy({
          left: -step,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        articlesRail.scrollBy({
          left: step,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    };
    articlesRail?.addEventListener("wheel", onArticlesWheel, { passive: false });
    articlesRail?.addEventListener("keydown", onArticlesKeyDown);

    return () => {
      cancelAnimationFrame(parallaxRaf);
      mqMobile.removeEventListener("change", onMQChange);
      if (heroShowcaseShell && heroShowcaseHandlers) {
        heroShowcaseShell.removeEventListener(
          "mousemove",
          heroShowcaseHandlers.move,
        );
        heroShowcaseShell.removeEventListener(
          "mouseleave",
          heroShowcaseHandlers.leave,
        );
        heroShowcaseHandlers.leave();
      }
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(glowRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("click", hashClickHandler);
      filterBar?.removeEventListener("click", onFilterClick);
      rvObs.disconnect();
      clubVideoIo?.disconnect();
      if (clubVideoOnVis) {
        document.removeEventListener("visibilitychange", clubVideoOnVis);
      }
      if (clubCardVideo && clubVideoOnLoaded) {
        clubCardVideo.removeEventListener("loadeddata", clubVideoOnLoaded);
      }
      magneticHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
      cardHandlers.forEach(({ card, move, leave }) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
      pressHandlers.forEach(({ el, down, clear }) => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointerup", clear);
        el.removeEventListener("pointerleave", clear);
        el.removeEventListener("blur", clear);
      });
      articlesRail?.removeEventListener("wheel", onArticlesWheel);
      articlesRail?.removeEventListener("keydown", onArticlesKeyDown);
    };
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

  return <div id="home-root">{children}</div>;
}
