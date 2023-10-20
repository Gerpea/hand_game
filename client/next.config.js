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
  },
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'ru'
  }
})

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "german-cyganov",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
