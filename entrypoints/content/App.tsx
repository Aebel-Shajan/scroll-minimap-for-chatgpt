import "@/assets/tailwind.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronsUpDown, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { extractFilteredTreeBySelectors, getChatAuthor, queryAllChatElements, queryChatScrollContainer } from "./utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HTMLElementItem } from "@/types";




function TogglePanelButton(
  {
    isOpen,
    setIsOpen,
    className = ""
  }: {
    isOpen: boolean,
    setIsOpen: CallableFunction,
    className?: string,
  }
) {

  function toggleOpen() {
    setIsOpen((old: boolean) => !old)
  }

  return (
    <Button onClick={toggleOpen} className={cn(className, "w-fit h-fit")}>
      {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
    </Button>
  )
}


function ChatPreviewText(
  {
    chatElement,
    className = "",
  }: {
    chatElement: HTMLElement,
    className?: string,
  }
) {


  function scrollChatToTop() {
    // why not use chatElement.scrollIntoView()?
    const scrollContainer = queryChatScrollContainer()
    if (scrollContainer) {
      scrollContainer.scrollTop = chatElement.offsetTop
      console.log(chatElement.offsetTop)
    }
  }

  return (
    <span
      className={cn("block text-xs overflow-hidden text-left", className)}
      onClick={() => scrollChatToTop()}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
        textOverflow: 'ellipsis',
      }}
    >
      {chatElement.innerText}
    </span>
  )
}



function ChatPreview({
  chatElement
}: {
  chatElement: HTMLElement
}) {



  const chatAuthor = getChatAuthor(chatElement)
  console.log(chatAuthor)

  return (

    <Collapsible className="flex flex-col justify-between">
      <div
        className="h-7 w-full overflow-hidden grid grid-cols-5 gap-1"
      >
        {chatAuthor === "user" ?
          <CollapsibleTrigger >
            <ChevronDown
              className="col-span-1 self-center"
            />
          </CollapsibleTrigger>
          : <div />
        }
        <ChatPreviewText
          className="col-span-4 self-center"
          chatElement={chatElement} />
      </div>

      <CollapsibleContent>
        hello you have opened me
      </CollapsibleContent>
    </Collapsible >
  )
}

export default function App() {
  const [isOpen, setIsOpen] = useState(true)
  const allChatElements = queryAllChatElements()
  const scrollContainer = queryChatScrollContainer()
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
    console.log(elementTree)
  }

  if (!isOpen) {
    return (
      <TogglePanelButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="fixed top-0 right-0"
      />
    );
  }



  return (
    <div className="bg-background text-black fixed top-0 right-0 w-70 h-full pt-0 border-l-2 border-accent flex flex-col">
      <div className="flex justify-between items-center pr-5 bg-background border-b-1 h-13">
        <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} />
        Sidepanel
      </div>
      <div className="flex flex-col overflow-scroll grow ">
        <SidebarProvider className="w-full h-full" >
          <AppSidebar collapsible="none" className="w-full h-full" treeItems={elementTree}/>
        </SidebarProvider>
      </div>
    </div>
  )
}