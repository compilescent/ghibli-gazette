/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        bg2: '#111118',
        bg3: '#18181F',
        card: '#141419',
        border: '#222230',
        border2: '#2A2A3A',
        red: '#E8392A',
        red2: '#FF4D3D',
        gold: '#F5C842',
        blue: '#4A8FE8',
        green: '#2ECC71',
        text: '#F0EEE8',
        text2: '#9896A8',
        text3: '#5A5868',
        'cat-ghibli-news': '#667eea',
        'cat-new-release': '#E8392A',
        'cat-review': '#2ECC71',
        'cat-premiere': '#C94FAE',
        'cat-general': '#4A8FE8',
        'cat-anime-news': '#FF6B35',
        'cat-manga-news': '#9B59B6',
        'cat-industry': '#1ABC9C',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif']
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '6px',
        badge: '3px',
        btn: '6px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.4)',
        hover: '0 8px 24px rgba(232,57,42,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    }
  },
  plugins: []
}