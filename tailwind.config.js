/** @type {import('tailwindcss').Config} */
//
// BravoMart design tokens.
//
// Palette rationale (see DESIGN_SYSTEM.md for the full writeup): a white/paper
// base with a single deep-moss green as the trust/brand accent (verification,
// escrow, "safe to buy") and a naira-gold accent reserved for money and
// urgency (prices, flash drops). No gradients. Hairline borders instead of
// card shadows; shadows are reserved for things that float above the page
// (menus, modals, toasts).
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14181B',
          soft: '#4B5259',
          faint: '#7A828A',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          mist: '#F6F7F4',
          sunk: '#EFF1EC',
        },
        line: {
          DEFAULT: '#E3E5DF',
          strong: '#CBCFC6',
        },
        moss: {
          50: '#EEF5F0',
          100: '#D9E9DE',
          200: '#B4D4BE',
          300: '#89BB98',
          400: '#5B9E70',
          500: '#3B7F53',
          600: '#256641',
          DEFAULT: '#1F5A38',
          700: '#184A2E',
          800: '#123823',
          900: '#0C2718',
        },
        gold: {
          50: '#FBF3E4',
          100: '#F5E3BE',
          200: '#EAC781',
          300: '#DBAB4E',
          DEFAULT: '#B8791A',
          600: '#9C6714',
          700: '#7C5310',
        },
        clay: {
          50: '#FBEAE8',
          100: '#F4CDC7',
          DEFAULT: '#A93226',
          600: '#8B281E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        // Deliberately the only two shadows in the system — for things that
        // float above the page (dropdowns, modals, toasts), never for cards
        // resting in the grid.
        float: '0 8px 24px -6px rgba(20,24,27,0.14), 0 2px 6px -1px rgba(20,24,27,0.08)',
        pop: '0 20px 48px -12px rgba(20,24,27,0.22)',
      },
      maxWidth: {
        content: '1280px',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'rise-in': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.18s ease-out',
        'rise-in': 'rise-in 0.22s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scale-in 0.16s cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}