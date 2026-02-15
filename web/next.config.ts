import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/eng-hype",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
