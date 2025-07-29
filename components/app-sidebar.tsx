import * as React from "react"
import {
  RefreshCcw,
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
import { MdOutlineGpsFixed } from "react-icons/md";
import { buttonVariants } from "./ui/button"
import Minimap from "./Minimap/Minimap"
import { useElementHeight } from "@/hooks/use-element-height"
import ChatOutline from "./chat-outline/chat-outline";



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
          <ChatOutline scrollContainer={scrollContainer} />
        </SidebarContent>
      </div>

    </Sidebar>
  )
}
