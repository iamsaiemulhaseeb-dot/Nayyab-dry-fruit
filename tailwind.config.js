/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          600: '#16a34a',
          700: '#15803d',
          800: '#064e3b',
          900: '#022c22',
          950: '#011c16',
        },
        gold: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        nastaliq: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(6, 78, 59, 0.15)',
        'luxury-gold': '0 20px 40px -15px rgba(217, 119, 6, 0.25)',
      }
    },
  },
  plugins: [],
}

