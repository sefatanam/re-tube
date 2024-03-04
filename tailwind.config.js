const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      ...fontFamily,
      "sans": ["SF Pro Display", "system-ui", "sans-serif", ...fontFamily.sans]
    },
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          A100: "var(--primary-A100)",
          A200: "var(--primary-A200)",
          A400: "var(--primary-A400)",
          A700: "var(--primary-A700)",
        },
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
          A100: "var(--accent-A100)",
          A200: "var(--accent-A200)",
          A400: "var(--accent-A400)",
          A700: "var(--accent-A700)",
        },
        warn: {
          50: "var(--warn-50)",
          100: "var(--warn-100)",
          200: "var(--warn-200)",
          300: "var(--warn-300)",
          400: "var(--warn-400)",
          500: "var(--warn-500)",
          600: "var(--warn-600)",
          700: "var(--warn-700)",
          800: "var(--warn-800)",
          900: "var(--warn-900)",
          A100: "var(--warn-A100)",
          A200: "var(--warn-A200)",
          A400: "var(--warn-A400)",
          A700: "var(--warn-A700)",
        },
        background: "var(--bg-color)"
      }
    },
  },
  plugins: [],
}

// greenish: '#DEE8E0',
//       black: '#191919',
//       gray: '#e7e7e7',
//       white: '#fff',
//       red: '#bf1316',
//       dark_gray: '#808080'