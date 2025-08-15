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
        gray: {
          100: 'rgba(var(--gray-100), <alpha-value>)',
          200: 'rgba(var(--gray-200), <alpha-value>)',
          300: 'rgba(var(--gray-300), <alpha-value>)',
          400: 'rgba(var(--gray-400), <alpha-value>)',
          500: 'rgba(var(--gray-500), <alpha-value>)',
          600: 'rgba(var(--gray-600), <alpha-value>)',
          700: 'rgba(var(--gray-700), <alpha-value>)',
        },
        red: {
          '100': 'rgba(var(--red-100), <alpha-value>)',
          '200': 'rgba(var(--red-200), <alpha-value>)',
          '300': 'rgba(var(--red-300), <alpha-value>)',
          '400': 'rgba(var(--red-400), <alpha-value>)',
          '500': 'rgba(var(--red-500), <alpha-value>)',
          '600': 'rgba(var(--red-600), <alpha-value>)',
          '700': 'rgba(var(--red-700), <alpha-value>)',
          '800': 'rgba(var(--red-800), <alpha-value>)',
          '900': 'rgba(var(--red-900), <alpha-value>)',
          DEFAULT: 'rgba(var(--red-600), <alpha-value>)',
        },
        green: {
          '500': 'rgba(var(--green-500), <alpha-value>)',
        },
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
