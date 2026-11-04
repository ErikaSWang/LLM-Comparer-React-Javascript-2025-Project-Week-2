import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 1000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    allowedHosts: ['24a71f17-8f6b-4aca-8642-80868fc4d8a0-00-x3o40khctgby.riker.replit.dev', 'React2025w2-ESWang.replit.app', 'ai.erikawang.com', 'api.perplexity.ai/v1/agent', 'api.openai.com/v1/responses', 'api.x.ai/v1/chat/completions']
  }
})