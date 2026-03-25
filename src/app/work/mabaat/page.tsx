import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mabaat — Booking App UX Case Study",
  description:
    "Short-term rental booking UX for Saudi Arabia and the UAE — research, product strategy, app and web design.",
};

export default function MabaatCaseStudyPage() {
  const html = getCaseStudyBodyHtml("mabaat");
  return (
    <CaseStudyRevealInit>
      <div className="case-study case-study--mabaat">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
