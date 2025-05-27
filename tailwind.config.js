module.exports = {
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
          DEFAULT: '#2563eb', 
          light: '#60a5fa',
        },
        background: '#ffffff',
        foreground: '#171717',
        primary: {
          DEFAULT: '#2563eb',
          light: '#60a5fa',
        },
        secondary: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
        },
        accent: {
          DEFAULT: '#f43f5e',
          light: '#fda4af',
        },
      },
    },
  },
};