import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Syne } from "next/font/google";

import "@/styles/globals.css";
import "@/styles/custom-cursor.css";
import "@/styles/intro.css";

import { ClientShell } from "@/components/ClientShell";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sayed Elmohamady — Product Designer",
  description:
    "Portfolio of Sayed Elmohamady — product design, case studies, and selected work.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080A",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ClientShell />
        <div id="pt-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
