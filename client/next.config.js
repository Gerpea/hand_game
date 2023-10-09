/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { }) => {
    // Needed for hand_detection package
    config.resolve.fallback = { fs: false }
    return config
  }
}

module.exports = nextConfig
