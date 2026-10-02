/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // R2 public base URL varies per deployment — see lib/config.ts
      },
    ],
  },
};

module.exports = nextConfig;





