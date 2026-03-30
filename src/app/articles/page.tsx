import type { Metadata } from "next";
import { HomeInteractions } from "@/components/home/HomeInteractions";
import { getArticlesPageHtml } from "@/lib/caseStudyHtml";
import "@/styles/home.css";

export const metadata: Metadata = {
  title: "Articles — Sayed El Mohamady",
  description:
    "Articles, talks, and community by Sayed El Mohamady — design systems and product craft.",
};

export default function ArticlesPage() {
  const html = getArticlesPageHtml();
  return (
    <HomeInteractions>
      <div className="home-page">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </HomeInteractions>
  );
}
