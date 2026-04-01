import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/templates/nusantera-heritage",
        destination: "/templates/nusantara-heritage",
        permanent: true,
      },
      {
        source: "/demo/nusantera-heritage",
        destination: "/demo/nusantara-heritage",
        permanent: true,
      },
      {
        source: "/t/nusantera-heritage",
        destination: "/t/nusantara-heritage",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
