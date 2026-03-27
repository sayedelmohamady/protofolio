import "@/styles/resume.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume — Sayed El Mohamady",
  description:
    "Senior Product Designer specializing in design systems. 8+ years of experience building products at scale.",
};

export default function ResumePage() {
  return (
    <div className="resume-page">
      {/* ── TOP NAV ── */}
      <nav className="resume-nav">
        <Link href="/" className="resume-nav-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Portfolio
        </Link>
        <ul className="resume-nav-links">
          <li><a href="#experience">Experience</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
        </ul>
        <a
          href="/Sayed-Elmohamady-Resume.pdf"
          className="resume-download-btn"
          download
          aria-label="Download resume as PDF"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF
        </a>
      </nav>

      <main className="resume-main">
        {/* ── HEADER ── */}
        <header className="resume-header">
          <div className="resume-header-inner">
            <div className="resume-header-left">
              <div className="resume-availability">
                <span className="resume-dot" />
                Available for work
              </div>
              <h1 className="resume-name">Sayed<br />Elmohamady</h1>
              <p className="resume-title">Senior Product Designer · Design System Lead</p>
              <p className="resume-summary">
                8+ years building digital products and design systems at scale. Bridging the gap between design and engineering — from visual language to component libraries that teams love to use.
              </p>
              <div className="resume-contact-row">
                <a href="mailto:sayedelmohamady@gmail.com" className="resume-contact-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  sayedelmohamady@gmail.com
                </a>
                <a href="tel:+0201093923229" className="resume-contact-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2.5C2 2 2.5 1.5 3 1.5h2l1 3-1.5 1c.5 1.5 2 3 3.5 3.5L9 8l3 1v2c0 .5-.5 1-1 1C4.5 12 2 6 2 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +020 1093923229
                </a>
                <span className="resume-contact-item resume-contact-location">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  Cairo, Egypt
                </span>
              </div>
            </div>
            <div className="resume-header-right">
              <div className="resume-social-grid">
                <a href="https://www.behance.net/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-social-card">
                  <span className="resume-social-label">Behance</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h5c1 0 2 .5 2 1.5S8 6 7 6H2V3zM2 6h5.5c1 0 2 .5 2 1.8S8.5 9 7.5 9H2V6z" stroke="currentColor" strokeWidth="1.1" /><path d="M10 3.5h3M10 5.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /><circle cx="11.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.1" /></svg>
                </a>
                <a href="https://dribbble.com/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-social-card">
                  <span className="resume-social-label">Dribbble</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.1" /><path d="M2 7h10M7 2a8 8 0 0 1 2.5 10M7 2a8 8 0 0 0-2.5 10" stroke="currentColor" strokeWidth="1.1" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-social-card">
                  <span className="resume-social-label">LinkedIn</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.1" /><path d="M4 6v4M4 4v.5M7 6v4M7 8c0-1 .5-2 2-2s2 .5 2 2v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                </a>
                <a href="https://uplabs.com/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-social-card">
                  <span className="resume-social-label">Uplabs</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L2 5v4l5 3 5-3V5L7 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="resume-body">
          {/* ── LEFT COLUMN ── */}
          <div className="resume-col-main">

            {/* EXPERIENCE */}
            <section id="experience" className="resume-section">
              <h2 className="resume-section-title">Experience</h2>

              {/* Job 1 */}
              <article className="resume-job">
                <div className="resume-job-timeline">
                  <div className="resume-job-dot" />
                  <div className="resume-job-line" />
                </div>
                <div className="resume-job-content">
                  <div className="resume-job-header">
                    <div>
                      <h3 className="resume-job-title">Senior Product Designer · Design System Lead</h3>
                      <a href="https://brandbassdor.com" className="resume-job-company" target="_blank" rel="noopener noreferrer">Brandbassdor (Club)</a>
                    </div>
                    <div className="resume-job-meta">
                      <span className="resume-job-period">Aug 2023 — Present</span>
                      <span className="resume-job-location">Cairo, Egypt</span>
                    </div>
                  </div>
                  <ul className="resume-job-bullets">
                    <li>Spearhead the creation and maintenance of the Club design system components and guidelines.</li>
                    <li>Establish the visual language, develop components, and meticulously document guidelines.</li>
                    <li>Collaborate with cross-functional teams to ensure the highest quality of the product.</li>
                    <li>Foster continuous improvement of the design system to align with evolving industry standards.</li>
                  </ul>
                  <div className="resume-job-tags">
                    <span>Design Systems</span>
                    <span>Component Library</span>
                    <span>Figma</span>
                    <span>Documentation</span>
                  </div>
                </div>
              </article>

              {/* Job 2 */}
              <article className="resume-job">
                <div className="resume-job-timeline">
                  <div className="resume-job-dot" />
                  <div className="resume-job-line" />
                </div>
                <div className="resume-job-content">
                  <div className="resume-job-header">
                    <div>
                      <h3 className="resume-job-title">Senior Product Designer · Design System Lead</h3>
                      <a href="https://halan.com" className="resume-job-company" target="_blank" rel="noopener noreferrer">MNT-Halan</a>
                    </div>
                    <div className="resume-job-meta">
                      <span className="resume-job-period">Jun 2020 — Jul 2023 · 3 yr</span>
                      <span className="resume-job-location">Cairo</span>
                    </div>
                  </div>
                  <ul className="resume-job-bullets">
                    <li>Direct collaboration with the product team for prototyping, designing, and delivering UI/UX experiences.</li>
                    <li>Lead the design and maintenance of components, UI patterns, and documentation for the MNT design system.</li>
                    <li>Ownership of various verticals, including Halan user app, loans, loan officer, pay, and commerce.</li>
                  </ul>
                  <div className="resume-job-tags">
                    <span>Product Design</span>
                    <span>Design Systems</span>
                    <span>UI Patterns</span>
                    <span>Fintech</span>
                  </div>
                </div>
              </article>

              {/* Job 3 */}
              <article className="resume-job">
                <div className="resume-job-timeline">
                  <div className="resume-job-dot resume-job-dot--accent" />
                  <div className="resume-job-line" />
                </div>
                <div className="resume-job-content">
                  <div className="resume-job-header">
                    <div>
                      <h3 className="resume-job-title">Founder</h3>
                      <span className="resume-job-company">Etar Design System</span>
                    </div>
                    <div className="resume-job-meta">
                      <span className="resume-job-period">Feb 2023 — Present</span>
                      <span className="resume-job-badge">Founder</span>
                    </div>
                  </div>
                  <ul className="resume-job-bullets">
                    <li>Successfully launched Etar Design System, utilized by multiple clients.</li>
                    <li>Continuously maintain and enhance the design system, ensuring compatibility with the latest technologies.</li>
                    <li>Provide ongoing support to clients, addressing needs and implementing new features.</li>
                  </ul>
                  <div className="resume-job-tags">
                    <span>Founder</span>
                    <span>Design Systems</span>
                    <span>Client Work</span>
                  </div>
                </div>
              </article>

              {/* Job 4 */}
              <article className="resume-job">
                <div className="resume-job-timeline">
                  <div className="resume-job-dot" />
                  <div className="resume-job-line" />
                </div>
                <div className="resume-job-content">
                  <div className="resume-job-header">
                    <div>
                      <h3 className="resume-job-title">Design System Consultant</h3>
                      <span className="resume-job-company">Orcas</span>
                    </div>
                    <div className="resume-job-meta">
                      <span className="resume-job-period">Consulting</span>
                    </div>
                  </div>
                  <ul className="resume-job-bullets">
                    <li>Design and maintain components, UI patterns, and documentation for Orcas design system.</li>
                    <li>Collaborate with cross-functional teams to develop tools and processes for world-class user experiences.</li>
                  </ul>
                  <div className="resume-job-tags">
                    <span>Consulting</span>
                    <span>Design Systems</span>
                    <span>UI Patterns</span>
                  </div>
                </div>
              </article>

              {/* Job 5 */}
              <article className="resume-job">
                <div className="resume-job-timeline">
                  <div className="resume-job-dot" />
                  <div className="resume-job-line" />
                </div>
                <div className="resume-job-content">
                  <div className="resume-job-header">
                    <div>
                      <h3 className="resume-job-title">Senior Product Designer</h3>
                      <span className="resume-job-company">Mabaat Homes</span>
                    </div>
                    <div className="resume-job-meta">
                      <span className="resume-job-period">Aug 2019 — Jul 2020 · 1 yr</span>
                      <span className="resume-job-location">El-Riyadh</span>
                    </div>
                  </div>
                  <ul className="resume-job-bullets">
                    <li>Led the product design department, overseeing UX/UI processes and conducting review processes.</li>
                    <li>Revamped the website and developed a new app, responsible for the design system and style guide.</li>
                  </ul>
                  <div className="resume-job-tags">
                    <span>Product Design</span>
                    <span>UX/UI</span>
                    <span>Style Guide</span>
                  </div>
                </div>
              </article>

              {/* Job 6 */}
              <article className="resume-job resume-job--last">
                <div className="resume-job-timeline">
                  <div className="resume-job-dot" />
                </div>
                <div className="resume-job-content">
                  <div className="resume-job-header">
                    <div>
                      <h3 className="resume-job-title">User Interface Designer</h3>
                      <span className="resume-job-company">Awamer Elshabaka</span>
                    </div>
                    <div className="resume-job-meta">
                      <span className="resume-job-period">Jan 2018 — Dec 2018 · 1 yr</span>
                      <span className="resume-job-location">Saudi Arabia · Remote</span>
                    </div>
                  </div>
                  <ul className="resume-job-bullets">
                    <li>Led the product design department, overseeing UX/UI processes and conducting review processes.</li>
                    <li>Revamped the website and developed a new app, responsible for the design system and style guide.</li>
                  </ul>
                  <div className="resume-job-tags">
                    <span>UI Design</span>
                    <span>UX/UI</span>
                    <span>Remote</span>
                  </div>
                </div>
              </article>
            </section>

            {/* EDUCATION */}
            <section id="education" className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              <article className="resume-edu-card">
                <div className="resume-edu-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L2 6l8 4 8-4-8-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M2 6v6M6 8v5c0 1 1.8 2 4 2s4-1 4-2V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="resume-edu-content">
                  <h3 className="resume-edu-degree">Bachelor's Degree in Computer Science</h3>
                  <p className="resume-edu-school">Mansoura University</p>
                  <span className="resume-edu-period">2014 — 2018</span>
                </div>
              </article>
            </section>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="resume-col-sidebar">

            {/* SKILLS */}
            <section id="skills" className="resume-section">
              <h2 className="resume-section-title">What I do</h2>
              <div className="resume-skills-list">
                {[
                  "Product Thinking",
                  "Problem Framing",
                  "End-to-End Product Design",
                  "Design Systems Architecture",
                  "Scalable Design",
                  "UX Clarity",
                  "Interaction Design",
                  "Rapid Prototyping",
                  "Design to Code",
                  "Vibe Coding",
                  "Cross-functional Collaboration",
                ].map((skill) => (
                  <span key={skill} className="resume-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* TOOLS */}
            <section className="resume-section">
              <h2 className="resume-section-title">Craft & Tools</h2>
              <div className="resume-tools-grid">
                {[
                  { name: "Figma", icon: "F" },
                  { name: "Framer", icon: "Fr" },
                  { name: "Cursor", icon: "C" },
                  { name: "Claude", icon: "Cl" },
                  { name: "ChatGPT", icon: "G" },
                  { name: "Notion", icon: "N" },
                  { name: "Mixpanel", icon: "M" },
                  { name: "Amplitude", icon: "A" },
                ].map((tool) => (
                  <div key={tool.name} className="resume-tool-item">
                    <div className="resume-tool-icon">{tool.icon}</div>
                    <span className="resume-tool-name">{tool.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* OTHER SKILLS */}
            <section className="resume-section">
              <h2 className="resume-section-title">Other Skills</h2>
              <div className="resume-skills-list resume-skills-list--code">
                {[
                  "Design to Code",
                  "AI-assisted Design",
                  "Prompt Engineering",
                  "Component Thinking",
                  "Product Analytics",
                  "Iteration & Experimentation"
                ].map((skill) => (
                  <span key={skill} className="resume-skill-tag resume-skill-tag--code">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* LANGUAGES */}
            <section className="resume-section">
              <h2 className="resume-section-title">Languages</h2>
              <div className="resume-languages">
                <div className="resume-language-item">
                  <div className="resume-language-info">
                    <span className="resume-language-name">Arabic</span>
                    <span className="resume-language-level">Native</span>
                  </div>
                  <div className="resume-language-bar">
                    <div className="resume-language-fill" style={{ width: "100%" }} />
                  </div>
                </div>
                <div className="resume-language-item">
                  <div className="resume-language-info">
                    <span className="resume-language-name">English</span>
                    <span className="resume-language-level">Professional</span>
                  </div>
                  <div className="resume-language-bar">
                    <div className="resume-language-fill" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </section>

            {/* SOCIAL */}
            <section className="resume-section">
              <h2 className="resume-section-title">Links</h2>
              <div className="resume-links-list">
                <a href="https://www.behance.net/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-link-item">
                  <span>Behance</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M5 2h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a href="https://dribbble.com/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-link-item">
                  <span>Dribbble</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M5 2h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-link-item">
                  <span>LinkedIn</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M5 2h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a href="https://uplabs.com/sayedelmohamady" target="_blank" rel="noopener noreferrer" className="resume-link-item">
                  <span>Uplabs</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M5 2h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </section>

          </aside>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="resume-footer">
        <div className="resume-footer-inner">
          <p className="resume-footer-text">
            <span className="resume-footer-dot" /> Open to full-time and contract opportunities
          </p>
          <a href="mailto:sayedelmohamady@gmail.com" className="resume-footer-cta">
            sayedelmohamady@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
