/** @type {import('tailwindcss').Config} */
// Tokens mirror src/styles/tokens.ts — keep the two in sync.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        surface: '#F7F7F8',
        hair: '#EAEAEB',
        ink: '#000000',
        ink2: '#6B6B70',
        ink3: '#9A9AA0',
        emergency: '#D85A4A',
        clear: { bg: '#E8F2EC', text: '#2D6A4F', pin: '#5FB97D' },
        low: { bg: '#EAF1F8', text: '#3F6B96', pin: '#9EC1E4' },
        moderate: { bg: '#FBF1DC', text: '#8A6B2A', pin: '#F4D78F' },
        high: { bg: '#FBE3D9', text: '#A14A2E', pin: '#F2A593' },
        critical: { bg: '#F4D5D2', text: '#8B2F2F', pin: '#D88A87' },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '14px',
        xl: '16px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        title: '-0.015em',
        display: '-0.025em',
      },
      fontSize: {
        micro: ['11px', { lineHeight: '14px', letterSpacing: '0.06em' }],
        caption: ['13px', { lineHeight: '18px' }],
        body: ['15px', { lineHeight: '21px' }],
        bodylg: ['17px', { lineHeight: '23px' }],
        title: ['22px', { lineHeight: '27px', letterSpacing: '-0.015em' }],
        display: ['32px', { lineHeight: '36px', letterSpacing: '-0.025em' }],
      },
    },
  },
  plugins: [],
}
