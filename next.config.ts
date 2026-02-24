import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_HOST_NAME!,
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.254.102"],
};

export default nextConfig;
