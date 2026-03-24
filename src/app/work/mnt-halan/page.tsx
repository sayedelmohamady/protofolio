import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MNT-Halan — Revolutionizing Loan Processing",
  description:
    "Lending and collections UX for loan officers — strategy, dashboards, gamification, and field workflows.",
};

export default function MntHalanCaseStudyPage() {
  const html = getCaseStudyBodyHtml("mnt-halan");
  return (
    <CaseStudyRevealInit>
      <div className="case-study">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
