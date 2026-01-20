/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        corben: ["Corben", "sans-serif"],       // Regular + Bold
        sixtyfour: ["Sixtyfour", "sans-serif"], // Close style
      },
    },
  },
  plugins: []
}
