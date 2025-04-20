/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add Cloudflare compatibility settings
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // If you're using next/image
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
};

module.exports = nextConfig;