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
        dark: {
          950: '#070709',
          900: '#0d0d11',
          850: '#131317',
          800: '#18181f',
          750: '#202029',
          700: '#2b2b36',
          600: '#3f3f4e',
          500: '#636375',
          400: '#8e8ea0',
          300: '#b4b4c4',
          200: '#d9d9e3',
          100: '#ededf2',
        },
        wine: {
          950: '#360512',
          900: '#5c061d',
          800: '#800828',
          700: '#a30c33',
          600: '#cc103f',
          500: '#e50914',
          400: '#f03a43',
          glow: 'rgba(229, 9, 20, 0.45)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'wine-glow': '0 0 25px -5px rgba(229, 9, 20, 0.4)',
        'wine-intense': '0 0 35px 2px rgba(180, 10, 35, 0.55)',
        'card-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 15px -2px rgba(229, 9, 20, 0.25)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}

