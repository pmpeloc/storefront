import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        taupe: 'var(--taupe)',
        marfil: 'var(--marfil)',
        beige: 'var(--beige)',
        crema: 'var(--crema)',
        marron: 'var(--marron)',
        'gris-taupe': 'var(--gris-taupe)',
        arena: 'var(--arena)',
        salvia: 'var(--salvia)',
        exito: 'var(--exito)',
        'rn-error': 'var(--error)',
        tx: 'var(--tx)',
        'tx-soft': 'var(--tx-soft)',
        'tx-faint': 'var(--tx-faint)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
      },
      fontFamily: {
        head: ['var(--font-head)', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '10px',
        md: '12px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        card: 'var(--sh-card)',
        frame: 'var(--sh-frame)',
      },
    },
  },
  plugins: [],
}

export default config
