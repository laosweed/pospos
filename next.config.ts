import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "go.pospos.co" },
    ],
  },
};

export default nextConfig;
