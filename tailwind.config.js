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
          green: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
            950: '#022C22',
          },
          pink: {
            50: '#FFF1F2',
            100: '#FFE4E6',
            200: '#FECDD3',
            300: '#FDA4AF',
            400: '#FB7185',
            500: '#F43F5E',
            600: '#E11D48',
            700: '#BE123C',
            800: '#9F1239',
            900: '#881337',
            950: '#4C0519',
          },
          mint: {
            50: '#F2FBF7',
            100: '#E2F7EE',
            200: '#C2EEDC',
            500: '#14B8A6',
          },
          rose: {
            50: '#FFF5F6',
            100: '#FFE9EC',
            500: '#F43F5E',
          },
          neutral: {
            bg: '#FAFCFA',
            card: '#FFFFFF',
            border: '#E3ECE6',
            muted: '#64748B',
            dark: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '2xs': '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
        'soft-green': '0 4px 20px -2px rgba(16, 185, 129, 0.16)',
        'soft-pink': '0 4px 20px -2px rgba(244, 63, 94, 0.16)',
        'card-elevated': '0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(227, 236, 230, 0.8)',
        'card-hover': '0 20px 35px -10px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
