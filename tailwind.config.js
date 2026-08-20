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
        'bg-primary': '#0A0A0F',
        'bg-secondary': '#111118',
        'bg-card': '#16161F',
        'bg-elevated': '#1E1E2A',
        'border-default': '#2A2A38',
        'border-light': '#333344',
        accent: '#E8643A',
        'accent-hover': '#F07550',
        'accent-2': '#6C8EF5',
        gold: '#F0C040',
        'text-primary': '#F0EEE8',
        'text-secondary': '#9896A8',
        'text-muted': '#5A5868',
        'ghibli-green': '#2D6A4F',
        'ghibli-sky': '#87CEEB',
        night: "#0A0A0F",
        amber: "#E8643A",
        cream: "#F0EEE8",
        muted: "#9896A8",
        dim: "#1E1E2A"
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        baskerville: ['var(--font-baskerville)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-baskerville)', 'Georgia', 'serif'],
        display: ['var(--font-baskerville)', 'Georgia', 'serif']
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '8px',
        badge: '4px',
        btn: '6px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.4)',
        hover: '0 8px 24px rgba(0,0,0,0.5)',
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
