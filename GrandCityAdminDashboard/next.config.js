/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: [], // Add your image domains here if needed
  },
  async rewrites() {
    const guestpassUrl = process.env.GUESTPASS_URL || 'http://localhost:3001';
    return {
      // beforeFiles runs before checking filesystem routes
      beforeFiles: [
        // GuestPass API routes - must be before filesystem to avoid conflicts
        // Login API
        {
          source: '/api/login',
          destination: guestpassUrl + '/api/login',
        },
        {
          source: '/api/login/',
          destination: guestpassUrl + '/api/login',
        },
        // Visits API
        {
          source: '/api/visits',
          destination: guestpassUrl + '/api/visits',
        },
        {
          source: '/api/visits/',
          destination: guestpassUrl + '/api/visits',
        },
        {
          source: '/api/visits/:path*',
          destination: guestpassUrl + '/api/visits/:path*',
        },
        // Executives API
        {
          source: '/api/executives',
          destination: guestpassUrl + '/api/executives',
        },
        {
          source: '/api/executives/',
          destination: guestpassUrl + '/api/executives',
        },
        // Auth API
        {
          source: '/api/auth/:path*',
          destination: guestpassUrl + '/api/auth/:path*',
        },
        // Health check
        {
          source: '/api/health',
          destination: guestpassUrl + '/api/health',
        },
        {
          source: '/api/health/',
          destination: guestpassUrl + '/api/health',
        },
        // Logout API
        {
          source: '/api/logout',
          destination: guestpassUrl + '/api/logout',
        },
        {
          source: '/api/logout/',
          destination: guestpassUrl + '/api/logout',
        },
      ],
      // afterFiles runs after checking filesystem routes
      afterFiles: [
        // Proxy main GuestPass page
        {
          source: '/_proxy/guestpass',
          destination: guestpassUrl + '/',
        },
        {
          source: '/_proxy/guestpass/',
          destination: guestpassUrl + '/',
        },
        // Proxy all GuestPass assets and pages
        {
          source: '/_proxy/guestpass/:path*',
          destination: guestpassUrl + '/:path*',
        },
      ],
    };
  },
}

module.exports = nextConfig
