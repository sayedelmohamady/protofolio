import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent directories may contain other lockfiles; pin tracing to this app.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
