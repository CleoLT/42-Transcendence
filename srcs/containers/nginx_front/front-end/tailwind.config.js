/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"

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
      colors: {
        shell: "#FFFEF4",
        yellowish: "#FDD28B",
        palePink: "#E8B0A3",
        greyish: "#C8C6B8",
        greenish: "#719a79",

        brightRed: colors.red[600],
        darkRed: colors.red[900],
      },
    },
  },
  plugins: []
}
