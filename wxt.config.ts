import { defineConfig, WxtViteConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", '@wxt-dev/auto-icons'],
  manifest: {
    name: "Chat GPS",
    permissions: ['storage'],
  },
  webExt: {
    startUrls: [
      "https://www.chat.com/"
    ]
  },
  vite: (() => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"), // or "./src" if using src directory
      },
    },
  })) as () => WxtViteConfig,
});