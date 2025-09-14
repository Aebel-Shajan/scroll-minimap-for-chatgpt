import * as React from "react"
import {
  EyeOff,
  LocateFixed,
  RefreshCcw,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  queryChatContainer,
  queryChatScrollContainer,
} from "@/lib/chatgptElementUtils"
import { Button, buttonVariants } from "./ui/button"
import Minimap from "./Minimap/Minimap"
import { useElementHeight } from "@/hooks/use-element-height"
import ChatOutline from "./chat-outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import FavouritesSection from "./favourites-section";
import { favouritedChat } from "@/types";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { MAX_Z_INDEX } from "@/lib/constants"

interface FavouriteContextProps {
  favourites: Record<string, favouritedChat>,
  setFavourites: CallableFunction,
}

export const FavouriteContext = React.createContext<FavouriteContextProps>({
  favourites: {},
  setFavourites: () => { }
})

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
  const [, forceRefresh] = useReducer(x => x + 1, 0);
  const [queueRedraw, setQueueRedraw] = useState(false)
  const [displayOptions, setDisplayOptions] = useSyncedStorage<Record<string, boolean>>(
    "displayOptions",
    {
      "showMinimap": import.meta.env.BROWSER === 'firefox' ? false : true,
      // "showOutline": true,
    }
  )
  const [favourites, setFavourites] = useSyncedStorage<Record<string, favouritedChat>>("favouritedChats", {})

  // NOTE: * chatcontainer is container which is parent of all chats
  //       * scroll container is what controls the scroll of the chat viewport
  let scrollContainer = queryChatScrollContainer()
  const chatContainer = queryChatContainer()
  const chatContainerHeight = useElementHeight(chatContainer)
  // console.log("reloaded")
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

  function handleRefresh() {
    forceRefresh()
    setQueueRedraw(true)
  }

  const onToggleOption = (e: React.MouseEvent, key: string) => {
    e.preventDefault()
    setDisplayOptions(old => {
      return { ...old, [key]: !old[key] }
    }
    )
  }

  return (

    <Sidebar {...props}>
      <SidebarHeader
        className="bg-background flex flex-row justify-between items-center border-accent border-b-1 h-13 w-full">
        <div className="flex items-center">
          <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} variant={"ghost"} className="cursor-e-resize" />
          <DropdownMenu >
            <DropdownMenuTrigger asChild disabled={import.meta.env.BROWSER === 'firefox'}>
              <Button className="text-[1.125rem] flex gap-1 items-center" variant="ghost">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`z-[${MAX_Z_INDEX}]`}>
              {Object.entries(displayOptions).map(([key, value]) => (
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
        <Button className="text-[1.125rem] flex gap-1 items-center" variant="ghost" asChild>
          <a href="https://www.buymeacoffee.com/aebel" target="_blank">
            <LocateFixed />
            Chat GPS
          </a>
        </Button>


      </SidebarHeader>
      <div className="flex h-[calc(100vh-52px)] w-70">

        {displayOptions["showMinimap"] &&
          <div className="bg-background h-full w-15 border-r-1">
            <div className="p-1">

              <Button
                variant={"ghost"}
                className="h-[33px] w-full cursor-pointer"
                onClick={(e) => onToggleOption(e, "showMinimap")}
              >
                <EyeOff />
              </Button>
            </div>
            <div
              className="h-[calc(100%_-_41px)] w-full"
            >
              <Minimap elementToMap={scrollContainer} queueRedraw={queueRedraw} setQueueRedraw={setQueueRedraw} />
            </div>
          </div>
        }

        <SidebarContent className="w-55 h-full overflow-y-scroll bg-background">
          <FavouriteContext.Provider
            value={{
              favourites,
              setFavourites
            }}
          >
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel minSize={20} defaultSize={80}>
                <ChatOutline
                  className="h-full overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  scrollContainer={scrollContainer}
                  handleRefresh={handleRefresh}
                />
              </ResizablePanel>
              <ResizableHandle withHandle className="cursor-ns-resize" />
              <ResizablePanel minSize={20} defaultSize={20}>
                <FavouritesSection />
              </ResizablePanel>
            </ResizablePanelGroup>
          </FavouriteContext.Provider>
        </SidebarContent>
      </div>
    </Sidebar >
  )
}
