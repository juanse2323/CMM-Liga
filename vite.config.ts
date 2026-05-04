import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_VERCEL === '1' ? '/' : '/CMM-Liga/'
  
  return {
    base,
    plugins: [inspectAttr(), react()],
    server: { port: 3000 },
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  }
});
