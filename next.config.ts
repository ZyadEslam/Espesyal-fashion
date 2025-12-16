import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   ppr: true, // Enable Partial Prerendering
  // },
  // Optimize for modern browsers - don't transpile modern JavaScript features
  swcMinify: true,
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  // Modern output for better performance
  output: "standalone",
};

export default nextConfig;
