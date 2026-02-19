/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#ffc929",
          200: "#ffb000",
        },
        secondary: {
          100: "#0b1a78",
          200: "#00b050",
        }
      }
    },
  },
  plugins: [],
}