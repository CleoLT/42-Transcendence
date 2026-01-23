/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sixtyfour': ['Sixtyfour', 'sans-serif'],
        'corben': ['Corben', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
