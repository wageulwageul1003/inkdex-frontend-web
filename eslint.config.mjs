// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import momentiEslintConfig from 'momenti-eslint';

export default [
  ...momentiEslintConfig,

  // 🔥 Storybook 파일에서는 타입 기반 ESLint 검사 비활성화
  {
    files: ['.storybook/**/*.{js,jsx,ts,tsx}', '**/*.stories.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: null, // <--- 이게 핵심! typed-linting OFF
      },
    },
  },

  ...storybook.configs['flat/recommended'],
];
