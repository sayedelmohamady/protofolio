"use client";

import { useEffect, useRef } from "react";

/** Elements that expand / highlight the cursor ring */
const HOVER_SELECTOR = [
  "a[href]",
  "button",
  '[role="button"]',
  'input:not([type="hidden"]):not([type="range"])',
  "textarea",
  "select",
  "summary",
  "label[for]",
  ".pressable",
  "[data-cursor-hover]",
].join(", ");

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mx = useRef(-100);
  const my = useRef(-100);
  const rx = useRef(-100);
  const ry = useRef(-100);
  const dx = useRef(-100);
  const dy = useRef(-100);
  const hoverRef = useRef(false);
  const clickRef = useRef(false);
  const visibleRef = useRef(false);
  const ringScale = useRef(1);
  const dotScale = useRef(1);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      visibleRef.current = true;
      const t = e.target as Element | null;
      hoverRef.current = !!t?.closest(HOVER_SELECTOR);
    };

    const onDown = () => {
      clickRef.current = true;
    };
    const onUp = () => {
      clickRef.current = false;
    };

    const tick = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      const root = rootRef.current;
      if (!ring || !dot || !root) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      rx.current = lerp(rx.current, mx.current, 0.16);
      ry.current = lerp(ry.current, my.current, 0.16);
      dx.current = lerp(dx.current, mx.current, 0.52);
      dy.current = lerp(dy.current, my.current, 0.52);

      let targetRing = 1;
      let targetDot = 1;
      if (clickRef.current) {
        targetRing = hoverRef.current ? 1.38 : 0.88;
        targetDot = 0.55;
      } else if (hoverRef.current) {
        targetRing = 1.62;
        targetDot = 0.22;
      }
      ringScale.current = lerp(ringScale.current, targetRing, 0.14);
      dotScale.current = lerp(dotScale.current, targetDot, 0.2);

      ring.style.transform = `translate3d(${rx.current}px, ${ry.current}px, 0) translate(-50%, -50%) scale(${ringScale.current})`;
      dot.style.transform = `translate3d(${dx.current}px, ${dy.current}px, 0) translate(-50%, -50%) scale(${dotScale.current})`;

      root.classList.toggle("is-hover", hoverRef.current);
      root.classList.toggle("is-clicking", clickRef.current);
      root.classList.toggle("is-visible", visibleRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      html.classList.remove("has-custom-cursor");
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div ref={rootRef} className="custom-cursor-root" aria-hidden>
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}
