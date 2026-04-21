import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable Turbopack issues if any on Vercel
  experimental: {
    // You can add more later if needed
  },
};

export default nextConfig;
