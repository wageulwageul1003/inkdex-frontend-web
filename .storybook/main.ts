import path from 'path';
import { fileURLToPath } from 'url';

import type { StorybookConfig } from '@storybook/nextjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-styling-webpack',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    const fileLoaderRule = config.module?.rules?.find((rule: any) =>
      rule.test?.test?.('.svg'),
    ) as any;

    if (config.module?.rules) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // Handle *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule?.issuer,
          resourceQuery: {
            not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/],
          }, // Exclude *.svg?url
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

      if (fileLoaderRule) {
        fileLoaderRule.exclude = /\.svg$/i;
      }
    }

    return config;
  },
};
export default config;
