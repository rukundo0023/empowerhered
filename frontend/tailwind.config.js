/** @type {import('tailwindcss').Config} */

export default {

  content: [

    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",

  ],

  theme: {

    extend: {

      colors: {

        primary: {

          50: '#f5f3ff',

          100: '#ede9fe',

          200: '#ddd6fe',

          300: '#c4b5fd',

          400: '#a78bfa',

          500: '#8b5cf6',

          600: '#7c3aed',

          700: '#6d28d9',

          800: '#5b21b6',

          900: '#4c1d95',

        },

        secondary: {

          50: '#fdf2f8',

          100: '#fce7f3',

          200: '#fbcfe8',

          300: '#f9a8d4',

          400: '#f472b6',

          500: '#ec4899',

          600: '#db2777',

          700: '#be185d',

          800: '#9d174d',

          900: '#831843',

        },

        accent: {

          50: '#ecfdf5',

          100: '#d1fae5',

          200: '#a7f3d0',

          300: '#6ee7b7',

          400: '#34d399',

          500: '#10b981',

          600: '#059669',

          700: '#047857',

          800: '#065f46',

          900: '#064e3b',

        },

        neutral: {

          50: '#f8fafc',

          100: '#f1f5f9',

          200: '#e2e8f0',

          300: '#cbd5e1',

          400: '#94a3b8',

          500: '#64748b',

          600: '#475569',

          700: '#334155',

          800: '#1e293b',

          900: '#0f172a',

        },

      },

      fontFamily: {

        sans: ['Inter', 'sans-serif'],

      },

      fontSize: {

        'xs': ['0.75rem', { lineHeight: '1rem' }],

        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],

        'base': ['0.875rem', { lineHeight: '1.375rem' }],

        'lg': ['0.9375rem', { lineHeight: '1.5rem' }],

        'xl': ['1rem', { lineHeight: '1.5rem' }],

        '2xl': ['1.125rem', { lineHeight: '1.5rem' }],

        '3xl': ['1.25rem', { lineHeight: '1.75rem' }],

        '4xl': ['1.5rem', { lineHeight: '2rem' }],

        '5xl': ['1.875rem', { lineHeight: '2.25rem' }],

        '6xl': ['2.25rem', { lineHeight: '2.5rem' }],

      },

    },

  },

  plugins: [],

}
