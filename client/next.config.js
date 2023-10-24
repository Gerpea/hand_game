const { PHASE_DEVELOPMENT_SERVER, PHASE_TEST } = require("next/dist/shared/lib/constants");
const { withSentryConfig } = require("@sentry/nextjs");
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const config = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"]
    .map((extension) => {
      const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
      const prodExtension = `(?<!dev\.)${extension}`;
      const devExtension = `dev\.${extension}`;
      return isDevServer ? [devExtension, extension] : prodExtension;
    })
    .flat(),
  webpack: (config, {}) => {
    // Needed for hand_detection package
    config.resolve.fallback = { fs: false };
    return config;
  },
  i18n
});

/** @type {import('next').NextConfig} */
module.exports = (phase, { defaultConfig }) => {
  return !process.env.CYPRESS && phase !== PHASE_TEST && phase !== PHASE_DEVELOPMENT_SERVER
    ? withSentryConfig(
        config,
        {
          silent: true,
          org: "german-cyganov",
          project: "javascript-nextjs"
        },
        {
          widenClientFileUpload: true,
          transpileClientSDK: true,
          tunnelRoute: "/monitoring",
          hideSourceMaps: true,
          disableLogger: true
        }
      )(phase, { defaultConfig })
    : config(phase, { defaultConfig });
};
