import html2canvas, { Options } from "html2canvas";

/**
 * Renders an image of the chat messages to the minimap container using html2canvas.
 * The canvas the image is in is resized to match the minimap size.
 *
 * @param minimapRef - The ref to the minimap container element.
 * @param elementToRender - The element to render as a minimap containing chat messages.
 * @returns A Promise that resolves to void.
 */
export async function generateMinimapCanvas(
  elementToRender: HTMLElement
): Promise<HTMLCanvasElement> {
  const backgroundColor = getComputedStyle(document.body).backgroundColor;

  // Create canvas containing chat elements using html2canvas
  const renderOptions: Partial<Options> = {
    onclone: (_, element) => {
      // Remove all horizontal margins
      let chatWidth = 0;
      element.querySelectorAll(".mx-auto").forEach((k) => {
        const j = k as HTMLElement;
        j.style.marginLeft = "0px";
        j.style.marginRight = "0px";
        chatWidth = j.offsetWidth;
      });
      element.style.width = `${chatWidth}px`;
      if (chatWidth === 0) {
        element.style.width = "fit-content";
      }
      // Color user chat white
      element
        .querySelectorAll('[data-message-author-role="user"]')
        .forEach((k) => {
          const j = k as HTMLElement;
          j.style.backgroundColor = "#7cffd1";
        });
    },
    ignoreElements: (element) => element.classList.contains("top-0"), // ignores nav bar
    scrollX: 0,
    scrollY: 0,
    scale: 0.2, // makes it less/more blurry
    // foreignObjectRendering: true, // very glitchy, try in future when they fix
    backgroundColor: backgroundColor ? backgroundColor : "grey", // depends on dark/light mode
  };
  return html2canvas(elementToRender, renderOptions);
}

/**
 * Queries the chat container element in the DOM.
 * @returns The chat container element if found, otherwise null.
 */
export function queryChatContainer(): HTMLElement | null {
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

export function queryChatScrollContainer(): HTMLElement | null {
  let chatMessageContainer: HTMLElement | null = null;
  let chatScrollContainer: HTMLElement | null = null;
  chatMessageContainer = queryChatContainer();
  if (chatMessageContainer) {
    chatScrollContainer = chatMessageContainer.parentElement;
  }
  return chatScrollContainer;
}

export function queryAllChatElements(): HTMLElement[] {
  return [...document.querySelectorAll('[data-testid^="conversation-turn-"]')] as HTMLElement[];
}

export function queryNavElement(): HTMLElement| null {
  const chatContainer = queryChatContainer();
  if (!chatContainer|| chatContainer.childNodes.length === 0) return null
  return chatContainer.childNodes[0] as HTMLElement;
}

export function queryNextElement(): HTMLElement | null {
  // Calculate scroll pos of closest next chat
  const scrollContainer = queryChatScrollContainer();
  const navElement = queryNavElement();
  if (!scrollContainer || !navElement) return null;
  const navHeight = navElement.offsetHeight;
  const chatElements = queryAllChatElements();
  const nextChats = chatElements.filter((element) => {
    return element.getBoundingClientRect().top > 1.1 * navHeight;
  });
  if (nextChats.length === 0) return null;
  return nextChats[0];
}

export function queryPreviousElement(): HTMLElement | null {
  // Calculate scroll pos of closest previous chat
  const navElement = queryNavElement();
  if (!navElement) return null;
  const navHeight = navElement.offsetHeight;
  const chatElements = queryAllChatElements();
  const previousChats = chatElements.filter((element) => {
    return element.getBoundingClientRect().top < navHeight;
  });
  if (previousChats.length === 0) return null;
  return previousChats[previousChats.length - 1];
}

export const onNextChat = (smoothScroll: boolean) => {
  const scrollContainer = queryChatScrollContainer();
  if (!scrollContainer) return null;
  const navElement = queryNavElement();
  if (!navElement) return null;
  const nextChat = queryNextElement()
  let scrollPos = scrollContainer.scrollHeight
  if (nextChat){
    scrollPos = scrollContainer.scrollTop +
    nextChat.getBoundingClientRect().top -
    navElement.offsetHeight
  }

  // Configure scroll options
  const scrollOptions: ScrollToOptions= {
    top: scrollPos,
    behavior: "instant"
  }
  if (smoothScroll) {
    scrollOptions["behavior"] = "smooth"
  }

  // Scroll scrollContainer
  scrollContainer.scrollTo(scrollOptions);
};

export const onPreviousChat = (smoothScroll: boolean) => {
  const scrollContainer = queryChatScrollContainer();
  if (!scrollContainer) return null;
  const navElement = queryNavElement();
  if (!navElement) return null;
  const previousChat = queryPreviousElement()
  let scrollPos = 0
  if (previousChat){
    scrollPos = scrollContainer.scrollTop +
      previousChat.getBoundingClientRect().top -
      navElement.offsetHeight
  }

  // Configure scroll options
  const scrollOptions: ScrollToOptions = {
    top: scrollPos,
    behavior: "instant"
  }
  if (smoothScroll) {
    scrollOptions["behavior"] = "smooth"
  }

  // Scroll container
  scrollContainer.scrollTo(scrollOptions);
};
