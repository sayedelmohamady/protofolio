import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Platform — Powering Connections Between Brands & Ambassadors",
  description:
    "How we redesigned the Club platform from a disconnected admin tool into a brand-experience builder — where brands see their club while they build it.",
};

export default function ClubPlatformCaseStudyPage() {
  const html = getCaseStudyBodyHtml("club-platform");
  return (
    <CaseStudyRevealInit>
      <div className="case-study case-study-club club-platform">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
