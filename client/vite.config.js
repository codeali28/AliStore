import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Install `@types/node` if using TypeScript

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Maps '@' to the 'src' directory
    },
  },
})
