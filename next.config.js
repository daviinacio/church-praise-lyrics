const withPWA = require('next-pwa')

module.exports = withPWA({
  webpack5: true,
  async headers() {
    return [
      {
        source: '/praises/:praiseId*',
        headers: [
          {
            key: 'Cache-Control',
            value: `s-maxage=${ process.env.CACHE_MAXAGE || 60 }, stale-while-revalidate`,
          },
        ],
      },
      {
        source: '/api/v1/praises/:praiseId*',
        headers: [
          {
            key: 'Cache-Control',
            value: `s-maxage=${ process.env.CACHE_MAXAGE || 60 }, stale-while-revalidate`,
          },
        ],
      },
    ]
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
  }
})