import "@/assets/tailwind.css";
import { cn } from "@/lib/utils";
import icon from "@/assets/icon.png"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bug, ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import ChatOutline from "@/components/chat-outline";
import useThemeDetection from "@/hooks/use-theme-detection";
import useScrollContainer from "@/hooks/use-scroll-container";
import { navigateToNextChat, navigateToPreviousChat } from "@/lib/chatgptElementUtils";
import { SELECTOR_MAP } from "@/lib/constants";


const DEFAULT_FILTERS = {
    "user": true,
    "assistant": true,
    "code blocks": false,
    "section headers": true,
  }

export default function App() {
  useThemeDetection()
  const [isOpen, setIsOpen] = useSyncedStorage("sidebarOpen", false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const chatProvider = useChatProvider()
  const scrollContainer = useScrollContainer(chatProvider)
  const [textFilter, setTextFilter] = useState<string>("")
  const [options, setOptions] = useSyncedStorage<Record<string, boolean>>("filterOptions", DEFAULT_FILTERS)
  const anyFilters = Object.values(options).some((value) => !value)
  const selectorMap = SELECTOR_MAP[chatProvider]
  const fixedPosClass = "fixed top-15 right-5"

  const goToNextChat = () => {
    if (scrollContainer) navigateToNextChat(scrollContainer, selectorMap)
  }

  const goToPreviousChat = () => {
    if (scrollContainer) navigateToPreviousChat(scrollContainer, selectorMap)
  }
  const onToggleOption = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    e.preventDefault()
    setOptions((old: Record<string, boolean>) => {
      return { ...old, [key]: !old[key] }
    }
    )
  }


  useEffect(() => {
    function handler(msg: any) {
      if (msg.type === "TOGGLE_UI") {
        setIsOpen(prev => !prev);
      }
      if (msg.type === "NEXT_CHAT") {
        goToNextChat();
      }
      if (msg.type === "PREVIOUS_CHAT") {
        goToPreviousChat();
      }
    }
    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  }, [scrollContainer, selectorMap]);

  useEffect(() => {
    if (isOpen) {
      const input = inputRef.current;
      if (input) input.focus();
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [setIsOpen]);


  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={cn("w-fit cursor-pointer p-2 border-accent border-2 rounded-xl ", fixedPosClass)}
        title="Toggle chatgps"
      >
        <img src={icon} width={32} />
      </div>
    );
  }

  return (
    <div className={"flex flex-col w-75 h-[calc(100vh-200px)] rounded-2xl border-accent border-2 overflow-hidden bg-background " + fixedPosClass} >
      <div className="w-full p-2 text-foreground border-b-accent border-b-2 flex justify-between items-center">
        <div className="font-extrabold">
          ChatGPS
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={goToPreviousChat}
              className="h-3.5 px-1 rounded bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer flex items-center justify-center"
              title="Previous chat (Alt+Up)"
            >
              <ChevronUp className="size-3" />
            </button>
            <button
              onClick={goToNextChat}
              className="h-3.5 px-1 rounded bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer flex items-center justify-center"
              title="Next chat (Alt+Down)"
            >
              <ChevronDown className="size-3" />
            </button>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSd33FU9cCdtj019p3WSIXfoFm8uuMgY8qRDaAPYfNl-D4JKUg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="size-7 rounded-md border-2 bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer flex items-center justify-center"
            title="Report a bug"
          >
            <Bug className="size-4" />
          </a>
          <button className="size-7 rounded-md border-2 bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer" onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
      </div>
      <div className="w-full h-15 border-b-2 border-accent flex justify-center items-center p-2 gap-2">
        <input
          ref={inputRef}
          type="text"
          className="w-full flex-1 rounded-md bg-accent outline-none text-accent-foreground p-2 pl-3"
          placeholder="🔎 search chat"
          value={textFilter}
          onChange={(event) => setTextFilter(event.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className={"cursor-pointer h-full " + (anyFilters ? "" : "bg-accent")}>
              <Filter className={"size-4 " + (anyFilters ? "text-accent" : "text-foreground")} />
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
      <ChatOutline
        scrollContainer={scrollContainer}
        options={options}
        textFilter={textFilter}
      />
    </div>
  )
}
