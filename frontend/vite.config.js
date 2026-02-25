import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindConfig from '../admin/tailwind.config'

// https://vite.dev/config/
export default defineConfig({
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      
  },
  },

  plugins: [react(),
    tailwindConfig,
  ],
server:{port:5173}
})
