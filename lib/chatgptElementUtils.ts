import { HTMLElementItem, ReactComponentMap } from "@/types";
import {
  BiLogoCPlusPlus,
  BiLogoCss3,
  BiLogoDocker,
  BiLogoHtml5,
  BiLogoJava,
  BiLogoJavascript,
  BiLogoMarkdown,
  BiLogoPhp,
  BiLogoPython,
  BiLogoReact,
  BiLogoTypescript,
  BiTerminal,
} from "react-icons/bi";
import {
  BotMessageSquare,
  Code,
  MessageSquare,
  Section,
  User,
} from "lucide-react"


/**
 * Observes the DOM for the addition or removal of an element with a specific selector.
 *
 * @param elementSelector - The selector of the element to observe.
 * @param onElementAdd - Callback function to be called when the element is added to the DOM.
 * @param onElementRemove - Callback function to be called when the element is removed from the DOM.
 * @returns A MutationObserver instance that is observing the DOM.
 */
export function elementObserver(
  elementSelector: string,
  onElementAdd: CallableFunction,
  onElementRemove: CallableFunction
): MutationObserver {
  const observer = new MutationObserver((mutationsList,) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check for added nodes
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches(elementSelector)) {
            onElementAdd(elementSelector)
          }
        });

        // Check for removed nodes
        mutation.removedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches(elementSelector)) {
            onElementRemove()
          }
        });
      }
    }
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
  return observer
}


/**
 * Creates a MutationObserver that observes changes to the child elements of a specified 
 * element. When a mutation occurs, the provided callback function is executed.
 *
 * @param {HTMLElement} elementToObserve - The element whose child elements will be 
 *  observed.
 * @param {CallableFunction} callback - The function to be called when a mutation is 
 *  observed.
 * @returns {MutationObserver} The created MutationObserver instance.
 * 
 * @remarks 🤨
 */
export function createChildObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): MutationObserver {
  const mutationObserver = new MutationObserver(function (mutations) {
    const minimapComponent = document.querySelector("#minimap-component")
    if (!minimapComponent) return
    mutations.forEach(function (mutation) {
      const targetElement = mutation.target as HTMLElement;
      if (targetElement.id === "minimap-component" || minimapComponent.contains(targetElement)) return;

      const ignoreMutation = checkIgnoreMutation(mutation)
      if (ignoreMutation) {
        return
      }

      callback()
    });
  });

  mutationObserver.observe(elementToObserve, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false,
  });
  return mutationObserver
}


/**
 * Creates a ResizeObserver to observe size changes on a given HTML element and executes
 * a callback function when a resize is detected.
 *
 * @param {HTMLElement} elementToObserve - The HTML element to observe for size changes.
 * @param {CallableFunction} callback - The callback function to execute when a resize 
 *  is detected.
 * @returns {ResizeObserver} The created ResizeObserver instance.
 */
export function createSizeObserver(
  elementToObserve: HTMLElement,
  callback: CallableFunction
): ResizeObserver {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
    }
    callback()
  });

  resizeObserver.observe(elementToObserve);
  return resizeObserver
}


function checkIgnoreMutation(mutation: MutationRecord): boolean {
  if (mutation.type !== 'childList') return false;

  for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
    if (!(node instanceof HTMLElement)) continue;

    // Check if the element is big enough
    const rect = node.getBoundingClientRect();
    if (rect.width < 80 || rect.height < 80) {
      return true;
    }
  }

  return false;
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
    chatScrollContainer = getScrollableParent(chatMessageContainer) as HTMLElement |null
  }
  return chatScrollContainer;
}

export function queryAllChatElements(): HTMLElement[] {
  const elements = [...document.querySelectorAll(
    '[data-testid^="conversation-turn-"]'
    //+ ', [data-message-author-role="user"]'
  )] as HTMLElement[];
  return elements
}

export function queryNavElement(): HTMLElement | null {
  const chatContainer = queryChatContainer();
  if (!chatContainer || chatContainer.childNodes.length === 0) return null
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
    return element.getBoundingClientRect().top < 0.9 * navHeight;
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
  if (nextChat) {
    scrollPos = scrollContainer.scrollTop +
      nextChat.getBoundingClientRect().top -
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
  if (previousChat) {
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

export function getChatAuthor(chatElement: HTMLElement): "user" | "assistant" {
  const messageAuthor = chatElement.getAttribute("data-turn")
  if (messageAuthor === "user" || messageAuthor === "assistant") return messageAuthor
  // Default to user if no data-turn attribute is found
  return "user"
}



export function extractFilteredTreeBySelectors(
  node: HTMLElement,
  allowedSelectors: string[],
  textFilter: string
): HTMLElementItem[] {
  const result: HTMLElementItem[] = [];

  node.childNodes.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;

      const children = extractFilteredTreeBySelectors(el, allowedSelectors, textFilter);

      const hasAllowedSelector = allowedSelectors.some(selector => el.matches(selector)) 
      let hasAllowedText = true
      if (el.innerText && textFilter !== "" ) {
        hasAllowedText = el.innerText.toLowerCase().includes(textFilter)
      }
      const isAllowed = hasAllowedSelector && hasAllowedText
      if (isAllowed) {
        result.push({
          element: el,
          children,
        });
      } else if (children.length > 0) {
        result.push(...children); // promote valid descendants
      }
    }
  });

  return result;
}

export function getScrollableParent(el: Element | null): Element | null {
  while (el) {
    const style = window.getComputedStyle(el);

    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    const isScrollableY = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    const isScrollableX = (overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth;

    if (isScrollableY || isScrollableX) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

export const LANGUAGE_MAP: ReactComponentMap = {
  "python": BiLogoPython,
  "javascript": BiLogoJavascript,
  "typescript": BiLogoTypescript,
  "js": BiLogoJavascript,
  "ts": BiLogoTypescript,
  "jsx": BiLogoReact,
  "tsx": BiLogoReact,
  "java": BiLogoJava,
  "cpp": BiLogoCPlusPlus,
  "c++": BiLogoCPlusPlus,
  // "ruby": FaGem,
  "php": BiLogoPhp,
  // "rust": FaRust,
  // "swift": FaSwift,
  "html": BiLogoHtml5,
  "css": BiLogoCss3,
  "shell": BiTerminal,
  "markdown": BiLogoMarkdown,
  "docker": BiLogoDocker,
  "bash": BiTerminal,
}

export const ICON_MAP: ReactComponentMap = {
  "user": User,
  "assistant": BotMessageSquare,
  "code": Code,
  "section": Section,
  "chat": MessageSquare,
  ...LANGUAGE_MAP
}

export function extractChatId(url: string) {
  const match = url.match(/chatgpt\.com\/c\/([a-f0-9-]{36})/i);
  return match ? match[1] : null;
}

export function getItemInfo(item: HTMLElementItem) {
  const element = item.element;
  if (element.matches('[data-testid^="conversation-turn-"]')) {
    let label = item.element.textContent;
    const iconName = getChatAuthor(element);
    const splitText = label.split("said:");
    if (splitText.length > 1) {
      // rejoin incase another instance of 'said:' was in the chat.
      label = splitText.slice(1).join("said:");
    }
    return {
      "label": label,
      "icon": ICON_MAP[iconName],
      "iconName": iconName,
    };
  }
  if (element.tagName === "PRE") {
    let label = item.element.textContent;
    let language = "unknown";
    let iconName = "code";
    let splitText = label.split("\nCopy\nEdit");

    if (splitText.length > 1) {
      label = splitText.slice(1).join("\nCopy\nEdit");
      language = splitText[0];
    }

    if (splitText.length == 1) {
      splitText = label.split("Copy code")
      if (splitText.length > 1) {
        label = splitText.slice(1).join("Copy code");
        language = splitText[0].trim();

      }
    }
    if (Object.keys(LANGUAGE_MAP).includes(language)) {
      iconName = language;
    }

    return {
      "label": label,
      "icon": ICON_MAP[iconName],
      "iconName": iconName
    };
  }

  if (element.matches("h1, h2, h3")) {
    const iconName = "section";
    return {
      "label": item.element.textContent,
      "icon": ICON_MAP[iconName],
      "iconName": iconName
    };
  }

  return {
    "label": item.element.textContent,
    "icon": ICON_MAP["chat"],
    "iconName": "chat"
  };
}

