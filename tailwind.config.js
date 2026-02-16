/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './pages/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#b91c1c',
        'primary-light': '#fef2f2',
        secondary: '#7f1d1d',
        accent: '#fef2f2',
        dark: '#0f172a',
        surface: '#fafafa',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.04)',
        card: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
