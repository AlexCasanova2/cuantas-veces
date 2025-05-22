/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B6FF6C', // verde lima
        accent: '#A259FF',  // violeta
        grayLight: '#F5F6FA',
        grayText: '#B0B0B0',
        dark: '#23262F',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 24px 0 rgba(34, 34, 34, 0.08)',
      },
    },
  },
  plugins: [],
} 