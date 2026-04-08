"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

const sections = [
  { id: "beyond-hero", label: "Hero" },
  { id: "beyond-plants", label: "Plants" },
  { id: "beyond-gaming", label: "Gaming" },
  { id: "beyond-movement", label: "Film & TV" },
  { id: "beyond-history", label: "History" },
  { id: "beyond-music", label: "Music" },
];

export function BeyondNav() {
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("beyond-hero");
  const lastScroll = useRef(0);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setHidden(y > lastScroll.current && y > 200);
    lastScroll.current = y;

    let current = "beyond-hero";
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= 120) {
        current = s.id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <nav className={`beyond-nav${hidden ? " is-hidden" : ""}`}>
        <Link href="/" className="beyond-nav-name">
          <span className="green-dot" />
          Sayed El Mohamady
        </Link>
        <Link href="/" className="beyond-nav-back">
          &larr; Back to Portfolio
        </Link>
      </nav>

      <div className="beyond-section-dots" aria-label="Section navigation">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`beyond-section-dot${activeSection === s.id ? " is-active" : ""}`}
            onClick={() => scrollTo(s.id)}
            aria-label={s.label}
            title={s.label}
          />
        ))}
      </div>
    </>
  );
}
