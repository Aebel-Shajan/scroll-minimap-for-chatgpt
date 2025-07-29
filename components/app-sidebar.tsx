import * as React from "react"
import {
  BotMessageSquare,
  ChevronRight,
  Code,
  LucideCopyMinus,
  LucideCopyPlus,
  MessageSquare,
  RefreshCcw,
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { HTMLElementItem } from "@/types"
import { 
  extractFilteredTreeBySelectors, 
  getChatAuthor, 
  getScrollableParent, 
  queryChatContainer, 
  queryChatScrollContainer,
} from "@/lib/chatgptElementUtils"

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
import { buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import Minimap from "./Minimap/Minimap"
import { useElementHeight } from "@/hooks/use-element-height"



export function AppSidebar(
  {
    isOpen,
    setIsOpen,
    ...props
  }:
    React.ComponentProps<typeof Sidebar> &
    {
      isOpen: boolean,
      setIsOpen: CallableFunction,

    }
) {
  const [, forceRefresh] = React.useReducer(x => x + 1, 0);
  const [collapseState, setCollapseState] = React.useState<Record<string, boolean>>({})
  const [queueRedraw, setQueueRedraw] = useState(false)

  const anyOpen = Object.values(collapseState).some(Boolean)

  // NOTE: * chatcontainer is container which is parent of all chats
  //       * scroll container is what controls the scroll of the chat viewport
  let scrollContainer = queryChatScrollContainer()
  const chatContainer = queryChatContainer()
  const chatContainerHeight = useElementHeight(chatContainer)
  console.log("reloaded")
  useEffect(() => {
    setQueueRedraw(true)
  }, [chatContainerHeight])

  if (!scrollContainer) {
    setTimeout(() => {
      scrollContainer = queryChatScrollContainer()
      forceRefresh()
      // console.log("searched again!", scrollContainer)
    }, 2000)
  }

  let elementTree: HTMLElementItem[] = []
  if (scrollContainer) {
    const allowedSelectors = [
      '[data-testid^="conversation-turn-"]',
      'pre',
      'h1',
      'h2',
      'h3',
    ]
    elementTree = extractFilteredTreeBySelectors(scrollContainer, allowedSelectors)
  }


  function toggleAll() {
    setCollapseState(prev => {
      const newState: Record<string, boolean> = {}
      Object.keys(prev).forEach(key => {
        newState[key] = !anyOpen
      })
      return newState
    })
  }
  function handleRefresh() {
    forceRefresh()
    setQueueRedraw(true)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader
        className="bg-background flex flex-row justify-between items-center border-accent border-b-1 h-13 w-full">
        <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} variant={"ghost"} className="cursor-e-resize" />
        <div className={buttonVariants({ variant: "ghost", size: "sm", className: "cursor-pointer" })} onClick={handleRefresh}>
          <RefreshCcw className="size-3" />
        </div>
        <div className="flex items-center justify-end w-full h-full gap-1">
          <MdOutlineGpsFixed />

          <div className="text-[1.125rem]">
            Chat GPS
          </div>
        </div>
      </SidebarHeader>
      <div className="w-full flex h-[calc(100vh-52px)]">

        <div className="bg-black w-15 h-full">
          <Minimap elementToMap={scrollContainer} queueRedraw={queueRedraw} setQueueRedraw={setQueueRedraw} />
        </div>
        <SidebarContent className="w-55 h-full overflow-y-scroll">
          <SidebarGroup>
            <div className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex justify-between")}>
              Chat outline
              <div className="flex gap-1">
                <div className={buttonVariants({ variant: "ghost", size: "sm", className: "cursor-pointer" })} onClick={toggleAll}>
                  {anyOpen ? <LucideCopyMinus className="size-3" /> : <LucideCopyPlus className="size-3" />}
                </div>
              </div>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {elementTree.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    setCollapseState={setCollapseState}
                    collapseState={collapseState}
                    index={String(index)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>

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

function Tree(
  {
    item,
    index,
    collapseState,
    setCollapseState,
  }:
    {
      item: HTMLElementItem,
      index: string,
      collapseState: Record<string, boolean>,
      setCollapseState: CallableFunction,
    }
) {
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

  function handleCollapseChange(open: boolean) {
    setCollapseState((oldState: Record<string, boolean>) => {
      const newState = { ...oldState }
      newState[index] = open
      return newState
    }
    )
  }

  useEffect(() => {
    handleCollapseChange(false)
  }, [])


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
        onOpenChange={handleCollapseChange}
        open={collapseState[index]}
      // defaultOpen={name === "components" || name === "ui"}
      >
        <SidebarMenuButton className="flex gap-1 py-0 h-5.5">
          <CollapsibleTrigger asChild >
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
            {children.map((subItem, subIndex) => (
              <Tree key={subIndex} item={subItem} collapseState={collapseState} setCollapseState={setCollapseState} index={index + "" + subIndex} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
