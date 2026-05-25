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
const LazyVideoPlayer = dynamic(
  () =>
    import("@/components/LazyVideoPlayer").then((mod) => mod.LazyVideoPlayer),
  { ssr: false },
);

export function ClientShell() {
  return (
    <>
      <IntroOverlay />
      <CustomCursor />
      <LazyVideoPlayer />
    </>
  );
}
