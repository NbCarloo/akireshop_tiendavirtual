/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff0f3',
          100: '#ffd6de',
          200: '#ffadc0',
          300: '#ff85a1',
          400: '#ff5c82',
          500: '#e63363',
          600: '#c4284f',
          700: '#9e1f3e',
          800: '#78162d',
          900: '#520d1e',
        },
      },
    },
  },
  plugins: [],
};
