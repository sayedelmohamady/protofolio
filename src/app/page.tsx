import type { Metadata } from "next";
import { HomeInteractions } from "@/components/home/HomeInteractions";
import { getHomeBodyHtml } from "@/lib/caseStudyHtml";
import "@/styles/home.css";

export const metadata: Metadata = {
  title: "Sayed El Mohamady — Senior Product Designer",
  description:
    "Senior Product Designer leading design systems and product design across mobile, web, and RTL. Eight years shipping to 5M+ users at MNT Halan, Club, and Mabaat.",
};

export default function HomePage() {
  const html = getHomeBodyHtml();
  return (
    <HomeInteractions>
      <div className="home-page">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </HomeInteractions>
  );
}
