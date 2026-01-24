import { queryChatContainer, queryChatScrollContainer } from "@/lib/chatgptElementUtils"
import ChatOutlineRewrite from "./chat-outline-rerwrite"
import { ClassNameValue } from "tailwind-merge"
import { X } from "lucide-react"



export default function AppSidebarRewrite(
  {
    isOpen,
    setIsOpen,
    className
  }: {
    isOpen: boolean,
    setIsOpen: CallableFunction,
    className: string
  }
) {
  let scrollContainer = queryChatScrollContainer()
  const chatContainer = queryChatContainer()
  const chatContainerHeight = useElementHeight(chatContainer)


  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({})
  const [options, setOptions] = useSyncedStorage<Record<string, boolean>>("filterOptions", {
    "user": true,
    "assistant": true,
    "code blocks": true,
    "section headers": true,
  })


  return (
    <div className={"flex flex-col w-75 h-[calc(100vh-60px)] rounded-2xl border-accent border-2 overflow-hidden bg-background " + className}>
      <div className="w-full p-2 text-foreground border-b-accent border-b-2 flex justify-between items-center">
        <div className="font-extrabold hover:">
          ChatGPS
        </div>
        <button className="rounded-md border-2 bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer" onClick={() => setIsOpen(false)}>
          <X />
        </button>
      </div>
      <ChatOutlineRewrite
        scrollContainer={scrollContainer}
        options={options}
      />
    </div>
  )
}