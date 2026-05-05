/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#8b5cf6',
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        // Emil Kowalski easing curves
        'out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-expo': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
      animation: {
        // Entry: starts from scale(0.95) + opacity 0 — never from nothing
        'fade-in': 'fadeIn 0.22s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-in-up': 'fadeInUp 0.28s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'modal-in': 'modalIn 0.22s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'slide-in-right': 'slideInRight 0.28s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'slide-in-up': 'slideInUp 0.28s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'blob': 'blob 7s infinite',
        // Stagger helpers
        'stagger-1': 'fadeInUp 0.28s 0ms cubic-bezier(0.23, 1, 0.32, 1) both',
        'stagger-2': 'fadeInUp 0.28s 50ms cubic-bezier(0.23, 1, 0.32, 1) both',
        'stagger-3': 'fadeInUp 0.28s 100ms cubic-bezier(0.23, 1, 0.32, 1) both',
        'stagger-4': 'fadeInUp 0.28s 150ms cubic-bezier(0.23, 1, 0.32, 1) both',
      },
      keyframes: {
        // Scale from 0.97 not 0 — nothing in the real world appears from nothing
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // Modals enter from center, scale from 0.95
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
