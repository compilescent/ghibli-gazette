/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 's4.anilist.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.vercel.app' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  async headers() {
    return [
      {
        source: '/blog/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/category/:cat',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=1800, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/feed.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/og/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
          { key: 'Content-Type', value: 'image/png' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/news', destination: '/category/anime-news' },
      { source: '/manga', destination: '/category/manga-news' },
      { source: '/reviews', destination: '/category/review' },
      { source: '/releases', destination: '/category/new-release' },
      { source: '/premieres', destination: '/category/premiere' },
      { source: '/industry', destination: '/category/industry' },
      { source: '/ghibli', destination: '/category/ghibli-news' },
      { source: '/rss', destination: '/feed.xml' },
      { source: '/atom', destination: '/feed.xml' },
    ]
  },
}

module.exports = nextConfig