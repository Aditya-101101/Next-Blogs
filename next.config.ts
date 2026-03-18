/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents:true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3210",
        pathname: "/api/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;