import html2canvas, { Options } from "html2canvas";

/**
 * Renders an image of the chat messages to the minimap container using html2canvas.
 * The canvas the image is in is resized to match the minimap size.
 *
 * @param minimapRef - The ref to the minimap container element.
 * @param elementToRender - The element to render as a minimap containing chat messages.
 * @returns A Promise that resolves to void.
 */
async function renderMinimapImage(
  minimap: HTMLDivElement,
  elementToRender: HTMLElement
): Promise<void> {
  // Create canvas containing chat elements using html2canvas
  const renderOptions: Partial<Options> = {
    onclone: (_, element) => {
      // Remove all horizontal margins
      element.querySelectorAll("*").forEach((k) => {
        const j = k as HTMLElement;
        j.style.marginLeft = "0px";
        j.style.marginRight = "0px";
      });
      element.style.width = "fit-content";
      // Color user chat white
      element
        .querySelectorAll('[data-message-author-role="user"]')
        .forEach((k) => {
          const j = k as HTMLElement;
          j.style.backgroundColor = "white";
        });
    },
    ignoreElements: (element) => element.classList.contains("top-0"), // ignores nav bar
    scrollX: 0,
    scrollY: 0,
    scale: 0.5, // makes it less/more blurry
    // foreignObjectRendering: true, // very glitchy, try in future when they fix
    backgroundColor: "#212121", // depends on dark/light mode
  };
  const canvas = await html2canvas(elementToRender, renderOptions);

  // Append canvas to minimap div
  minimap.innerHTML = "";
  minimap.appendChild(canvas);

  // Scale canvas to fit within minimap
  const scale = minimap.offsetWidth / canvas.offsetWidth;
  canvas.style.width = `${minimap.offsetWidth}px`;
  canvas.style.height = `${scale * canvas.offsetHeight}px`;
}

/**
 * Queries the chat container element in the DOM.
 * @returns The chat container element if found, otherwise null.
 */
function queryChatContainer(): HTMLElement | null {
  let firstChatMessage: HTMLElement | null = null;
  let chatMessageContainer: HTMLElement | null = null;
  firstChatMessage = document.querySelector(
    '[data-testid^="conversation-turn-"]'
  );
  if (firstChatMessage) {
    chatMessageContainer = firstChatMessage.parentElement;
  }
  return chatMessageContainer;
}

/**
 * Wrapper function whic first querys the chat container then
 * renders it as an image to the minimap container.
 *
 * @param minimapRef - The ref object for the minimap container.
 */
export function rerenderMinimap(minimapRef: React.RefObject<HTMLDivElement>) {
  const chatContainer: HTMLElement | null = queryChatContainer();
  const minimap: HTMLDivElement | null = minimapRef.current;
  if (!chatContainer || !minimap) {
    return;
  }
  renderMinimapImage(minimap, chatContainer);
}
