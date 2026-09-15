/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        football: {
          navy: '#0f172a',
          purple: '#6366f1',
          blue: '#3b82f6',
          green: '#22c55e',
          red: '#ef4444',
          orange: '#f97316',
          light: '#f8fafc',
          dark: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
