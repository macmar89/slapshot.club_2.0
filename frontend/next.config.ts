import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4800/api/v1/:path*',
      },
    ];
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-b55794ef97244983a5bce9f2b8a8d9ab.r2.dev',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
