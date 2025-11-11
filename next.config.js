/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['weiss-gruber-jeanette.s3.fr-par.scw.cloud'],
  },
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
