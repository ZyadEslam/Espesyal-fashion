/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/product/image/**",
        search: "**",
      },
      {
        protocol: "https",
        hostname: "quick-cart-e-commerce-pi.vercel.app",
        pathname: "/api/product/image/**",
        search: "**",
      },
    ],
  },
  trailingSlash: true,
  //Remove this in development mode
  // webpack: (config) => {
  //   config.module = config.module || {};
  //   config.module.rules = config.module.rules || [];

  //   config.module.rules.push({
  //     test: /\.mjs$/,
  //     include: /node_modules/,
  //     type: "javascript/auto",
  //   });

  //   return config;
  // },
};

module.exports = nextConfig;
