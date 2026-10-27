import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Remove o balão flutuante "N" (DevTools) do canto da tela em desenvolvimento
  devIndicators: false,
};

export default nextConfig;
