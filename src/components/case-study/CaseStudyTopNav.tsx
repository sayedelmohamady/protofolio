import Link from "next/link";

export function CaseStudyTopNav() {
  return (
    <nav className="top-nav">
      <Link href="/" className="top-nav-name">
        <span className="green-dot" />
        Sayed El Mohamady
      </Link>
      <Link href="/" className="top-nav-back">
        &larr; Back to Portfolio
      </Link>
    </nav>
  );
}
