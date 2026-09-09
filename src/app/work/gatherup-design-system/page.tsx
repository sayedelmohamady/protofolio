import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GatherUp — Case Study",
  description:
    "GatherUp — a social app for meeting through shared interests. Product, UX/UI, design system, and development.",
};

export default function GatherUpDesignSystemCaseStudyPage() {
  const html = getCaseStudyBodyHtml("gatherup-design-system");

  return (
    <CaseStudyRevealInit>
      <div className="case-study-gatherup">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
