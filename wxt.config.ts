import { defineConfig, WxtViteConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", '@wxt-dev/auto-icons'],
  manifest: {
    name: "Chat GPS: chat outline for navigating Chat GPT",
    permissions: ['storage'],
    "commands": {
      "toggle-ui": {
        "suggested_key": {
          "default": "Ctrl+Shift+K",
          "mac": "Command+Shift+K"
        },
        "description": "Toggle UI state"
      }
    }
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