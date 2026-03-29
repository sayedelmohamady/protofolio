import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { ClubExperienceCaseStudyBody } from "@/components/case-study/ClubExperienceCaseStudyBody";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Experience — UX Restructuring Case Study",
  description:
    "Redesigning the Club ambassador platform's mobile experience — restructuring IA, clarifying rewards, and building a progression system for 1M+ community members.",
};

export default function ClubExperienceCaseStudyPage() {
  const html = getCaseStudyBodyHtml("club-experience");
  return (
    <CaseStudyRevealInit>
      <div className="case-study-club club-exp">
        <CaseStudyTopNav />
        <ClubExperienceCaseStudyBody html={html} />
      </div>
    </CaseStudyRevealInit>
  );
}
