/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#06f906", // The Neon Green
        background: {
          light: "#f5f8f5",
          dark: "#000000", // True pitch black
        },
        card: {
          dark: "rgba(18, 18, 18, 0.6)", // Glassmorphism base
        },
        border: {
          dark: "rgba(255, 255, 255, 0.1)",
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}