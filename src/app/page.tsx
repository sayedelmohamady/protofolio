import type { Metadata } from "next";
import { HomeInteractions } from "@/components/home/HomeInteractions";
import { getHomeBodyHtml } from "@/lib/caseStudyHtml";
import "@/styles/home.css";

export const metadata: Metadata = {
  title: "Sayed El Mohamady — Senior Product Designer",
  description:
    "Senior Product Designer specializing in design systems and vibe coding. Bridging the gap between design and engineering.",
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
