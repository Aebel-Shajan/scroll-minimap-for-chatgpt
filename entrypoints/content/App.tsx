import "@/assets/tailwind.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronsUpDown, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { queryAllChatElements, queryChatScrollContainer } from "./utils";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";




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


function ChatPreview({
  chatElement
}: {
  chatElement: HTMLElement
}) {

  function scrollChatToTop() {
    // why not use chatElement.scrollIntoView()?
    const scrollContainer = queryChatScrollContainer()
    if (scrollContainer) {
      scrollContainer.scrollTop = chatElement.offsetTop
      console.log(chatElement.offsetTop)
    }
  }

  return (
      <Button
        variant="ghost"
        size="icon"
        className="h-fit w-full justify-between p-2 overflow-hidden"
        onClick={() => scrollChatToTop()}
      >
        <span
          className="block text-xs overflow-hidden w-full text-left"
          style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
        textOverflow: 'ellipsis',
          }}
        >
          {chatElement.innerText}
        </span>
      </Button>
  )
}

export default function App() {
  const [isOpen, setIsOpen] = useState(true)
  const allChatElements = queryAllChatElements()



  console.log(
  )

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
    <Card className="bg-gray-50 text-black fixed top-0 right-0 w-50 h-full pt-0">
      <div className="flex justify-between items-center pr-5 bg-background border-b-1">
        <TogglePanelButton isOpen={isOpen} setIsOpen={setIsOpen} />
        Sidepanel
      </div>
      <div className="flex flex-col">
        {
          allChatElements.map((element, index) => <ChatPreview chatElement={element} key={"chat-item-" + index}/>)
        }
      </div>
    </Card>
  )
}