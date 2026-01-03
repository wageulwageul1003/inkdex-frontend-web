/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '3.37.86.232',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-inkdex.com',
        pathname: '/**',
      },
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
    }
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // Handle *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // Exclude *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                  {
                    name: 'removeAttrs',
                    params: { attrs: '(fill|stroke)' },
                  },
                  {
                    name: 'removeDimensions',
                    active: true,
                  },
                ],
              },
              titleProp: true,
            },
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
