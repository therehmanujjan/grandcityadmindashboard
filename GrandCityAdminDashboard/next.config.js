/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: [], // Add your image domains here if needed
  },
  async rewrites() {
    return [
      {
        source: '/_proxy/guestpass/',
        destination: process.env.GUESTPASS_URL || 'http://localhost:3001/',
      },
      {
        source: '/_proxy/guestpass/:path*',
        // Important: Append / to destination if path is missing, but handling :path* correctly usually requires careful syntax.
        // Next.js rewrites: simply appending :path* is correct.
        destination: (process.env.GUESTPASS_URL || 'http://localhost:3001') + '/:path*',
      },
      // Proxy API requests to GuestPass backend
      {
        source: '/api/login',
        destination: (process.env.GUESTPASS_URL || 'http://localhost:3001') + '/api/login',
      },
      {
        source: '/api/visits',
        destination: (process.env.GUESTPASS_URL || 'http://localhost:3001') + '/api/visits',
      },
      {
        source: '/api/visits/:path*',
        destination: (process.env.GUESTPASS_URL || 'http://localhost:3001') + '/api/visits/:path*',
      },
      {
        source: '/api/executives',
        destination: (process.env.GUESTPASS_URL || 'http://localhost:3001') + '/api/executives',
      },
      {
        source: '/api/auth/:path*',
        destination: (process.env.GUESTPASS_URL || 'http://localhost:3001') + '/api/auth/:path*',
      },
    ]
  },
}

module.exports = nextConfig
