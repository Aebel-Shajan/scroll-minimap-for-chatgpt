import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'react/[name].js',
        chunkFileNames: 'react/[name].js',
        assetFileNames: 'react/[name].[ext]',
      }
    }
  }
})
