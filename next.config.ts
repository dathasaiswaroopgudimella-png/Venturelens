import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Raise the body parser size limit for the parse-document route
  // Vercel default is 4.5MB which blocks large PPTX/PDF pitch decks
  serverExternalPackages: ["pdf-parse", "jszip", "mammoth"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
