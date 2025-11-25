import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        // Light Mode
        'light-bg': '#F7F7F7',
        'light-surface': '#FFFFFF',
        'light-text-primary': '#1D1D1F',
        'light-text-secondary': '#6E6E73',
        'light-accent': '#007AFF',
        'light-border': '#D1D1D6',

        // Dark Mode
        'dark-bg': '#131313',
        'dark-surface': '#1D1D1D',
        'dark-text-primary': '#F5F5F7',
        'dark-text-secondary': '#8A8A8E',
        'dark-accent': '#0A84FF',
        'dark-border': '#3A3A3C',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '-100% 0' },
          '50%': { backgroundPosition: '100% 0' },
        },
        'subtle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'confetti-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'subtle-float': 'subtle-float 4s ease-in-out infinite',
        'confetti-rain': 'confetti-rain 1.5s linear'
      },
      boxShadow: {
        'apple-light': '0 1px 2px rgba(0,0,0,0.05), 0 3px 8px rgba(0,0,0,0.04)',
        'apple-dark': '0 1px 2px rgba(0,0,0,0.2), 0 3px 10px rgba(0,0,0,0.25)',
      }
    },
  },
  plugins: [],
} satisfies Config
