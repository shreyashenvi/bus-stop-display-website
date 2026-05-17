/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Exo 2"', 'sans-serif'],
        'mono': ['"Share Tech Mono"', 'monospace'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        'city': {
          50:  '#edfcff',
          100: '#d6f7ff',
          200: '#a5eeff',
          300: '#63e2ff',
          400: '#1acff5',
          500: '#00b3dc',
          600: '#0090b9',
          700: '#007296',
          800: '#065e7a',
          900: '#0a4e67',
          950: '#062f42',
        },
        'amber': {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 179, 220, 0.5)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.5)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.5)',
      }
    },
  },
  plugins: [],
}
