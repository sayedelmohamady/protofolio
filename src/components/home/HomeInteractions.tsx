"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function HomeInteractions({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.getElementById("home-root");
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

    /* ── Nav hide/show + active section + hero parallax ── */
    let lastScroll = 0;
    const nav = root.querySelector<HTMLElement>("#mainNav");
    const navPill = root.querySelector<HTMLElement>("#navPill");
    const navLinksEl = root.querySelector<HTMLElement>("#navLinks");
    const sectionOrder = ["about", "work", "approach", "experience", "contact"];

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

    function updateHeroParallax() {
      if (!hero || prefersReducedMotion) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const raw = -rect.top * 0.14;
      const clamped = Math.max(-52, Math.min(60, raw));
      hero.style.setProperty("--hero-parallax", String(clamped));
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
      updateHeroParallax();
    }

    const onScroll = () => {
      const curr = window.scrollY;
      if (nav) {
        if (curr > lastScroll && curr > 200) nav.classList.add("hidden");
        else nav.classList.remove("hidden");
      }
      lastScroll = curr;
      updateActiveNav();
      root.querySelectorAll<HTMLElement>(".hero-orb").forEach((orb, i) => {
        const speed = 0.03 + i * 0.015;
        orb.style.setProperty("--orb-scroll", `${window.scrollY * speed}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      const activeLink = root.querySelector(".nav-links a.is-active");
      positionNavPill(activeLink);
    };
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => updateActiveNav());

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

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(glowRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("click", hashClickHandler);
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
    };
  }, []);

  return <div id="home-root">{children}</div>;
}
