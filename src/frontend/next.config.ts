import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    BACKEND_URL: 'http://localhost:6500',
  },
  async rewrites() {
    return [
      {
        source: '/aggregation-l',
        destination: '/AggregationL',
      },
      {
        source: '/aggregation-l/:id',
        destination: '/AggregationL/:id',
      },
      {
        source: '/aggregation-l/new',
        destination: '/AggregationL/new',
      },
      {
        source: '/assosiation-class-l',
        destination: '/AssosiationClassL',
      },
      {
        source: '/assosiation-class-l/:id',
        destination: '/AssosiationClassL/:id',
      },
      {
        source: '/assosiation-class-l/new',
        destination: '/AssosiationClassL/new',
      },
      {
        source: '/class-l',
        destination: '/ClassL',
      },
      {
        source: '/class-l/:id',
        destination: '/ClassL/:id',
      },
      {
        source: '/class-l/new',
        destination: '/ClassL/new',
      },
    ];
  },
};

export default nextConfig;
