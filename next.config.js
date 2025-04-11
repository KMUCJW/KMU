/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['kmu-psi.vercel.app'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 