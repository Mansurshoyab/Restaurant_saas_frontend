import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          light: '#FFEDD5',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        surface: '#FFFFFF',
        app: '#F8FAFC',
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          faint: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
};

export default config;


