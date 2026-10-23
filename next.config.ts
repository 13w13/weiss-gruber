import type { NextConfig } from 'next'

const imageBaseUrl =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ??
  'https://weiss-gruber-jeanette.s3.fr-par.scw.cloud'
const imageHostname = new URL(imageBaseUrl).hostname

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: imageHostname,
        port: '',
        pathname: '/**',
      },
    ],
  },

  // La racine renvoie vers la page de Jeannette (sans fonction serveur)
  async redirects() {
    return [{ source: '/', destination: '/jeannette', permanent: false }]
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
}

export default nextConfig
