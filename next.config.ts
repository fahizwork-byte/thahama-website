import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * Optimized for performance with:
 * - Image optimization settings
 * - Compression
 * - Production optimizations
 */
const nextConfig: NextConfig = {
  // Note: Turbopack is for development only
  // Vercel uses standard Next.js build in production
  // This config won't affect production builds

  // Image optimization - supports multiple formats and sizes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Enable modern image formats
    formats: ["image/avif", "image/webp"],
    // Configure quality levels
    qualities: [75, 90],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  reactStrictMode: true,

  // Compression (enabled by default on Vercel)
  compress: true,

  // Note: swcMinify is enabled by default in Next.js 16, no need to specify

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["gsap", "react-icons"],
  },
};

export default nextConfig;
