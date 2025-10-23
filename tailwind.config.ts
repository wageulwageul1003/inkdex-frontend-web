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
        SpoqaHanSansNeo: ['var(--font-SpoqaHanSansNeo)', 'SpoqaHanSansNeo'],
      },
      colors: {
        black: 'rgba(var(--black), <alpha-value>)',
        white: 'rgba(var(--white), <alpha-value>)',
        gray: {
          '01': 'rgba(var(--gray-01), <alpha-value>)',
          '02': 'rgba(var(--gray-02), <alpha-value>)',
          '03': 'rgba(var(--gray-03), <alpha-value>)',
          '04': 'rgba(var(--gray-04), <alpha-value>)',
          '05': 'rgba(var(--gray-05), <alpha-value>)',
          '06': 'rgba(var(--gray-06), <alpha-value>)',
          '07': 'rgba(var(--gray-07), <alpha-value>)',
          '08': 'rgba(var(--gray-08), <alpha-value>)',
          '09': 'rgba(var(--gray-09), <alpha-value>)',
          '10': 'rgba(var(--gray-10), <alpha-value>)',
        },
        sand: {
          '01': 'rgba(var(--sand-01), <alpha-value>)',
          '02': 'rgba(var(--sand-02), <alpha-value>)',
          '03': 'rgba(var(--sand-03), <alpha-value>)',
          '04': 'rgba(var(--sand-04), <alpha-value>)',
          '05': 'rgba(var(--sand-05), <alpha-value>)',
          '06': 'rgba(var(--sand-06), <alpha-value>)',
          '07': 'rgba(var(--sand-07), <alpha-value>)',
          '08': 'rgba(var(--sand-08), <alpha-value>)',
          '09': 'rgba(var(--sand-09), <alpha-value>)',
          '10': 'rgba(var(--sand-10), <alpha-value>)',
        },
        blue: {
          '01': 'rgba(var(--blue-01), <alpha-value>)',
          '02': 'rgba(var(--blue-02), <alpha-value>)',
          '03': 'rgba(var(--blue-03), <alpha-value>)',
          '04': 'rgba(var(--blue-04), <alpha-value>)',
          '05': 'rgba(var(--blue-05), <alpha-value>)',
          '06': 'rgba(var(--blue-06), <alpha-value>)',
          '07': 'rgba(var(--blue-07), <alpha-value>)',
          '08': 'rgba(var(--blue-08), <alpha-value>)',
          '09': 'rgba(var(--blue-09), <alpha-value>)',
          '10': 'rgba(var(--blue-10), <alpha-value>)',
        },
        green: {
          '01': 'rgba(var(--green-01), <alpha-value>)',
          '02': 'rgba(var(--green-02), <alpha-value>)',
          '03': 'rgba(var(--green-03), <alpha-value>)',
          '04': 'rgba(var(--green-04), <alpha-value>)',
          '05': 'rgba(var(--green-05), <alpha-value>)',
          '06': 'rgba(var(--green-06), <alpha-value>)',
          '07': 'rgba(var(--green-07), <alpha-value>)',
          '08': 'rgba(var(--green-08), <alpha-value>)',
          '09': 'rgba(var(--green-09), <alpha-value>)',
          '10': 'rgba(var(--green-10), <alpha-value>)',
        },
        red: {
          '01': 'rgba(var(--red-01), <alpha-value>)',
          '02': 'rgba(var(--red-02), <alpha-value>)',
          '03': 'rgba(var(--red-03), <alpha-value>)',
          '04': 'rgba(var(--red-04), <alpha-value>)',
          '05': 'rgba(var(--red-05), <alpha-value>)',
          '06': 'rgba(var(--red-06), <alpha-value>)',
          '07': 'rgba(var(--red-07), <alpha-value>)',
          '08': 'rgba(var(--red-08), <alpha-value>)',
          '09': 'rgba(var(--red-09), <alpha-value>)',
          '10': 'rgba(var(--red-10), <alpha-value>)',
          DEFAULT: 'rgba(var(--red-06), <alpha-value>)',
        },
        yellow: {
          '01': 'rgba(var(--yellow-01), <alpha-value>)',
          '02': 'rgba(var(--yellow-02), <alpha-value>)',
          '03': 'rgba(var(--yellow-03), <alpha-value>)',
          '04': 'rgba(var(--yellow-04), <alpha-value>)',
          '05': 'rgba(var(--yellow-05), <alpha-value>)',
          '06': 'rgba(var(--yellow-06), <alpha-value>)',
          '07': 'rgba(var(--yellow-07), <alpha-value>)',
          '08': 'rgba(var(--yellow-08), <alpha-value>)',
          '09': 'rgba(var(--yellow-09), <alpha-value>)',
          '10': 'rgba(var(--yellow-10), <alpha-value>)',
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
