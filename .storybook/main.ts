import path from 'path';

import type { StorybookConfig } from '@storybook/nextjs';
import type { Configuration } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (webpackConfig: Configuration) => {
    webpackConfig.resolve = {
      ...webpackConfig.resolve,
      alias: {
        ...webpackConfig.resolve?.alias,
        '@': path.resolve(__dirname, '../src'),
      },
    };
    return webpackConfig;
  },
};

export default config;
