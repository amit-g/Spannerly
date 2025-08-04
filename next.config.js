// Get base path from environment variable, defaults to empty string for local development
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
