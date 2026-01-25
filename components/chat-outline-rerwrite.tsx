import { extractFilteredTreeBySelectors, getItemInfo, getScrollableParent, queryChatContainer, queryChatScrollContainer } from "@/lib/chatgptElementUtils";
import { CHAT_GPT_SELECTOR_MAP, GEMINI_SELECTOR_MAP } from "@/lib/constants";
import { ChatItem } from "@/types"


export default function ChatOutlineRewrite(
  {
    scrollContainer,
    options,
    textFilter
  }: {
    scrollContainer: HTMLElement | null,
    options: Record<string, boolean>,
    textFilter: string
  }
) {
  const [elementTree, setElementTree] = useState<ChatItem[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const chatProvider = useChatProvider()
  const [selectorMap, setSelectorMap] = useState(CHAT_GPT_SELECTOR_MAP)

  useEffect(() => {
    if (chatProvider === 'gemini') {
      setSelectorMap(GEMINI_SELECTOR_MAP)
    }
    if (chatProvider === 'chatgpt') {
      setSelectorMap(CHAT_GPT_SELECTOR_MAP)
    }
  }, [chatProvider])



  // Update elementTree when filters change
  useEffect(() => {
    if (scrollContainer) {
      const allowedSelectors = Object.keys(selectorMap)
        .filter(key => options[key])
        .map(key => selectorMap[key])
      setElementTree(extractFilteredTreeBySelectors(scrollContainer, allowedSelectors, textFilter, selectorMap))
    }
  }, [scrollContainer, options, textFilter, selectorMap])

  // Handle scroll highlighting
  useEffect(() => {
    if (!scrollContainer || elementTree.length === 0) return
    const handleScroll = () => {
      const scrollPosElementMap = Object.fromEntries(
        elementTree.map((item, index) => [item.element.offsetTop, index])
      )
      const nearestElement = findNearestMin(
        scrollContainer.scrollTop + 60,
        Object.keys(scrollPosElementMap).map(Number)
      )
      const indexToHighlight = scrollPosElementMap[nearestElement]
      setHighlightedIndex(indexToHighlight ? indexToHighlight : 0)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [scrollContainer, elementTree])


  return (
    <div className="w-full flex-1 text-foreground overflow-y-scroll">
      <ElementDropDowns elementTree={elementTree} highlightedIndex={highlightedIndex} />
    </div>
  )
}

function ElementDropDowns(
  {
    elementTree,
    highlightedIndex
  }: {
    elementTree: ChatItem[],
    highlightedIndex: number
  }
) {


  if (elementTree.length === 0) {
    return <div className="p-3 w-full h-full">
      <div className="w-full h-full rounded-xl border-2 border-dashed bg-accent text-muted-foreground font-semibold flex items-center justify-center">
        No chats found!
      </div>
    </div>
  }

  return (
    <div className="w-full h-fit">
      {elementTree.map((node, index) => {
        return <TextPreview item={node} highlighted={index == highlightedIndex} key={"text-preview" + index} />
      })}
    </div>
  )
}


function TextPreview(
  {
    item,
    highlighted = false
  }: {
    item: ChatItem
    highlighted: boolean
  }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [highlighted]); // runs whenever `active` changes



  return (
    <div className={"group w-full h-fit flex flex-col hover:bg-muted relative " + (highlighted && " bg-muted")} ref={ref}>
      <div className="w-1 h-full absolute top-0 left-0 bg-[#b0b0b0] group-hover:opacity-100 opacity-0 z-0"></div>
      {highlighted &&
        <div className="w-1 h-full absolute top-0 right-0 bg-[#04A179] z-0"></div>
      }
      <PreviewButton item={item} onClick={() => scrollElementIntoView(item.element)} />
      {item.children.length > 0 &&
        <div className="pl-10">
          {item.children.map((child, index) => <PreviewButton item={child} onClick={() => scrollElementIntoView(child.element)} padding={1} key={"preview-button" + index} />)}
        </div>
      }
    </div>
  )
}

function PreviewButton(
  {
    item,
    onClick,
    padding = 3,
    ref
  }: {
    item: ChatItem,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    padding?: number,
    ref?: React.Ref<HTMLDivElement>
  }
) {
  const children = item.children
  const { label, icon } = getItemInfo(item)
  const ItemIcon = icon


  return (
    <div className={`shrink-100 cursor-pointer rounded-lg p-${padding} hover:text-muted-foreground flex gap-1`} onClick={onClick} ref={ref}>
      <div className="flex items-center justify-center relative w-fit h-full rounded-xs">
        <ItemIcon size={15} />
      </div>
      <span className={`text-xs line-clamp-2 wrap-anywhere select-none`}>
        {label}
      </span>
    </div>
  )
}


function scrollElementIntoView(element: HTMLElement) {
  // why not use chatElement.scrollIntoView()?
  const scrollContainer = getScrollableParent(element)
  if (scrollContainer) {
    scrollContainer.scrollTop = element.getBoundingClientRect().top + scrollContainer.scrollTop - 60
  }
}

function findNearestMin(num: number, arr: number[]) {
  const sortedArr = arr.toSorted((a, b) => (b - a))
  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i] < num) {
      return sortedArr[i]
    }
  }
  return 0
}