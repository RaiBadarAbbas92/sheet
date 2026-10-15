import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Unsplash resizes on its CDN, so we hand it the width instead of running Next's optimizer.
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
};

export default nextConfig;
