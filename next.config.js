/** @type {import('next').NextConfig} */
const nextConfig = {
  // svgr support https://dev.to/dolearning/importing-svgs-to-next-js-nna
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    })

    return config
  },
  trailingSlash: true,
  basePath: process.env.BASE_PATH, // https://nextjs.org/docs/pages/api-reference/next-config-js/basePath
  images: {
    unoptimized: true
  },
  eslint: {
    // Disable ESLint during the build process on Vercel
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
