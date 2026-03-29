import type { Metadata } from "next";
import "@/styles/beyond-the-interface.css";

import { BeyondNav } from "@/components/beyond/BeyondNav";
import { HeroSection } from "@/components/beyond/HeroSection";
import { BeyondSectionCarousel } from "@/components/beyond/BeyondSectionCarousel";
import { BeyondMediaSection } from "@/components/beyond/BeyondMediaSection";
import { BeyondFooter } from "@/components/beyond/BeyondFooter";
import { beyondMediaSections } from "@/lib/beyondMedia";

export const metadata: Metadata = {
  title: "Beyond the Interface — Sayed El Mohamady",
  description:
    "Life outside design — visual diary of hobbies and interests.",
};

export default function BeyondTheInterfacePage() {
  return (
    <div className="beyond-page">
      <BeyondNav />
      <HeroSection />
      <BeyondSectionCarousel sections={beyondMediaSections} />
      {beyondMediaSections.map((def) => (
        <BeyondMediaSection key={def.id} def={def} />
      ))}
      <BeyondFooter />
    </div>
  );
}
