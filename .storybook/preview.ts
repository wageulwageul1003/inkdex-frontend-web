import type { Preview } from '@storybook/nextjs-vite';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    options: {
      storySort: {
        order: ['Design System', ['Fonts', 'Colors', 'Shadows']],
      },
    },
  },
};

export default preview;
