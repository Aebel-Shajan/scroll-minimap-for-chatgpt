import { ContentScriptContext } from "#imports";
import { createRoot, Root } from "react-dom/client";
import "./reset.css";
import App from "./App.tsx";
import { MAX_Z_INDEX } from "@/lib/constants.ts";

export default defineContentScript({
  matches: [
    "https://chatgpt.com/*",
    "https://gemini.google.com/*",
    "https://claude.ai/*"
  ],
  excludeMatches: ["https://chatgpt.com/codex/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await defineOverlay(ctx);

    // Mount initially
    ui.mount();

    // Re-mount when page changes
    ctx.addEventListener(window, "wxt:locationchange", (event) => {
      ui.mount();
    });
  },
});

let root: null | Root = null
let wrapper: null | HTMLElement = null
function defineOverlay(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "react-overlay",
    position: "overlay",
    anchor: "body",
    //"header :nth-child(3)",
    onMount(container, shadowRoot) {

      if (root) {
        root.unmount();
      }
      if (wrapper) {
        wrapper.remove();
      }

      // Don't mount react app directly on <body>
      wrapper = document.createElement("div");
      wrapper.style.zIndex = `${MAX_Z_INDEX}`;
      container.append(wrapper);

      const shadowHtml = shadowRoot.querySelector("html")
      if (shadowHtml) {
        shadowHtml.style.pointerEvents = "none";
        shadowHtml.style.zIndex = `${MAX_Z_INDEX}`;
        const shadowBody = shadowHtml.querySelector("body")
        if (shadowBody) {
          shadowBody.style.pointerEvents = "all"
        }
      }

      root = createRoot(wrapper);
      root.render(
        <ThemeProvider wrapperRoot={wrapper}>
          <App />
        </ThemeProvider>
      );
    },
    onRemove: () => {
      if (root) {
        root.unmount();
      }
      if (wrapper) {
        wrapper.remove();
      }
    },
  });
}