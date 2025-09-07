import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'black-gold': {
          50: '#f8f5f0',
          100: '#f0e6d2',
          200: '#e6d4a7',
          300: '#d4b575',
          400: '#c19b52',
          500: '#b0863d',
          600: '#9a6f2f',
          700: '#825c27',
          800: '#6a4a1f',
          900: '#54391a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config