// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import momentiEslintConfig from 'momenti-eslint';

export default [
  ...momentiEslintConfig,
  {
    files: ['.storybook/**/*.{js,jsx,ts,tsx}', '**/*.stories.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },

  ...storybook.configs['flat/recommended'],
];
