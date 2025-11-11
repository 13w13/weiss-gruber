/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/jeannette',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
