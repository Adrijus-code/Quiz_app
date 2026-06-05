import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Tenzies/', 
  build: {
    outDir: 'docs', // Tells Vite to put files in a folder named docs
  }
})
