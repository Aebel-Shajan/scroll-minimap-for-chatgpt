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

const SIDEBAR_WIDTH = 300; // px

const DEFAULT_FILTERS = {
  "user": true,
  "assistant": true,
  "code blocks": false,
  "section headers": true,
}

export default function App() {
  useThemeDetection()
  const [isOpen, setIsOpen] = useSyncedStorage("sidebarOpen", false)
  const [btnPos, setBtnPos] = useSyncedStorage("toggleBtnPos", { top: 60, right: 20 })
  const btnPosRef = useRef(btnPos)
  const btnElRef = useRef<HTMLDivElement | null>(null)
  const isDraggingBtn = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)
  const btnHalfSize = useRef({ w: 24, h: 24 })

  const inputRef = useRef<HTMLInputElement | null>(null)
  const chatProvider = useChatProvider()
  const scrollContainer = useScrollContainer(chatProvider)
  const [textFilter, setTextFilter] = useState<string>("")
  const [options, setOptions] = useSyncedStorage<Record<string, boolean>>("filterOptions", DEFAULT_FILTERS)
  const anyFilters = Object.values(options).some((value) => !value)
  const selectorMap = SELECTOR_MAP[chatProvider]

  useEffect(() => {
    const host =
      window.document.querySelector<HTMLElement>("main") ||
      window.document.querySelector<HTMLElement>("#__next") ||
      window.document.body

    if (!host) return

    if (isOpen) {
      host.style.transition = "margin-right 0.2s ease"
      host.style.marginRight = `${SIDEBAR_WIDTH}px`
    } else {
      host.style.marginRight = ""
    }
    return () => {
      host.style.marginRight = ""
    }
  }, [isOpen])

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

  const onBtnPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    isDraggingBtn.current = false
    hasMoved.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    if (btnElRef.current) {
      const rect = btnElRef.current.getBoundingClientRect()
      btnHalfSize.current = { w: rect.width / 2, h: rect.height / 2 }
    }
    window.addEventListener("pointermove", onWindowPointerMove)
    window.addEventListener("pointerup", onWindowPointerUp)
  }

  const onWindowPointerMove = (e: PointerEvent) => {
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (!hasMoved.current && Math.sqrt(dx * dx + dy * dy) < 5) return
    hasMoved.current = true
    isDraggingBtn.current = true

    if (btnElRef.current) {
      let newTop = e.clientY - btnHalfSize.current.h
      let newRight = window.innerWidth - e.clientX - btnHalfSize.current.w

      newTop = Math.max(0, Math.min(newTop, window.innerHeight - btnHalfSize.current.h * 2))
      newRight = Math.max(0, Math.min(newRight, window.innerWidth - btnHalfSize.current.w * 2))

      btnElRef.current.style.top = `${newTop}px`
      btnElRef.current.style.right = `${newRight}px`
      btnPosRef.current = { top: newTop, right: newRight }
    }
  }

  const onWindowPointerUp = () => {
    window.removeEventListener("pointermove", onWindowPointerMove)
    window.removeEventListener("pointerup", onWindowPointerUp)
    isDraggingBtn.current = false

    if (hasMoved.current) {
      setBtnPos({ ...btnPosRef.current })
    } else {
      setIsOpen(prev => !prev)
    }
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove)
      window.removeEventListener("pointerup", onWindowPointerUp)
    }
  }, [])

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

  return (
    <>
      {/* Floating toggle button (hidden when sidebar is open) */}
      <div
        ref={btnElRef}
        onPointerDown={onBtnPointerDown}
        style={{ top: `${btnPos.top}px`, right: `${btnPos.right}px` }}
        className={cn(
          "w-fit cursor-pointer p-2 border-accent border-2 rounded-xl fixed select-none",
          isOpen && "opacity-0 pointer-events-none"
        )}
        title="Toggle ChatGPS"
      >
        <img src={icon} width={32} draggable={false} onDragStart={e => e.preventDefault()} />
      </div>

      {/* Sidebar panel */}
      {isOpen && (
        <div
          style={{ width: `${SIDEBAR_WIDTH}px` }}
          className="flex flex-col h-screen rounded-l-2xl border-accent border-l-2 border-y-2 overflow-hidden bg-background fixed top-0 right-0 animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="w-full p-2 text-foreground border-b-accent border-b-2 flex justify-between items-center flex-shrink-0">
            <div className="font-extrabold">ChatGPS</div>
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
              <button
                className="size-7 rounded-md border-2 bg-accent hover:bg-accent-foreground hover:text-accent cursor-pointer flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </button>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="w-full border-b-2 border-accent flex justify-center items-center p-2 gap-2 flex-shrink-0">
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
      )}
    </>
  )
}
