/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B3A4B',
        'primary-light': '#2A5568',
        accent: '#E8A838',
        success: '#2D936C',
        warning: '#D4853A',
        danger: '#C44536',
        dark: '#1A1A2E',
        surface: '#F5F3EF',
        hover: '#EDE9E3',
        border: '#D8D5CE',
        'border-light': '#E8E5DF',
        'light-bg': '#F5F3EF',
        'text-secondary': '#5A6275',
        'text-muted': '#8B93A5',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(27, 58, 75, 0.08)',
        soft: '0 1px 3px rgba(27, 58, 75, 0.06)',
        header: '0 1px 3px rgba(27, 58, 75, 0.06)',
      },
    },
  },
  plugins: [],
};
