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
        primary: "#0df20d",
        "primary-dark": "#0bb50b",
        "background-light": "#f5f8f5",
        "background-dark": "#102210", 
        "card-dark": "#1b271b",
        "border-dark": "#283928",
        "text-muted": "#9cba9c",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "mono": ["monospace"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem", 
        "lg": "0.5rem", 
        "xl": "0.75rem", 
        "2xl": "1rem", 
        "full": "9999px"
      },
    },
  },
  plugins: [],
}