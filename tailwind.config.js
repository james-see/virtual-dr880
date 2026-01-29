/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'dr880': {
          'panel': '#2a2a2a',
          'dark': '#1a1a1a',
          'accent': '#ff6600',
          'lcd-bg': '#4a5c3a',
          'lcd-text': '#1a2a0a',
          'pad': '#333333',
          'pad-active': '#ff6600',
        }
      },
      fontFamily: {
        'lcd': ['Courier New', 'monospace'],
        'panel': ['Arial', 'sans-serif'],
      },
      boxShadow: {
        'pad': 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.1)',
        'pad-pressed': 'inset 0 4px 8px rgba(0,0,0,0.8)',
        'knob': '0 4px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)',
      }
    },
  },
  plugins: [],
}
