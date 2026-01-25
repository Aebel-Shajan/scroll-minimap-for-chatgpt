import { ChatItem, ReactComponentMap } from "@/types";
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
import { chatProviders, SELECTOR_MAP } from "./constants";

export function queryChatScrollContainer(chatProvider: chatProviders): HTMLElement | null {
  const firstChatMessage = document.querySelector<HTMLElement>(
    SELECTOR_MAP[chatProvider]["user"]
  )
  if (!firstChatMessage?.parentElement) return null
  return getScrollableParent(firstChatMessage.parentElement)
}

export function getScrollableParent(el: Element | null): HTMLElement | null {
  while (el) {
    const { overflowY } = window.getComputedStyle(el)
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      return el as HTMLElement
    }
    el = el.parentElement
  }
  return null
}

export function extractFilteredTreeBySelectors(
  chatContainer: HTMLElement,
  allowedSelectors: string[],
  textFilter: string,
  selectorMap: Record<string, string>
): ChatItem[] {
  const selectorString = allowedSelectors.join(", ")
  if (!selectorString) return []

  const allElements = [...chatContainer.querySelectorAll<HTMLElement>(selectorString)]
    .filter(el => el.innerText.includes(textFilter))

  const userSelector = selectorMap["user"]
  const assistantSelector = selectorMap["assistant"]

  return allElements
    .filter(el => el.matches(userSelector) || el.matches(assistantSelector))
    .map(el => ({
      element: el,
      children: allElements
        .filter(child => el.contains(child) && el !== child)
        .map(child => ({ element: child, children: [] }))
    }))
}

const LANGUAGE_MAP: ReactComponentMap = {
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
  "php": BiLogoPhp,
  "html": BiLogoHtml5,
  "css": BiLogoCss3,
  "shell": BiTerminal,
  "markdown": BiLogoMarkdown,
  "docker": BiLogoDocker,
  "bash": BiTerminal,
}

const ICON_MAP: ReactComponentMap = {
  "user": User,
  "assistant": BotMessageSquare,
  "code": Code,
  "section": Section,
  "chat": MessageSquare,
  ...LANGUAGE_MAP
}

function getChatAuthor(element: HTMLElement): "user" | "assistant" {
  const author = element.getAttribute("data-turn")
  return author === "assistant" ? "assistant" : "user"
}

export function getItemInfo(item: ChatItem) {
  const element = item.element
  let label = element.textContent ?? ""
  let iconName = "chat"

  if (element.matches('[data-testid^="conversation-turn-"]')) {
    iconName = getChatAuthor(element)
    const splitText = label.split("said:")
    if (splitText.length > 1) {
      label = splitText.slice(1).join("said:")
    }
  } else if (element.tagName === "PRE") {
    iconName = "code"
    let language = "unknown"

    for (const separator of ["\nCopy\nEdit", "Copy code"]) {
      const parts = label.split(separator)
      if (parts.length > 1) {
        language = parts[0].trim()
        label = parts.slice(1).join(separator)
        break
      }
    }

    if (language in LANGUAGE_MAP) {
      iconName = language
    }
  } else if (element.matches("h1, h2, h3")) {
    iconName = "section"
  }

  return {
    label,
    icon: ICON_MAP[iconName],
    iconName
  }
}
