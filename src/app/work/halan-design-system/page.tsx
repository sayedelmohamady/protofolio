import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MNT Halan — Design System",
  description:
    "Design guidelines, tokens, components, and rollout across Halan products — from audit to adoption and measurement.",
};

export default function HalanDesignSystemCaseStudyPage() {
  const html = getCaseStudyBodyHtml("halan-design-system");
  return (
    <CaseStudyRevealInit>
      <div className="case-study case-study--mnt-halan">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
