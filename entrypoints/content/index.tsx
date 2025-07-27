import { ContentScriptContext } from "#imports";
import { createRoot, Root } from "react-dom/client";
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

let root: null | Root = null
let wrapper: null | HTMLElement = null
function defineOverlay(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "react-overlay",
    position: "inline",
    anchor: "body",
    //"header :nth-child(3)",
    onMount(container, shadowRoot, shadowHost) {

      if (root) {
        root.unmount();
      }
      if (wrapper) {
        wrapper.remove();
      }

      // Don't mount react app directly on <body>
      wrapper = document.createElement("div");
      container.append(wrapper);


      const shadowHtml = shadowRoot.querySelector("html")
      if (shadowHtml) {


        shadowHtml.style.pointerEvents = "none";
        shadowHtml.style.zIndex = "9999999";
        const shadowBody = shadowHtml.querySelector("body")
        if (shadowBody) {
          shadowBody.style.pointerEvents = "all"
          console.log(shadowBody.childNodes)
          // to prevent duplicates
          if (shadowBody.childNodes.length > 1) {
            // shadowBody.childNodes[1].remove()
          }
        }
      }


      root = createRoot(wrapper);
      root.render(<App />);
    },
    onRemove: (elements) => {
      if (root) {
        root.unmount();
      }
      if (wrapper) {
        wrapper.remove();
      }
    },
  });
}