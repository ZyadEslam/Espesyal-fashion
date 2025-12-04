const createNextIntlPlugin = require("next-intl/plugin")("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost"],
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/api/product/image/**",
        search: "**",
      },
    ],
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
    // formats: ["image/webp", "image/avif"],
    // minimumCacheTTL: 60,
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  trailingSlash: true,
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.optimization.minimize = false;
      config.cache = false;
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    // Make @vercel/kv optional - use IgnorePlugin to prevent webpack from trying to resolve it if not installed
    const webpack = require("webpack");

    // Check if @vercel/kv is installed
    const checkPackage = (pkg) => {
      try {
        require.resolve(pkg);
        return true;
      } catch {
        return false;
      }
    };

    // Only add IgnorePlugin for @vercel/kv if it's NOT installed
    if (!checkPackage("@vercel/kv")) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@vercel\/kv$/,
        })
      );
    }

    // Mark redis as external for server-side only (it's only used in API routes)
    if (isServer) {
      config.externals = config.externals || [];
      if (typeof config.externals === "function") {
        const originalExternals = config.externals;
        config.externals = [
          originalExternals,
          ({ request }, callback) => {
            if (request === "redis") {
              return callback(null, "commonjs " + request);
            }
            callback();
          },
        ];
      } else if (Array.isArray(config.externals)) {
        config.externals.push("redis");
      }
    }

    return config;
  },
  // compress: true,
  // poweredByHeader: false,
  // generateEtags: true,
  // experimental: {
  //   optimizePackageImports: ["framer-motion", "lucide-react"],
  // },
  // headers: async () => {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "X-Frame-Options",
  //           value: "DENY",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //         {
  //           key: "Referrer-Policy",
  //           value: "origin-when-cross-origin",
  //         },
  //         {
  //           key: "Permissions-Policy",
  //           value: "camera=(), microphone=(), geolocation=()",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/api/(.*)",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=3600, s-maxage=3600",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/_next/static/(.*)",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
  // webpack: (config, { isServer }) => {
  //   // Fix for framer-motion and other client-side libraries
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //     };
  //   }

  //   // Handle module resolution issues
  //   config.module = config.module || {};
  //   config.module.rules = config.module.rules || [];

  //   config.module.rules.push({
  //     test: /\.mjs$/,
  //     include: /node_modules/,
  //     type: "javascript/auto",
  //   });

  //   return config;
  // },
  // transpilePackages: ['framer-motion'],
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     'framer-motion': require.resolve('framer-motion'),
  //   };
  //   return config;
  // },
};

module.exports = createNextIntlPlugin(nextConfig);
