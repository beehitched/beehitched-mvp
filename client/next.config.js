/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Handle API routes if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig 