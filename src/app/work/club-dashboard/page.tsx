import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Dashboard — Brand Admin Platform Case Study",
  description:
    "How I designed the SaaS admin dashboard that powers Club's brand ambassador ecosystem — including the Mission Builder, Analytics Engine, and User Management system.",
};

export default function ClubDashboardCaseStudyPage() {
  const html = getCaseStudyBodyHtml("club-dashboard");
  return (
    <CaseStudyRevealInit>
      <div className="case-study-club club-dashboard">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
