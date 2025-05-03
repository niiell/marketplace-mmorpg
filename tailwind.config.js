/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb', // biru utama
          dark: '#1e40af',
          light: '#60a5fa',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#60a5fa',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
          light: '#94a3b8',
        },
        accent: {
          DEFAULT: '#f43f5e',
          dark: '#be123c',
          light: '#fda4af',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        heading: ['"Inter"', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        smoke: {
          '0%': { opacity: '0.6', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '0.3', transform: 'translateY(-10px) scale(1.1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(1.2)' },
        },
        borderGlowGreen: {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '100%': { boxShadow: '0 0 8px 4px rgba(34, 197, 94, 0)' },
        },
        borderGlowRed: {
          '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '100%': { boxShadow: '0 0 8px 4px rgba(239, 68, 68, 0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.4,0,0.2,1)',
        smoke: 'smoke 1s ease-out forwards',
        inputValid: 'borderGlowGreen 1s ease forwards',
        inputError: 'borderGlowRed 1s ease forwards',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      animationDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },
      animationDelay: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    function ({ addUtilities, theme }) {
      const durations = theme('animationDuration');
      const delays = theme('animationDelay');
      const utilities = {};

      Object.entries(durations).forEach(([key, value]) => {
        utilities[`.animation-duration-${key}`] = {
          'animation-duration': value,
        };
      });

      Object.entries(delays).forEach(([key, value]) => {
        utilities[`.animation-delay-${key}`] = {
          'animation-delay': value,
        };
      });

      addUtilities(utilities, ['responsive', 'hover']);
    },
  ],
};
</create_file>
