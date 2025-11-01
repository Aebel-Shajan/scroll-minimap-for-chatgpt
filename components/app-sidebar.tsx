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
  const [showMinimap, setShowMinimap] = useSyncedStorage<boolean>("showMinimap", false)
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
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({})
  const [options, setOptions] = useSyncedStorage<Record<string, boolean>>("filterOptions", {
    "user": true,
    "assistant": true,
    "code blocks": true,
    "section headers": true,
  })


  function handleRefresh() {
    forceRefresh()
    setQueueRedraw(true)
  }



  return (

    <Sidebar {...props}>
      <SidebarHeader
        className="bg-background flex flex-row justify-between items-center border-accent h-fit w-full !p-0">
        <ChatOutlineHeader
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          collapseState={collapseState}
          setCollapseState={setCollapseState}
          options={options}
          setOptions={setOptions}
          handleRefresh={handleRefresh}
          showMinimap={showMinimap}
          setShowMinimap={setShowMinimap}
        />


      </SidebarHeader>
      <div className="flex grow-2 w-70">
        {showMinimap &&
          <div className="bg-background h-full w-15 border-r-1">
            <div
              className="h-full w-full"
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
                  className="h-full overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-0"
                  scrollContainer={scrollContainer}
                  handleRefresh={handleRefresh}
                  setCollapseState={setCollapseState}
                  collapseState={collapseState}
                  options={options}
                />
              </ResizablePanel>
              <ResizableHandle withHandle className="cursor-ns-resize" />
              <ResizablePanel minSize={5} defaultSize={20}>
                <FavouritesSection />
              </ResizablePanel>
            </ResizablePanelGroup>
          </FavouriteContext.Provider>
        </SidebarContent>
      </div>
    </Sidebar >
  )
}
