import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { ClubTieCaseStudyBody } from "@/components/case-study/ClubTieCaseStudyBody";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club TIE — Design System Case Study",
  description:
    "Design system for Club TIE — architecture, components, governance, and shipping with the product.",
};

export default function ClubTieCaseStudyPage() {
  const html = getCaseStudyBodyHtml("club-tie");
  return (
    <CaseStudyRevealInit>
      <div className="case-study-club club-tie">
        <CaseStudyTopNav />
        <ClubTieCaseStudyBody html={html} />
      </div>
    </CaseStudyRevealInit>
  );
}
