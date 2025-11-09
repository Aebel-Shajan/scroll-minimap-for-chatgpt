import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Check, Copy, Filter, LucideCopyMinus, LucideCopyPlus, StarIcon, ChevronRight, RefreshCcw, ChevronDown, LocateFixed, EyeOff, EyeIcon, Map, BugIcon } from "lucide-react";
import { favouritedChat, HTMLElementItem } from "@/types";
import { extractChatId, extractFilteredTreeBySelectors, getItemInfo, getScrollableParent } from "@/lib/chatgptElementUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { FavouriteContext } from "./app-sidebar";
import { MAX_Z_INDEX } from "@/lib/constants";
import { MouseEventHandler } from "react";
import { TooltipContent, TooltipTrigger, Tooltip } from "@radix-ui/react-tooltip";


const SELECTOR_MAP: { [key: string]: string } = {
  "user": '[data-turn="user"]',
  "assistant": '[data-turn="assistant"]',
  "code blocks": 'pre',
  "section headers": 'h1, h2, h3'
};



export function ChatOutlineHeader(
  {
    isOpen,
    setIsOpen,
    collapseState,
    setCollapseState,
    options,
    setOptions,
    handleRefresh,
    showMinimap,
    setShowMinimap,
  }: {
    isOpen: boolean,
    setIsOpen: CallableFunction,
    collapseState: Record<string, boolean>,
    setCollapseState: CallableFunction,
    options: Record<string, boolean>,
    setOptions: CallableFunction,
    handleRefresh: MouseEventHandler<HTMLButtonElement>,
    showMinimap: boolean,
    setShowMinimap: CallableFunction,
  }
) {

  const anyOpen = Object.values(collapseState).some(Boolean)
  const anyFilters = Object.values(options).some((value) => !value)


  function toggleAll() {
    setCollapseState((prev: Record<string, boolean>) => {
      const newState: Record<string, boolean> = {}
      Object.keys(prev).forEach(key => {
        newState[key] = !anyOpen
      })
      return newState
    })
  }

  const onToggleOption = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    e.preventDefault()
    setOptions((old: Record<string, boolean>) => {
      return { ...old, [key]: !old[key] }
    }
    )
  }

  return (
    <div
      className="flex flex-col justify-between items-center h-fit p-0 w-full"
    >

      <div className="flex justify-between items-center h-[53px] w-full border-b-accent border-b-2 bg-secondary px-1">
        <div className="flex items-center h-full gap-1 ">
          
        <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} variant="outline" className="cursor-e-resize" />
        <Button className="text-sm flex items-center " variant="outline"  asChild>
        <a 
        target="_blank"
        href="https://docs.google.com/forms/d/e/1FAIpQLSd33FU9cCdtj019p3WSIXfoFm8uuMgY8qRDaAPYfNl-D4JKUg/viewform?usp=publish-editor">
          <BugIcon />
        </a>
          
        </Button>
          </div>
        <Button className="text-sm flex items-center " variant="outline" asChild >
          <a href="https://aebel-shajan.github.io/chat-gps-landing" target="_blank">
            <LocateFixed className="object-contain" />
            Chat GPS
          </a>
        </Button>
      </div>

      <div className="flex items-center justify-between h-6 w-full border-b-2">
        <div className="flex items-center gap-1 h-full">
          <Tooltip>
            <TooltipTrigger asChild >

              <Button
                variant={"ghost"}
                className="cursor-pointer h-full"
                onClick={() => setShowMinimap((prev: boolean) => !prev)}
              >
                {showMinimap ?
                  <EyeOff />
                  :
                  <Map />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs bg-foreground text-accent rounded-xl p-2 w-fit max-w-30 z-999" >
               {showMinimap ?
                  <>
              Close minimap
                  </>
                  :
           <>
              Expiremental, you have to refresh it manually.
                  </>
                }
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            className="cursor-pointer [&:active>svg]:rotate-360 transition-transform h-full"
            onClick={handleRefresh}
          >
            <RefreshCcw className="size-3 transition-all duration-300" />
          </Button>
        </div>
        <div className="flex items-center gap-1 h-full">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer h-full"
            onClick={toggleAll}
            asChild
          >
            <div>
              {
                anyOpen ?
                  <LucideCopyMinus className="size-3" /> :
                  <LucideCopyPlus className="size-3" />
              }
            </div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={anyFilters ? "default" : "ghost"} size="sm" className="cursor-pointer h-full">
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
      </div>
    </div >
  )
}

export default function ChatOutline(
  {
    scrollContainer,
    className,
    handleRefresh,
    collapseState,
    setCollapseState,
    options,
  }: {
    scrollContainer: HTMLElement | null,
    className?: string
    handleRefresh: MouseEventHandler<HTMLButtonElement>
    collapseState: Record<string, boolean>
    setCollapseState: CallableFunction
    options: Record<string, boolean>
  }
) {


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




  return (
    <SidebarGroup className={className}>

      <SidebarGroupContent>
        <SidebarMenu className="gap-[1px]">
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

function CopyActionButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(textToCopy.trimStart()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="cursor-pointer h-full !px-0"
      onClick={handleCopy}
      asChild
    >
      <div>
        {
          copied ?
            <Check className="h-full" /> :
            <Copy className="h-full" />
        }
      </div>
    </Button>
  )
}


function FavouriteActionButton({ itemToFavourite }: { itemToFavourite: HTMLElementItem }) {


  const { favourites, setFavourites } = useContext(FavouriteContext)
  const chatId = extractChatId(window.location.href)
  let isFavourited = false
  let scrollPos = -1
  const scrollContainer = getScrollableParent(itemToFavourite.element)
  if (scrollContainer) {
    scrollPos = itemToFavourite.element.getBoundingClientRect().top + scrollContainer.scrollTop - 60
    const uniqueId = chatId + "-scroll-" + scrollPos
    isFavourited = Object.keys(favourites).includes(uniqueId)
  }

  function removeExistingFavourite(uniqueId: string) {
    setFavourites((old: Record<string, favouritedChat>) => {
      if (!Object.keys(old).includes(uniqueId)) {
        return old
      }
      const newFavs = { ...old }
      delete newFavs[uniqueId]
      return newFavs
    })
  }

  function addNewFavourite(uniqueId: string, newFavourite: favouritedChat) {
    setFavourites((old: Record<string, favouritedChat>) => {
      const newFavs: { [x: string]: favouritedChat } = {
        ...old,
        [uniqueId]: newFavourite
      }
      return newFavs
    })
  }


  function handleFavourite(e: React.MouseEvent) {
    e.stopPropagation()
    if (!scrollContainer || !chatId || scrollPos === -1) {
      alert(`error occured when trying to favourite chat. You have to be logged in to fav chats. `)
      return
    }
    const uniqueId = chatId + "-scroll-" + scrollPos
    if (isFavourited) {
      removeExistingFavourite(uniqueId)
    } else {
      const { label, iconName } = getItemInfo(itemToFavourite)
      const newFavourite = {
        chatId: chatId,
        scrollTop: scrollPos,
        preview: label,
        iconName: iconName,
      }
      addNewFavourite(uniqueId, newFavourite)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="cursor-pointer h-full !px-0"
      onClick={handleFavourite}
      asChild
    >
      <div>
        <StarIcon className="h-full" fill={isFavourited ? "cyan" : "transparent"} />
      </div>
    </Button>
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
    handleCollapseChange(true)
  }, [])


  const menuLabel = (<div className="flex gap-1 h-fit items-center"
    onClick={scrollElementIntoView}

  >
    <ItemIcon className="object-contain w-4" />
    <div className="py-[3px] shrink-100">
      <span className="text-xs line-clamp-2 wrap-anywhere">
        {label}
      </span>
    </div>

    <div className="absolute top-0 h-full right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-accent gap-2 flex">
      <CopyActionButton textToCopy={label} />
      <FavouriteActionButton itemToFavourite={item} />
    </div>
  </div>
  )



  if (!children.length) {
    return (
      <SidebarMenuItem className="group" >

        <SidebarMenuButton
          // isActive={name === "button.tsx"}
          className="data-[active=true]:bg-transparent pl-7 py-0 !pr-0 h-fit relative cursor-pointer"
          onClick={scrollElementIntoView}
        >
          {menuLabel}
        </SidebarMenuButton>
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
          <SidebarMenuButton className="flex gap-1 py-0 !pr-0 h-fit relative cursor-pointer"
          >
            <CollapsibleTrigger className="cursor-pointer">

              {collapseState[index]
                ? <ChevronDown className="transition-transform w-4" />
                : <ChevronRight className="transition-transform w-4" />
              }


            </CollapsibleTrigger>
            {menuLabel}
          </SidebarMenuButton>
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
