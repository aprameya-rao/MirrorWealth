import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme - Black/Orange-Red
        background: '#000000',
        foreground: '#FFFFFF',
        'bg-dark': '#0A0A0A',
        'bg-card': '#111111',
        border: '#222222',
        'accent-primary': '#ff3c00',
        'accent-secondary': '#ff9100',
        'success': '#00FF88',
        'danger': '#FF3366',
        'text-secondary': '#AAAAAA',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': '32px',
        'display': '24px',
        'heading': '20px',
        'subheading': '18px',
        'body': '14px',
        'small': '12px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
