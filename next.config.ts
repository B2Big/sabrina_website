import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Optimisation images pour performance mobile
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 an de cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Tailles optimisées mobile-first
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tailles d'icônes et thumbnails
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression pour les assets statiques
  compress: true,
  
  // Optimisation du build
  poweredByHeader: false, // Masquer header X-Powered-By
  generateEtags: false, // Désactiver ETags (utiliser Last-Modified à la place)
  // Fix workspace root detection warning
  outputFileTracingRoot: process.cwd(),
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
