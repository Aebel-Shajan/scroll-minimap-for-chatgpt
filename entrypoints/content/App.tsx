import "@/assets/tailwind.css";
import { extractFilteredTreeBySelectors, queryAllChatElements, queryChatScrollContainer } from "../../lib/chatgptElementUtils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HTMLElementItem } from "@/types";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  }

  if (!isOpen) {
    return (
      <TogglePanelButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="fixed top-20 right-5"
      />
    );
  }



  return (
    <div className="bg-sidebar-accent text-black w-70 h-dvh pt-0 border-l-2 border-accent flex flex-col">
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