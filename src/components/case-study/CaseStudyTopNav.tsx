"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CaseStudyTopNav() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href") ?? "/";
    const overlay = document.getElementById("pt-overlay");
    if (overlay) {
      overlay.classList.remove("pt-revealing");
      void overlay.offsetHeight;
      overlay.classList.add("pt-covering");
    }
    window.setTimeout(() => {
      routerRef.current.push(href);
    }, 420);
  };

  return (
    <nav className="top-nav">
      <Link href="/" className="top-nav-name" onClick={handleNav}>
        <span className="green-dot" />
        Sayed El Mohamady
      </Link>
      <Link href="/" className="top-nav-back" onClick={handleNav}>
        &larr; Back to Portfolio
      </Link>
    </nav>
  );
}
