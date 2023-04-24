/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kairos.art',
      },
      {
        protocol: 'https',
        hostname: 'pretty.kairos.art',
      },
    ],
  },
}

module.exports = nextConfig
