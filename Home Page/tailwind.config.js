/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5efd6',
        tan: '#d4b896',
        parchment: '#e8d5b0',
        brown: {
          100: '#e8d5c0',
          200: '#c9a87a',
          300: '#a67b5b',
          400: '#8b6347',
          500: '#6b4a32',
          600: '#4e3320',
          DEFAULT: '#a67b5b',
        },
        forest: {
          100: '#d4e8c0',
          200: '#9ec47a',
          300: '#6a9e47',
          400: '#4a7a2e',
          500: '#3d5e2a',
          600: '#2d4a1e',
          DEFAULT: '#3d5e2a',
        },
        sage: {
          100: '#e8f0dc',
          200: '#c8daaa',
          300: '#a3bf78',
          400: '#7a9e5f',
          500: '#5c7d45',
          DEFAULT: '#7a9e5f',
        },
        otter: {
          dark: '#5c3d1e',
          mid: '#8b6347',
          light: '#c9a87a',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
