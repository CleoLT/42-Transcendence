/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sixtyfour': ['Sixtyfour', 'sans-serif'],
        'corben': ['Corben', 'sans-serif'],
        'baskerville': ['"Libre Baskerville"', 'Georgia', 'serif'],
      },
      colors: {
        'start-red': '#cf2a27',
        'start-beige': '#f0e9d6',
      },
    },
  },
  plugins: [],
}
