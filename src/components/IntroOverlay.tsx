"use client";

import { useEffect, useState } from "react";

/**
 * IntroOverlay — "system initializing" entrance animation.
 *
 * Timing:
 *   0.06s  grid fades in
 *   0.12s  center glow blooms
 *   0.28s  eyebrow rises up
 *   0.40s  name rises up
 *   0.68s  accent divider draws in
 *   0.70s  role fades in
 *   1.05s  overlay starts fading out (0.38s)
 *   1.43s  overlay removed from DOM
 *
 * Plays once per browser session (sessionStorage).
 * Skipped entirely if prefers-reduced-motion is set.
 * pointer-events: none — never blocks interaction.
 */
export function IntroOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Skip if already played this session
    if (sessionStorage.getItem("intro-seen")) return;
    sessionStorage.setItem("intro-seen", "1");

    setShow(true);

    // Remove from DOM after all animations are done
    // overlay finishes fading at 1050 + 380 = 1430ms
    const t = setTimeout(() => setShow(false), 1480);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div className="intro-grid" />
      <div className="intro-glow" />
      <div className="intro-content">
        <div className="intro-eyebrow">
          <span className="intro-eyebrow-dot" />
          Portfolio
        </div>
        <div className="intro-name">Sayed El Mohamady</div>
        <div className="intro-divider" />
        <div className="intro-role">Senior Product Designer</div>
      </div>
    </div>
  );
}
