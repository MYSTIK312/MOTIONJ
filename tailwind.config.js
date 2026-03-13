/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'apple-blue':    '#0071E3',
        'apple-blue-h':  '#0077ED',
        'apple-gray':    '#6E6E73',
        'apple-light':   '#F5F5F7',
        'apple-mid':     '#E8E8ED',
        'apple-dark':    '#1D1D1F',
      },
      fontFamily: {
        sans: ['-apple-system','BlinkMacSystemFont','"SF Pro Display"','"Helvetica Neue"','Arial','sans-serif'],
      },
      animation: {
        'spin-slow':   'spin 10s linear infinite',
        'spin-medium': 'spin 5s linear infinite',
        'float':       'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
}
