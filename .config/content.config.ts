import { defineConfig, mergeConfig } from 'vite'
import baseConfig from '../vite.config.base'

// https://vitejs.dev/config/
export default mergeConfig(
  baseConfig,
  defineConfig({
  build: {
    outDir: "build/content/",
    rollupOptions: {
        input: {
            content: "src/features/content/index.tsx"
        }
    }
  }
})
)
