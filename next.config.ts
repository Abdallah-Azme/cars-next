import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // Security response headers appropriate for plain-HTTP (no SSL) deployment.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // NOTE: No HSTS header — server runs on plain HTTP.
          // HSTS on HTTP would permanently break access; add only after HTTPS is configured.
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "https://egyjapco.tech/storage/:path*",
      },
    ];
  },
};

export default nextConfig;
