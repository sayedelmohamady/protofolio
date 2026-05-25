"use client";

import "@/styles/deck.css";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";

/* ─────────────────────────────────────────────────────────
   /deck — Sayed Elmohamady · Senior Product Designer
   Keyboard-driven, print-ready.
   ───────────────────────────────────────────────────────── */

type Slide = {
  id: string;
  title: string;
  render: () => ReactElement;
};

export default function DeckPage() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const prevIRef = useRef(0);

  const slides = useMemo<Slide[]>(() => SLIDES, []);
  const last = slides.length - 1;

  const go = useCallback(
    (n: number) =>
      setI((cur) => {
        const clamped = Math.max(0, Math.min(last, n));
        if (clamped !== cur) {
          setDir(clamped > cur ? 1 : -1);
          prevIRef.current = cur;
        }
        return clamped;
      }),
    [last],
  );
  const next = useCallback(() => go(i + 1), [go, i]);
  const prev = useCallback(() => go(i - 1), [go, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(last);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, last]);

  const onPrint = () => {
    // Briefly show all slides for print, then trigger print
    document.body.classList.add("deck-printing");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("deck-printing");
    }, 50);
  };

  const progress = ((i + 1) / slides.length) * 100;

  return (
    <div className="deck-page">
      {/* Progress bar */}
      <div className="deck-progress" aria-hidden="true">
        <div className="deck-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Top chrome */}
      <div className="deck-chrome-top">
        <Link href="/" className="deck-mark" aria-label="Back to portfolio">
          <span className="deck-mark-dot" />
          Sayed Elmohamady
        </Link>
        <div className="deck-actions">
          <button
            type="button"
            className="deck-btn"
            onClick={onPrint}
            aria-label="Download as PDF"
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        className={`deck-stage deck-stage--dir-${dir === 1 ? "fwd" : "back"}`}
        role="region"
        aria-label="Presentation"
      >
        {slides.map((s, idx) => {
          const isActive = idx === i;
          const wasActive = idx === prevIRef.current && !isActive;
          const state = isActive ? "is-active" : wasActive ? "is-leaving" : "is-idle";
          return (
            <section
              key={s.id}
              className={`deck-slide slide-${s.id} ${state}`}
              aria-hidden={!isActive}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
            >
              <div className="deck-frame">{s.render()}</div>
            </section>
          );
        })}
      </div>

      {/* Bottom chrome */}
      <div className="deck-chrome-bottom">
        <div className="deck-counter">
          <strong>{String(i + 1).padStart(2, "0")}</strong>
          <span> / {String(slides.length).padStart(2, "0")}</span>
          <span style={{ marginLeft: 14, color: "var(--deck-fg-mute)" }}>
            {slides[i].title}
          </span>
        </div>
        <div className="deck-nav-arrows">
          <button
            type="button"
            className="deck-arrow"
            onClick={prev}
            disabled={i === 0}
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="deck-arrow"
            onClick={next}
            disabled={i === last}
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SLIDES
   ───────────────────────────────────────────────────────── */

type JourneyEntry = {
  name: string;
  logo: string;
  year: string;
  role: string;
  tag: string;
  active?: boolean;
  wide?: boolean;
};

/* Chronological — left-to-right reads as a timeline */
const JOURNEY: JourneyEntry[] = [
  {
    name: "Awammer",
    logo: "/images/timeline-logos/awammer.png",
    year: "2018",
    role: "UI Designer",
    tag: "Studio",
  },
  {
    name: "Wallet ERP",
    logo: "/images/timeline-logos/wallet-erp.png",
    year: "2018 — 2019",
    role: "Product Designer",
    tag: "ERP",
  },
  {
    name: "Mabaat",
    logo: "/images/timeline-logos/mabaat.png",
    year: "2019 — 2020",
    role: "Lead PD",
    tag: "Hospitality",
  },
  {
    name: "Orcas",
    logo: "/images/timeline-logos/orcas.png",
    year: "2020",
    role: "DS Consultant",
    tag: "EdTech",
  },
  {
    name: "MNT-Halan",
    logo: "/images/timeline-logos/halan.png",
    year: "2020 — 2023",
    role: "Senior PD",
    tag: "Fintech",
  },
  {
    name: "Etar",
    logo: "/images/timeline-logos/etar.svg",
    year: "2023+",
    role: "Founder",
    tag: "System",
  },
  {
    name: "Club (formerly Brandbassador)",
    logo: "/images/timeline-logos/club.png",
    year: "2023 — present",
    role: "DS Lead",
    tag: "Platform",
    active: true,
  },
];

const SLIDES: Slide[] = [
  /* 01 — Cover */
  {
    id: "cover",
    title: "Cover",
    render: () => (
      <>
        <div className="cover-top">
          <div className="deck-eyebrow">Portfolio · 2026</div>
          <div className="cover-stamp">
            <strong>Senior Product Designer</strong>
            Design System Lead
            <br />
            Cairo · Remote-EU
          </div>
        </div>
        <div className="cover-bottom">
          <h1 className="cover-name">
            Sayed
            <br />
            <span className="surname">Elmohamady</span>
          </h1>
          <p className="cover-tagline">
            I design the systems behind the products people use every day.
          </p>
        </div>
      </>
    ),
  },

  /* 02 — Thesis */
  {
    id: "thesis",
    title: "The thesis",
    render: () => (
      <>
        <div className="deck-eyebrow">The thesis</div>
        <h2 className="deck-pullquote">
          Great products don&rsquo;t feel designed.
          <br />
          They feel <em>decided</em>.
          <br />
          Every screen is the answer to a question
          <br />
          someone made the time to ask.
        </h2>
        <p className="deck-lead">
          Eight years across fintech, hospitality, and the creator economy
          have taught me that the leverage in a product isn&rsquo;t in the
          pixels — it&rsquo;s in the clarity of the decisions behind them.
        </p>
      </>
    ),
  },

  /* 03 — Proof bar */
  {
    id: "proof",
    title: "By the numbers",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">By the numbers</div>
          <h2 className="deck-h2">A senior body of work.</h2>
        </div>
        <div className="proof-grid">
          <div className="proof-stat">
            <div className="proof-num">
              8<span className="unit">yrs</span>
            </div>
            <div className="proof-label">
              Designing product at startups &amp; scale-ups across MENA and EU.
            </div>
          </div>
          <div className="proof-stat">
            <div className="proof-num">12</div>
            <div className="proof-label">
              Products shipped across fintech, hospitality, health, and the
              creator economy.
            </div>
          </div>
          <div className="proof-stat">
            <div className="proof-num">
              11<span className="unit">M+</span>
            </div>
            <div className="proof-label">
              End users reached across fintech, hospitality, and the creator
              economy.<sup>†</sup>
            </div>
          </div>
          <div className="proof-stat">
            <div className="proof-num">5</div>
            <div className="proof-label">
              Industries shipped in — fintech, hospitality, health, sports, and
              the creator economy.
            </div>
          </div>
        </div>
        <p className="proof-footnote">
          † Aggregate MAU across Brandbassador, MNT-Halan, and Mabaat at the
          time of work — placeholder to validate.
        </p>
      </>
    ),
  },

  /* 04 — Journey (logos + timeline merged) */
  {
    id: "journey",
    title: "The journey",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">The journey</div>
          <h2 className="deck-h2">
            From shipping screens
            <br />
            to shipping{" "}
            <span style={{ color: "var(--deck-accent)" }}>systems</span>.
          </h2>
        </div>
        <div className="journey-rail">
          <div className="journey-line" aria-hidden="true" />
          <div className="journey-row">
            {JOURNEY.map((entry, idx) => (
              <div
                className={`journey-cell${entry.active ? " is-active" : ""}`}
                key={entry.name}
                style={{ ["--j-delay" as string]: `${idx * 110}ms` }}
              >
                <div
                  className={`journey-logo${entry.wide ? " journey-logo--wide" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="logo-img"
                    src={entry.logo}
                    alt={entry.name}
                    width={entry.wide ? 140 : 64}
                    height={entry.wide ? 40 : 64}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="journey-dot" aria-hidden="true" />
                <div className="journey-year">{entry.year}</div>
                <div className="journey-name">{entry.name}</div>
                <div className="journey-role">{entry.role}</div>
                <div className="journey-tag">{entry.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },

  /* 05 — What I do */
  {
    id: "do",
    title: "What I do",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">What I do</div>
          <h2 className="deck-h2">Three lanes. One craft.</h2>
        </div>
        <div className="do-grid">
          <div className="do-cell">
            <div className="do-num">01</div>
            <div className="do-title">Design Systems</div>
            <div className="do-desc">
              Tokens, primitives, components, and the governance that keeps
              them honest. Figma libraries that engineers actually use.
            </div>
          </div>
          <div className="do-cell">
            <div className="do-num">02</div>
            <div className="do-title">Product UX</div>
            <div className="do-desc">
              End-to-end product thinking — from problem framing through
              flows, prototypes, and ship-ready specs that survive contact
              with reality.
            </div>
          </div>
          <div className="do-cell">
            <div className="do-num">03</div>
            <div className="do-title">Design ↔ Engineering</div>
            <div className="do-desc">
              I prototype in code, sit in eng standups, and ship the
              hand-coded portfolio you&rsquo;re looking at. The seam between
              design and engineering is where I work.
            </div>
          </div>
        </div>
      </>
    ),
  },

  /* 06 — In real life */
  {
    id: "irl",
    title: "In real life",
    render: () => (
      <>
        <div className="irl-header">
          <div className="deck-eyebrow">In real life</div>
          <h2 className="deck-h2">
            Design is a verb here, not a title.
          </h2>
          <p className="deck-lead">
            Cairo-based, globally-shipping. I split my week between deep work
            at the desk, the kind of design critiques that happen on a
            beanbag, and the occasional stage in front of a hundred
            engineers — explaining why design systems matter.
          </p>
        </div>
        <div className="irl-mosaic">
          {/* Row 1 — in the room */}
          <figure className="irl-tile irl-tile--action">
            <img
              src="/images/personal/about-mosaic-02-speaking.jpg"
              alt="Sayed leading a design critique"
              loading="lazy"
            />
            <figcaption>In action · design critique</figcaption>
          </figure>
          <figure className="irl-tile irl-tile--stage">
            <img
              src="/images/personal/about-mosaic-03-presentation.jpg"
              alt="Sayed presenting on stage"
              loading="lazy"
            />
            <figcaption>On stage · internal talk</figcaption>
          </figure>

          {/* Row 2 — in public */}
          <a
            className="irl-talk"
            href="https://www.youtube.com/watch?v=Wvh1vm-gXAk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="irl-talk-thumb">
              <img
                src="https://img.youtube.com/vi/Wvh1vm-gXAk/hqdefault.jpg"
                alt="JobStack talk — Designers and Engineers"
                loading="lazy"
              />
              <span className="irl-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
                </svg>
              </span>
            </div>
            <div className="irl-talk-meta">
              <span className="irl-talk-badge">JobStack · June 2022</span>
              <span className="irl-talk-title">
                Love/Hate between Designers &amp; Engineers
              </span>
              <span className="irl-talk-cta">Watch on YouTube →</span>
            </div>
          </a>
          <a
            className="irl-talk"
            href="https://www.youtube.com/watch?v=tFn31cgWk7Y"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="irl-talk-thumb">
              <img
                src="https://img.youtube.com/vi/tFn31cgWk7Y/hqdefault.jpg"
                alt="Letter Cast — Design systems and digital products"
                loading="lazy"
              />
              <span className="irl-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
                </svg>
              </span>
            </div>
            <div className="irl-talk-meta">
              <span className="irl-talk-badge">Letter Cast · S1 · Ep 4</span>
              <span className="irl-talk-title">
                Design systems &amp; digital products
              </span>
              <span className="irl-talk-cta">Watch on YouTube →</span>
            </div>
          </a>
        </div>
      </>
    ),
  },

  /* 07 — How I think (business lens) */
  {
    id: "thinking",
    title: "How I think",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">How I think</div>
          <h2 className="deck-h2">
            Design decisions, measured in business outcomes.
          </h2>
        </div>
        <div className="thinking-grid">
          <div className="thinking-card">
            <div className="thinking-num">01</div>
            <div className="thinking-title">
              Find the metric that moves the business.
            </div>
            <p className="thinking-body">
              At Halan, loan onboarding wasn&rsquo;t a UX problem — it was a
              revenue leak. Every dropped applicant was a loan we
              didn&rsquo;t book. I rebuilt the flow around officers in the
              field, not designers at a desk, and watched the funnel close.
            </p>
            <div className="thinking-evidence">
              <span className="thinking-metric">+22%</span>
              <span className="thinking-meta">
                loan applications completed · MNT-Halan<sup>†</sup>
              </span>
            </div>
          </div>

          <div className="thinking-card">
            <div className="thinking-num">02</div>
            <div className="thinking-title">
              Compound velocity through systems.
            </div>
            <p className="thinking-body">
              Brandbassador was shipping screens twice — once in React, once
              in Flutter — paying the cost in eng hours, QA bugs, and brand
              drift. One source of truth across platforms turned design
              from a bottleneck into a multiplier.
            </p>
            <div className="thinking-evidence">
              <span className="thinking-metric">3× faster</span>
              <span className="thinking-meta">
                feature ship rate · 8 libraries → 1 · Club TIE
              </span>
            </div>
          </div>

          <div className="thinking-card">
            <div className="thinking-num">03</div>
            <div className="thinking-title">
              Ship the thing that drives the next purchase.
            </div>
            <p className="thinking-body">
              Mabaat&rsquo;s booking page was beautiful — and converting
              poorly. Guests in the GCC trusted host <em>identity</em>, not
              star ratings. Reframing trust signals lifted bookings
              without touching the funnel underneath.
            </p>
            <div className="thinking-evidence">
              <span className="thinking-metric">+31%</span>
              <span className="thinking-meta">
                booking conversion on listing page · Mabaat<sup>†</sup>
              </span>
            </div>
          </div>
        </div>
        <p className="thinking-footnote">
          † Internal analytics at time of work; figures rounded. Available
          on request under NDA.
        </p>
      </>
    ),
  },

  /* 08 — Case study · 01 Club App */
  {
    id: "feature-clubapp",
    title: "Featured · Club App",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Featured case study</span>
            <span>Brandbassador · Club</span>
            <span>Mobile · Flutter</span>
          </div>
          <h2 className="feature-title">An ambassador app that earns the open.</h2>
          <p className="feature-lede">
            Ambassadors open the Club app to do one thing: see what they can
            earn next. I redesigned the mobile experience around mission
            discovery, wallet clarity, and rewards that feel real.
          </p>
          <ul className="feature-bullets">
            <li>Mission cards prioritized by relevance and earning potential.</li>
            <li>Wallet view that surfaces value, not just balance.</li>
            <li>Onboarding that gets a creator to their first mission in &lt; 60s.</li>
            <li>Notifications tuned for retention, not noise.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <video
              src="/videos/club-intro.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Club App — missions, wallet, and onboarding for ambassadors"
            />
          </div>
          <div className="feature-shot-caption">
            <span>Missions · wallet · onboarding · Flutter mobile</span>
            <Link href="/work/club-app" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 09 — Case study · 02 Gamification (Club Levels) */
  {
    id: "feature-clublevels",
    title: "Featured · Club Levels",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Featured case study</span>
            <span>Brandbassador · Club</span>
            <span>Gamification</span>
          </div>
          <h2 className="feature-title">A gamification system, not a badge.</h2>
          <p className="feature-lede">
            Loyalty programs fail when they reward activity instead of
            progress. I designed Club Levels as a system — tiers, thresholds,
            perks, and feedback loops that make ambassadors feel themselves
            moving.
          </p>
          <ul className="feature-bullets">
            <li>Level architecture mapped to actual ambassador behavior.</li>
            <li>Near-threshold nudges that surface progress, not pressure.</li>
            <li>Tier-specific perks tied to brand value, not vanity rewards.</li>
            <li>Motion-led level-up moments — celebration as retention.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <video
              src="/videos/levels-mobile-logo.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Club Levels — gamification system, level overview"
            />
          </div>
          <div className="feature-shot-caption">
            <span>Tiers · thresholds · perks · feedback loops</span>
            <Link href="/work/club-levels" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 10 — Case study · 03 MNT-Halan */
  {
    id: "feature-halan",
    title: "Featured · MNT-Halan",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Featured case study</span>
            <span>MNT-Halan</span>
            <span>2020 — 2023</span>
          </div>
          <h2 className="feature-title">Loan officers in the field.</h2>
          <p className="feature-lede">
            Field officers using mid-tier Android phones, in 38°C heat, in
            villages with patchy data, paid on commission. I designed the
            product for the user nobody designs for.
          </p>
          <ul className="feature-bullets">
            <li>Moved photo upload off the happy path — async background sync.</li>
            <li>Rebuilt the application flow around offline-first state machines.</li>
            <li>Designed an incentives dashboard officers could read at a glance, on the move.</li>
            <li>Result: completion rate ↑ ~22%, support tickets ↓<sup>†</sup>.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <img
              src="/images/projects/mnt-halan/mnt-halan-05-lending-dashboards.png"
              alt="MNT-Halan loan officer dashboards — field UX"
              loading="lazy"
            />
          </div>
          <div className="feature-shot-caption">
            <span>~3,500 field officers · Egypt · offline-first</span>
            <Link href="/work/mnt-halan" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 11 — Case study · 04 Otida */
  {
    id: "feature-otida",
    title: "Featured · Otida",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Featured case study</span>
            <span>Otida</span>
            <span>Product UX</span>
          </div>
          <h2 className="feature-title">Clarity from browse to checkout.</h2>
          <p className="feature-lede">
            Health products live or die on trust. I rebuilt Otida&rsquo;s
            tracking and prescription flows around research-validated UX
            patterns — patients understand their plan, doctors trust the data.
          </p>
          <ul className="feature-bullets">
            <li>Logging redesigned around the moments users actually do it.</li>
            <li>Glucose &amp; blood-pressure data surfaced as decisions, not numbers.</li>
            <li>Prescription creation reduced from multi-screen to single flow.</li>
            <li>Validated with patients and clinicians before shipping.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <img
              src="/images/projects/otida/otida-app-hero.png"
              alt="Otida health product — tracking, plan, and clinician flows"
              loading="lazy"
            />
          </div>
          <div className="feature-shot-caption">
            <span>Patients + clinicians · research-led product UX</span>
            <Link href="/work/otida" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 12 — Case study · 05 Mabaat */
  {
    id: "feature-mabaat",
    title: "Featured · Mabaat",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Featured case study</span>
            <span>Mabaat</span>
            <span>2019 — 2020</span>
          </div>
          <h2 className="feature-title">Short stays, lasting first impressions.</h2>
          <p className="feature-lede">
            Western booking patterns don&rsquo;t translate. MENA users want
            host identity, not host ratings. I designed Mabaat&rsquo;s booking
            product around trust signals tuned to the region.
          </p>
          <ul className="feature-bullets">
            <li>Verified-host identity surfaced earlier than rating stars.</li>
            <li>Transparent price breakdown — no surprises at checkout.</li>
            <li>24/7 support built into the flow, not buried in a help center.</li>
            <li>Cultural cues in iconography, copy, and onboarding tone.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <img
              src="/images/projects/mabaat/mabaat-card-bg.png"
              alt="Mabaat booking app — explore, details, and checkout flows"
              loading="lazy"
            />
          </div>
          <div className="feature-shot-caption">
            <span>Verified hosts · transparent pricing · region-tuned trust</span>
            <Link href="/work/mabaat" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 13 — Case study · 06 Club Design System (Club TIE) */
  {
    id: "feature-clubtie",
    title: "Featured · Club TIE",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Featured case study</span>
            <span>Brandbassador</span>
            <span>2023 — present</span>
          </div>
          <h2 className="feature-title">Club TIE.</h2>
          <p className="feature-lede">
            One product, two platforms, zero shared language. I built the
            design system that gave Club a single source of truth — across a
            React web app and a Flutter mobile app.
          </p>
          <ul className="feature-bullets">
            <li>Audited 14+ button variants and 6 modal styles across two codebases.</li>
            <li>Built a 4-tier token architecture from primitives to semantic roles.</li>
            <li>Shipped contribution &amp; governance flow — designers PR changes, engineers review.</li>
            <li>Documented in Figma + Notion + Storybook. One language, three surfaces.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <video
              src="/videos/club-tie-winsen-intro.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Club TIE design system intro"
            />
          </div>
          <div className="feature-shot-caption">
            <span>Club TIE · React web + Flutter mobile · one source of truth</span>
            <Link href="/work/club-tie" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 14 — Club TIE · Impact */
  {
    id: "impact",
    title: "Club TIE · Impact",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">Club TIE · impact</div>
          <h2 className="deck-h2">The system bought us velocity.</h2>
        </div>
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-delta">
              <span className="arrow">↓</span>~60%
            </div>
            <div className="impact-title">Time to ship a new screen</div>
            <div className="impact-desc">
              Designers compose from existing components instead of drawing
              from scratch. Days became hours.
            </div>
            <div className="impact-footnote">† Estimate · to validate with team</div>
          </div>
          <div className="impact-card">
            <div className="impact-delta">
              <span className="arrow">8→1</span>
            </div>
            <div className="impact-title">Libraries consolidated</div>
            <div className="impact-desc">
              From fragmented Figma libraries across squads to a single
              published, versioned source of truth.
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-delta">
              <span className="arrow">↑</span>2×
            </div>
            <div className="impact-title">Platforms served</div>
            <div className="impact-desc">
              One design language now drives both the React web platform and
              the Flutter mobile app — designed once, shipped twice.
            </div>
          </div>
        </div>
      </>
    ),
  },

  /* 15 — Case study · 07 Etar */
  {
    id: "feature-etar",
    title: "Featured · Etar",
    render: () => (
      <div className="feature-frame">
        <div className="feature-left">
          <div className="feature-meta">
            <span>Founder project</span>
            <span>Etar</span>
            <span>2023 — present</span>
          </div>
          <h2 className="feature-title">A system for the Arab web.</h2>
          <p className="feature-lede">
            RTL-first, dual-script, web and mobile. I&rsquo;m building Etar
            because the Arabic-speaking web deserves a design system built
            for it — not retrofitted from one that wasn&rsquo;t.
          </p>
          <ul className="feature-bullets">
            <li>4,000+ components across web and mobile, RTL &amp; LTR.</li>
            <li>Native Arabic typography pairings, not Latin-first fallbacks.</li>
            <li>Tokens designed to flip direction without breaking rhythm.</li>
            <li>Built as a product, sold as a system — my bet on the MENA market.</li>
          </ul>
        </div>
        <div className="feature-right feature-shot">
          <div className="feature-shot-frame">
            <video
              src="/videos/etar-ds.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Etar — RTL design system across web and mobile"
            />
          </div>
          <div className="feature-shot-caption">
            <span>4,000+ components · RTL + LTR · founder-led</span>
            <Link href="/work/etar" className="feature-link">
              View case study
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ),
  },

  /* 16 — How I work */
  {
    id: "howiwork",
    title: "How I work",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">How I work</div>
          <h2 className="deck-h2">
            Four modes. One product brain.
          </h2>
          <p className="deck-lead" style={{ marginTop: 18 }}>
            I don&rsquo;t follow a methodology — I switch between four modes,
            picking whichever one is going to move the product the most that
            week.
          </p>
        </div>

        <div className="modes-grid">
          <div className="modes-card">
            <div className="modes-num">01</div>
            <div className="modes-label">Operator</div>
            <div className="modes-tag">Default mode</div>
            <p className="modes-body">
              Sitting in eng standups twice a week. Reading the codebase.
              Filing my own Linear tickets. I work as part of the product
              team, not adjacent to it.
            </p>
            <div className="modes-evidence">
              <span className="modes-tool">Figma · Linear · GitHub · Slack</span>
            </div>
          </div>

          <div className="modes-card">
            <div className="modes-num">02</div>
            <div className="modes-label">Systems thinker</div>
            <div className="modes-tag">When scale is the problem</div>
            <p className="modes-body">
              Auditing what already exists, mapping the contract between
              Figma and code, and writing the rules so the next 100 screens
              compose themselves instead of needing a designer.
            </p>
            <div className="modes-evidence">
              <span className="modes-tool">Tokens · primitives · governance</span>
            </div>
          </div>

          <div className="modes-card modes-card--accent">
            <div className="modes-num">03</div>
            <div className="modes-label">Vibe coder</div>
            <div className="modes-tag">When Figma can&rsquo;t answer it</div>
            <p className="modes-body">
              Some questions only get answered in code — motion, density,
              real data, real performance. I prototype in Cursor / Claude
              Code / v0 so design happens in the medium that actually ships.
            </p>
            <div className="modes-evidence">
              <span className="modes-tool">Cursor · Claude Code · Next.js · Framer Motion</span>
            </div>
          </div>

          <div className="modes-card">
            <div className="modes-num">04</div>
            <div className="modes-label">Mentor &amp; communicator</div>
            <div className="modes-tag">Influence beyond my squad</div>
            <p className="modes-body">
              Talks, podcasts, design critiques, 1:1s. The work isn&rsquo;t
              done when it ships — it&rsquo;s done when the rest of the team
              can ship it without me.
            </p>
            <div className="modes-evidence">
              <span className="modes-tool">JobStack · Letter Cast · mentoring designers</span>
            </div>
          </div>
        </div>

        <p className="howiwork-note">
          The thread that runs through all four:{" "}
          <strong>I treat design as a product, not a deliverable</strong>.
          I want what I make to keep working after I&rsquo;ve moved on — and
          to make the people who inherit it faster than I was.
        </p>
      </>
    ),
  },

  /* 13 — Contact */
  {
    id: "contact",
    title: "Let's talk",
    render: () => (
      <>
        <div>
          <div className="deck-eyebrow">Let&rsquo;s talk</div>
          <h2 className="deck-h2">
            Open to senior IC, staff,
            <br />
            and DS Lead roles.
          </h2>
          <p className="deck-lead" style={{ marginTop: 24 }}>
            London · Berlin · Remote-EU · NYC. Consumer products where design
            systems unlock product velocity.
          </p>
        </div>
        <div className="contact-grid">
          <a className="contact-cell" href="mailto:sayedelmohamady@gmail.com">
            <div className="cc-label">Email</div>
            <div className="cc-value">sayedelmohamady@gmail.com</div>
          </a>
          <a
            className="contact-cell"
            href="https://www.linkedin.com/in/sayedelmohamady"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="cc-label">LinkedIn</div>
            <div className="cc-value">/in/sayedelmohamady</div>
          </a>
          <Link className="contact-cell" href="/">
            <div className="cc-label">Portfolio</div>
            <div className="cc-value">sayedelmohamady.com</div>
          </Link>
        </div>
      </>
    ),
  },

  /* 18 — Thank you */
  {
    id: "thanks",
    title: "Thank you",
    render: () => (
      <>
        <div className="thanks-top">
          <div className="deck-eyebrow">End of deck</div>
        </div>
        <div className="thanks-center">
          <h1 className="thanks-headline">
            Thank<span className="thanks-dot">.</span>
            <br />
            <span className="thanks-headline-accent">you.</span>
          </h1>
          <p className="thanks-lede">
            For your time, your attention, and the chance to share the work.
          </p>
        </div>
        <div className="thanks-bottom">
          <span className="thanks-sig">— Sayed Elmohamady</span>
          <a className="thanks-cta" href="mailto:sayedelmohamady@gmail.com">
            Let&rsquo;s build something →
          </a>
        </div>
      </>
    ),
  },
];
