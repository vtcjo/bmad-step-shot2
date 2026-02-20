import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx,js}',
    './components/**/*.{ts,tsx,js}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;