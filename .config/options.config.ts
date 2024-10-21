import { defineConfig, mergeConfig } from 'vite'
import baseConfig from '../vite.config.base'

// https://vitejs.dev/config/
export default mergeConfig(
  baseConfig,
  defineConfig({
  build: {
    outDir: "build/options/",
    rollupOptions: {
        input: {
            options: "options.html"
        }
    }
  }
})
)
