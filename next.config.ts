import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production deployment on Vercel
  output: 'standalone',
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Configure Turbopack (Next.js 16 default)
  turbopack: {
    // Enable Turbopack configuration
  },
  
  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configure environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
