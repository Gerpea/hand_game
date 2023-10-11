const { PHASE_DEVELOPMENT_SERVER } = require('next/dist/shared/lib/constants')

/** @type {import('next').NextConfig} */
module.exports = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'].map((extension) => {
    const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
    const prodExtension = `(?<!dev\.)${extension}`
    const devExtension = `dev\.${extension}`
    return isDevServer ? [devExtension, extension] : prodExtension
  }).flat(),
  webpack: (config, { }) => {
    // Needed for hand_detection package
    config.resolve.fallback = { fs: false }
    return config
  }
})