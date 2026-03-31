import type { Metadata } from "next";
import { HomeInteractions } from "@/components/home/HomeInteractions";
import { getWorkPageHtml } from "@/lib/caseStudyHtml";
import "@/styles/home.css";

export const metadata: Metadata = {
  title: "Work — Sayed El Mohamady",
  description:
    "Case studies by Sayed El Mohamady — design systems, digital products, and UX.",
};

export default function WorkPage() {
  const html = getWorkPageHtml();
  return (
    <HomeInteractions>
      <div className="home-page work-page">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </HomeInteractions>
  );
}
