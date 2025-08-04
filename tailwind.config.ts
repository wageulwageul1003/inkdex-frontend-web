/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import tailwindcss_animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      screens: {},
    },
    screens: {
      sm: '360px',
      md: '768px',
      lg: '1280px',
    },
    extend: {
      fontFamily: {
        wantedSans: ['var(--font-wantedSans)', 'wantedSans'],
      },
      colors: {
        black: 'rgba(var(--black), <alpha-value>)',
        white: 'rgba(var(--white), <alpha-value>)',
      },
      keyframes: {
        scale: {
          '0%': {
            transform: 'scale(0.7)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
    },
  },

  plugins: [tailwindcss_animate, require('@xpd/tailwind-3dtransforms')],
};
export default config;
