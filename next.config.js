/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kmu-psi.vercel.app',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['kmu-psi.vercel.app'],
    },
  },
}

module.exports = nextConfig 