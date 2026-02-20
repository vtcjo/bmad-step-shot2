/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Tailwind CSS can work with this baseline; additional config can be added if needed
  webpack: (config) => {
    return config;
  }
};
module.exports = nextConfig;