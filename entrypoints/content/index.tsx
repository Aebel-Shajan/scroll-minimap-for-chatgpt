import { ContentScriptContext } from "#imports";
import { createRoot } from "react-dom/client";
import "./reset.css";
import App from "./App.tsx";

export default defineContentScript({
  matches: ["https://chatgpt.com/*"],
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

function defineOverlay(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "react-overlay",
    position: "inline",
    anchor: "header :nth-child(3)",
    onMount(container, shadowRoot, shadowHost) {

      // Don't mount react app directly on <body>
      const wrapper = document.createElement("div");
      container.append(wrapper);


      const shadowHtml = shadowRoot.querySelector("html")
      if (shadowHtml) {


        shadowHtml.style.pointerEvents = "none";
        shadowHtml.style.zIndex = "9999999";
        const shadowBody = shadowHtml.querySelector("body")
        if (shadowBody) {
          shadowBody.style.pointerEvents = "all"
          // to prevent duplicates
          if (shadowBody.childNodes.length > 1) {
            while (shadowBody.childNodes.length > 1) {
              shadowBody.removeChild(shadowBody.lastChild!);
            }
          }
        }
      }


      const root = createRoot(wrapper);
      root.render(<App />);
      return { root, wrapper };
    },
    onRemove: (elements) => {
      elements?.root.unmount();
      elements?.wrapper.remove();
    },
  });
}