import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubActions = (globalThis as unknown as {
  process?: { env?: Record<string, string | undefined> }
}).process?.env?.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGitHubActions ? '/koharu-after-rain/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          effects: ['@react-three/postprocessing'],
        },
      },
    },
  },
})
