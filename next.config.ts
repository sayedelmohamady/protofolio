import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent directories may contain other lockfiles; pin tracing to this app.
  outputFileTracingRoot: path.join(__dirname),
  // Avoid DevTools segment explorer pulling `SegmentViewNode` into the RSC
  // client manifest (can crash dev with "not in the React Client Manifest",
  // then corrupt webpack chunks / ENOENT `./N.js` on reload).
  devIndicators: false,
};

export default nextConfig;
