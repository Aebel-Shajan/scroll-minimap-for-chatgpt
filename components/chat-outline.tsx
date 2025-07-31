import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy, Filter, LucideCopyMinus, LucideCopyPlus, StarIcon } from "lucide-react";
import { favouritedChat, HTMLElementItem } from "@/types";
import { extractChatId, extractFilteredTreeBySelectors, getItemInfo, getScrollableParent } from "@/lib/chatgptElementUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronRight,
} from "lucide-react"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { FavouriteContext } from "./app-sidebar";


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
  const [options, setOptions] = useSyncedStorage<Record<string, boolean>>("filterOptions", {
    "user": true,
    "assistant": true,
    "code blocks": true,
    "section headers": true,
  })
  const anyOpen = Object.values(collapseState).some(Boolean)
  const anyFilters = Object.values(options).some((value) => !value)

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
      <Button
        variant="secondary"
        size="sm"
        className="flex justify-between sticky top-0 z-99"
        asChild
      >
        <div>

          Chat outline
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
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
                <Button variant={anyFilters ? "default" : "ghost"} size="sm" className="cursor-pointer">
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
      </Button >
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

function CopyActionButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(textToCopy).then(() => {
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
      console.log(newFavs)
      return newFavs
    })
  }


  function handleFavourite() {
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
        <StarIcon className="h-full" fill={isFavourited ? "black" : "transparent"} />
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
    console.log("span clicked")
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


  const menuLabel = (<>
    <ItemIcon className="" />
    <span className="text-xs truncate"
      onClick={scrollElementIntoView}
    >
      {label}
    </span>
    <div className="absolute top-0 h-full right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-accent gap-2 flex">
      <CopyActionButton textToCopy={label} />
      <FavouriteActionButton itemToFavourite={item} />
    </div>
  </>
  )



  if (!children.length) {
    return (
      <SidebarMenuItem className="group" >

        <SidebarMenuButton
          // isActive={name === "button.tsx"}
          className="data-[active=true]:bg-transparent pl-7 flex gap-1 py-0 !pr-0 h-5.5 relative"
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
          <SidebarMenuButton className="flex gap-1 py-0 !pr-0 h-5.5 relative">
            <CollapsibleTrigger asChild >
              <ChevronRight className="transition-transform" />
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
