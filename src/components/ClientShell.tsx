"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);
const IntroOverlay = dynamic(
  () => import("@/components/IntroOverlay").then((mod) => mod.IntroOverlay),
  { ssr: false },
);

export function ClientShell() {
  return (
    <>
      <IntroOverlay />
      <CustomCursor />
    </>
  );
}
