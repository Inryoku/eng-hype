import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath: "/eng-hype", // Commented out for Vercel deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
