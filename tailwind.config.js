/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // sans: ["var(--font-inter)"],
        // mono: ["var(--font-roboto-mono)"],
      },
    },
  },
  plugins: [],
}