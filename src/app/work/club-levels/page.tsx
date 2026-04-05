import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Levels — Case Study",
  description:
    "Tiered levels, points, and unlocks on the Club ambassador platform—visible progression and rewards tied to participation on iOS and Android.",
};

export default function ClubLevelsCaseStudyPage() {
  const html = getCaseStudyBodyHtml("club-levels");
  return (
    <CaseStudyRevealInit>
      <div className="case-study case-study-club club-levels">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
