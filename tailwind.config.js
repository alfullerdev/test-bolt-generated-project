/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF512F',
        secondary: '#DD2476',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #FF512F, #DD2476)',
      }
    },
  },
  plugins: [],
};
