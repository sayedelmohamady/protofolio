import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Lexend } from "next/font/google";

import "@/styles/case-study-gatherup.css";
import "@/styles/case-study-gatherup-flows.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-gatherup-lexend",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gatherup-arabic",
  display: "swap",
});

export default function GatherUpDesignSystemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={`${lexend.variable} ${ibmPlexArabic.variable}`}>
      {children}
    </div>
  );
}
