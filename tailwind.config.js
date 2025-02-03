import { theme } from './src/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryBlue: theme.colors.primaryBlue,
        primaryPurple: theme.colors.primaryPurple,
        secondaryBlue: theme.colors.secondaryBlue,
        secondaryPurple: theme.colors.secondaryPurple,
        accentRed: theme.colors.accentRed,
        gray: theme.colors.gray,
        white: theme.colors.white,
      },
      animation: theme.extend.animation,
      keyframes: theme.extend.keyframes,
    },
  },
  plugins: [],
};