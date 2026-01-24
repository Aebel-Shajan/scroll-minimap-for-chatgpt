import "@/assets/tailwind.css";
import { cn } from "@/lib/utils";
import icon from "@/assets/icon.png"
import { queryChatContainer, queryChatScrollContainer } from "@/lib/chatgptElementUtils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import ChatOutlineRewrite from "@/components/chat-outline-rerwrite";


export default function App() {
  const [isOpen, setIsOpen] = useSyncedStorage("sidebarOpen", false)
  let scrollContainer = queryChatScrollContainer()
  const chatContainer = queryChatContainer()
  const chatContainerHeight = useElementHeight(chatContainer)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [, forceRefresh] = useReducer(x => x + 1, 0);

  if (!scrollContainer) {
    setTimeout(() => {
      scrollContainer = queryChatScrollContainer()
      forceRefresh()
      // console.log("searched again!", scrollContainer)
    }, 2000)
  }


  const [textFilter, setTextFilter] = useState<string>("")
  const [options, setOptions] = useSyncedStorage<Record<string, boolean>>("filterOptions", {
    "user": true,
    "assistant": true,
    "code blocks": false,
    "section headers": true,
  })
  const anyFilters = Object.values(options).some((value) => !value)


  const onToggleOption = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    e.preventDefault()
    setOptions((old: Record<string, boolean>) => {
      return { ...old, [key]: !old[key] }
    }
    )
  }


  const { setTheme } = useTheme();
  useEffect(() => {
    const checkAndSetTheme = () => {
      const rootElement = document.documentElement;
      const rootBackgroundColor = window.getComputedStyle(rootElement).backgroundColor;
      const isDarkMode = rootBackgroundColor !== "rgb(255, 255, 255)";
      setTheme(isDarkMode ? "dark" : "light");
    };

    checkAndSetTheme();

    const observer = new MutationObserver(checkAndSetTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    return () => observer.disconnect();
  }, [setTheme]);


  useEffect(() => {
    function handler(msg: any) {
      console.log(msg)
      if (msg.type === "TOGGLE_UI") {
        setIsOpen(prev => !prev);
      }
    }

    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const input = inputRef.current;
      if (input) input.focus();
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log(e)
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [setIsOpen]);

  const fixedPosClass = "fixed top-15 right-5"

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
        <div className="font-extrabold hover:">
          ChatGPS
        </div>
        <button className="rounded-md border-2 bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer" onClick={() => setIsOpen(false)}>
          <X />
        </button>
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
      <ChatOutlineRewrite
        scrollContainer={scrollContainer}
        options={options}
        textFilter={textFilter}
      />
    </div>
  )
}
