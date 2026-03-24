import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Otida — Case Study",
  description:
    "Health product UX for diabetes care — mobile and web flows, research, and outcomes.",
};

export default function OtidaCaseStudyPage() {
  const html = getCaseStudyBodyHtml("otida");
  return (
    <CaseStudyRevealInit>
      <div className="case-study">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
