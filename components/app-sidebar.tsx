import * as React from "react"
import {
  BotMessageSquare,
  ChevronRight,
  Code,
  MessageSquare,
  Section,
  User,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { HTMLElementItem } from "@/types"
import { getChatAuthor, getScrollableParent } from "@/lib/chatgptElementUtils"

import {
  FaPython,
  FaJs,
  FaJava,
  FaPhp,
  FaHtml5,
  FaCss3Alt,
  FaMarkdown,
  FaDocker,
  FaRust,
  FaSwift,
  FaGem, // for Ruby
  FaTerminal, // for Shell
} from "react-icons/fa"

import { MdOutlineGpsFixed } from "react-icons/md";




export function AppSidebar(
  {
    treeItems,
    isOpen,
    setIsOpen,
    ...props
  }:
    React.ComponentProps<typeof Sidebar> &
    {
      treeItems: HTMLElementItem[],
      isOpen: boolean,
      setIsOpen: CallableFunction,

    }
) {
  return (
    <Sidebar {...props}>
      <SidebarHeader 
        className="bg-background flex flex-row justify-between items-center border-accent border-b-1 h-13 w-full">
        <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex items-center justify-end w-full h-full gap-1">
          <MdOutlineGpsFixed />
          <span>
            Chat GPS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat outline</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {treeItems.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}


interface ReactComponentMap {
  [key: string]: React.ComponentType<any>
}


const LANGUAGE_MAP: ReactComponentMap = {
  "python": FaPython,
  "javascript": FaJs,
  "js": FaJs,
  "java": FaJava,
  "ruby": FaGem,
  "php": FaPhp,
  "rust": FaRust,
  "swift": FaSwift,
  "html": FaHtml5,
  "css": FaCss3Alt,
  "shell": FaTerminal,
  "markdown": FaMarkdown,
  "docker": FaDocker,
}


const ICON_MAP: ReactComponentMap = {
  "user": User,
  "assistant": BotMessageSquare,
  "code": Code,
  "section": Section,
  "chat": MessageSquare,
}

function getItemInfo(item: HTMLElementItem) {
  const element = item.element
  if (element.matches('[data-testid^="conversation-turn-"]')) {
    let label = item.element.innerText
    const splitText = label.split("said:")
    if (splitText.length > 1) {
      label = splitText.slice(1).join("said:")
    }
    return {
      "label": label,
      "icon": ICON_MAP[getChatAuthor(element)],
    }
  }
  if (element.tagName === "PRE") {
    let label = item.element.innerText
    let language = "unknown"
    let icon = ICON_MAP["code"]
    const splitText = label.split("\nCopy\nEdit")
    console.log(splitText)
    if (splitText.length > 1) {
      label = splitText.slice(1).join("\nCopy\nEdit")
      language = splitText[0]
    }
    if (Object.keys(LANGUAGE_MAP).includes(language)) {
      icon = LANGUAGE_MAP[language]
    }

    return {
      "label": label,
      "icon": icon,
    }
  }

  if (element.matches("h1, h2, h3")) {
    return {
      "label": item.element.innerText,
      "icon": ICON_MAP["section"],
    }
  }

  return {
    "label": item.element.innerText,
    "icon": ICON_MAP["chat"],
  }
}

function Tree({ item }: { item: HTMLElementItem }) {
  const children = item.children
  const { label, icon } = getItemInfo(item)
  const ItemIcon = icon

  function scrollElementIntoView() {

    // why not use chatElement.scrollIntoView()?
    const scrollContainer = getScrollableParent(item.element)
    if (scrollContainer) {
      scrollContainer.scrollTop = item.element.getBoundingClientRect().top + scrollContainer.scrollTop - 60
    }
  }


  if (!children.length) {
    return (
      <SidebarMenuButton
        // isActive={name === "button.tsx"}
        className="data-[active=true]:bg-transparent pl-7 py-0 h-5.5"
        onClick={scrollElementIntoView}
      >
        <ItemIcon className="" />
        <span className="text-xs">
          {label}
        </span>
      </SidebarMenuButton>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      // defaultOpen={name === "components" || name === "ui"}
      >
        <SidebarMenuButton className="flex gap-1 py-0 h-5.5">
          <CollapsibleTrigger asChild>
            <ChevronRight className="transition-transform" />
          </CollapsibleTrigger>
          <ItemIcon className="" />
          <span className="text-xs"
            onClick={scrollElementIntoView}
          >
            {label}
          </span>
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub className="pr-0 mr-0 gap-0">
            {children.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
