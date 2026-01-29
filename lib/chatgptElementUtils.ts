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
import { chatProviders, SCROLL_OFFSET, SELECTOR_MAP } from "./constants";

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

export function queryAllUserChats(scrollContainer: HTMLElement, selectorMap: Record<string, string>): HTMLElement[] {
  const userSelector = selectorMap["user"]
  return [...scrollContainer.querySelectorAll<HTMLElement>(userSelector)]
}

function getElementScrollPosition(element: HTMLElement, scrollContainer: HTMLElement): number {
  const containerRect = scrollContainer.getBoundingClientRect()
  return element.getBoundingClientRect().top - containerRect.top + scrollContainer.scrollTop
}

function findCurrentChatIndex(chatElements: HTMLElement[]): number {
  let closestIndex = 0
  let closestDistance = Infinity

  chatElements.forEach((el, index) => {
    const distance = Math.abs(el.getBoundingClientRect().top - SCROLL_OFFSET)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  return closestIndex
}

export function navigateToNextChat(scrollContainer: HTMLElement, selectorMap: Record<string, string>) {
  const chatElements = queryAllUserChats(scrollContainer, selectorMap)
  if (chatElements.length === 0) return

  const currentIndex = findCurrentChatIndex(chatElements)
  const nextIndex = currentIndex + 1

  if (nextIndex < chatElements.length) {
    const scrollPos = getElementScrollPosition(chatElements[nextIndex], scrollContainer)
    scrollContainer.scrollTop = scrollPos - SCROLL_OFFSET
  } else {
    scrollContainer.scrollTop = scrollContainer.scrollHeight
  }
}

export function navigateToPreviousChat(scrollContainer: HTMLElement, selectorMap: Record<string, string>) {
  const chatElements = queryAllUserChats(scrollContainer, selectorMap)
  if (chatElements.length === 0) return

  const currentIndex = findCurrentChatIndex(chatElements)
  const prevIndex = currentIndex - 1

  if (prevIndex >= 0) {
    const scrollPos = getElementScrollPosition(chatElements[prevIndex], scrollContainer)
    scrollContainer.scrollTop = scrollPos - SCROLL_OFFSET
  } else {
    scrollContainer.scrollTop = 0
  }
}

export function getItemInfo(item: ChatItem, selectorMap: Record<string, string>) {
  const element = item.element
  let label = element.textContent ?? ""
  let iconName = "chat"

  const userSelector = selectorMap["user"]
  const assistantSelector = selectorMap["assistant"]
  const codeSelector = selectorMap["code blocks"]
  const sectionSelector = selectorMap["section headers"]

  if (element.matches(userSelector)) {
    iconName = "user"
    const splitText = label.split("said:")
    if (splitText.length > 1) {
      label = splitText.slice(1).join("said:")
    }
  } else if (element.matches(assistantSelector)) {
    iconName = "assistant"
    const splitText = label.split("said:")
    if (splitText.length > 1) {
      label = splitText.slice(1).join("said:")
    }
  } else if (element.matches(codeSelector)) {
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
  } else if (element.matches(sectionSelector)) {
    iconName = "section"
  }

  return {
    label,
    icon: ICON_MAP[iconName],
    iconName
  }
}
