import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Permite build de verificação em pasta separada (não interfere no dev)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Garante que o engine do Prisma entre no build standalone (deploy Render)
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/**", "./node_modules/@prisma/client/**"],
  },
  /* config options here */
  // Cache longo das imagens: visitas de retorno carregam do disco, não da rede
  async headers() {
    return [
      {
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/logo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Remove o balão flutuante "N" (DevTools) do canto da tela em desenvolvimento
  devIndicators: false,
};

export default nextConfig;
