import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club App — Gamified Loyalty System Case Study",
  description:
    "How I designed a behavior-driven gamification system — Clubs, Missions, Coins, and Leaderboards — that increased engagement 3.2× over traditional loyalty programs.",
};

export default function ClubAppCaseStudyPage() {
  const html = getCaseStudyBodyHtml("club-app");
  return (
    <CaseStudyRevealInit>
      <div className="case-study-club club-app">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
