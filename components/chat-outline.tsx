import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy, Filter, LucideCopyMinus, LucideCopyPlus } from "lucide-react";
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
  FaRust,
  FaSwift,
  FaGem, // for Ruby
} from "react-icons/fa"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { BiLogoCPlusPlus, BiLogoCss3, BiLogoDocker, BiLogoHtml5, BiLogoJava, BiLogoJavascript, BiLogoMarkdown, BiLogoPhp, BiLogoPython, BiLogoReact, BiLogoTypescript, BiTerminal } from "react-icons/bi";


const SELECTOR_MAP: { [key: string]: string } = {
  "user": '[data-turn="user"]',
  "assistant": '[data-turn="assistant"]',
  "code blocks": 'pre',
  "section headers": 'h1, h2, h3'
};


export default function ChatOutline(
  {
    scrollContainer
  }: {
    scrollContainer: HTMLElement | null
  }
) {
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({})
  const [options, setOptions] = useState<Record<string, boolean>>({
    "user": true,
    "assistant": true,
    "code blocks": true,
    "section headers": true,
  })
  const anyOpen = Object.values(collapseState).some(Boolean)

  let elementTree: HTMLElementItem[] = []
  if (scrollContainer) {
    const allowedSelectors: string[] = []
    Object.keys(SELECTOR_MAP).forEach(key => {
      if (options[key]) {
        allowedSelectors.push(SELECTOR_MAP[key])
      }
    })
    elementTree = extractFilteredTreeBySelectors(scrollContainer, allowedSelectors)
  }

  function toggleAll() {
    setCollapseState(prev => {
      const newState: Record<string, boolean> = {}
      Object.keys(prev).forEach(key => {
        newState[key] = !anyOpen
      })
      console.log(newState)
      return newState
    })
  }

  const onToggleOption = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    e.preventDefault()
    setOptions(old => {
      return { ...old, [key]: !old[key] }
    }
    )
  }

  return (
    <SidebarGroup>
      <div className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex justify-between sticky top-0 z-99")}>
        Chat outline
        <div className="flex gap-1">
          <div className={buttonVariants({ variant: "ghost", size: "sm", className: "cursor-pointer" })} onClick={toggleAll}>
            {anyOpen ? <LucideCopyMinus className="size-3" /> : <LucideCopyPlus className="size-3" />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Filter className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(options).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={value}
                  onClick={(e) => onToggleOption(e, key)}
                >
                  {key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div >
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
    </SidebarGroup >
  )
}

interface ReactComponentMap {
  [key: string]: React.ComponentType<any>
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
  "ruby": FaGem,
  "php": BiLogoPhp,
  "rust": FaRust,
  "swift": FaSwift,
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


function CopyActionButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    })
  }

  return (
    <SidebarMenuAction
      onClick={handleCopy}
      className="!top-0.25 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-accent cursor-pointer"
    >
      {copied ? <Check /> : <Copy />}
    </SidebarMenuAction>
  )
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
      <SidebarMenuItem className="group" >

        <SidebarMenuButton
          // isActive={name === "button.tsx"}
          className="data-[active=true]:bg-transparent pl-7 flex gap-1 py-0 !pr-0 h-5.5"
          onClick={scrollElementIntoView}
        >
          <ItemIcon className="" />
          <span className="text-xs">
            {label}
          </span>
        </SidebarMenuButton>
        <CopyActionButton textToCopy={label} />
      </SidebarMenuItem>

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
        <div className="group">

          <SidebarMenuButton className="flex gap-1 py-0 !pr-0 h-5.5">
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
          <CopyActionButton textToCopy={label} />
        </div>

        <CollapsibleContent>
          <SidebarMenuSub className="pr-0 mr-0 gap-0">
            {children.map((subItem, subIndex) => (
              <Tree key={subIndex} item={subItem} collapseState={collapseState} setCollapseState={setCollapseState} index={index + "," + subIndex} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
