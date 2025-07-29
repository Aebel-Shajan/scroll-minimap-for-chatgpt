import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideCopyMinus, LucideCopyPlus } from "lucide-react";
import { HTMLElementItem } from "@/types";
import { extractFilteredTreeBySelectors, getChatAuthor, getScrollableParent } from "@/lib/chatgptElementUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  BotMessageSquare,
  ChevronRight,
  Code,
  MessageSquare,
  Section,
  User,
} from "lucide-react"
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


export default function ChatOutline(
  {
    scrollContainer
  }: {
    scrollContainer: HTMLElement | null
  }
) {
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({})
  const anyOpen = Object.values(collapseState).some(Boolean)



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

  return (
    <SidebarGroup>
      <div className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex justify-between sticky top-0 z-99")}>
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
