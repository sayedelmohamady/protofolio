import { CaseStudyRevealInit } from "@/components/case-study/CaseStudyRevealInit";
import { CaseStudyTopNav } from "@/components/case-study/CaseStudyTopNav";
import { getCaseStudyBodyHtml } from "@/lib/caseStudyHtml";
import type { Metadata } from "next";
import "@/styles/case-study-etar.css";

export const metadata: Metadata = {
  title: "Etar Design System — Case Study",
  description:
    "The largest RTL-first design system for Figma — 4,000+ components and variants supporting Arabic and English, built for web and mobile at scale.",
};

export default function EtarCaseStudyPage() {
  const html = getCaseStudyBodyHtml("etar");
  return (
    <CaseStudyRevealInit>
      <div className="case-study case-study--etar">
        <CaseStudyTopNav />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </CaseStudyRevealInit>
  );
}
