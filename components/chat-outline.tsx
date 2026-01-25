import { extractFilteredTreeBySelectors, getItemInfo, getScrollableParent } from "@/lib/chatgptElementUtils";
import { SELECTOR_MAP } from "@/lib/constants";
import { ChatItem } from "@/types"
import useHighlightedIndex from "@/hooks/use-highlighted-index"


export default function ChatOutline(
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
  const chatProvider = useChatProvider()
  const highlightedIndex = useHighlightedIndex(scrollContainer, elementTree)

  const selectorMap = SELECTOR_MAP[chatProvider]

  useEffect(() => {
    if (scrollContainer) {
      const allowedSelectors = Object.keys(selectorMap)
        .filter(key => options[key])
        .map(key => selectorMap[key])
      setElementTree(extractFilteredTreeBySelectors(scrollContainer, allowedSelectors, textFilter, selectorMap))
    }
  }, [scrollContainer, options, textFilter, selectorMap])


  return (
    <div className="w-full flex-1 text-foreground overflow-y-scroll">
      <ElementDropDowns elementTree={elementTree} highlightedIndex={highlightedIndex} selectorMap={selectorMap} />
    </div>
  )
}

function ElementDropDowns(
  {
    elementTree,
    highlightedIndex,
    selectorMap
  }: {
    elementTree: ChatItem[],
    highlightedIndex: number,
    selectorMap: Record<string, string>
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
        return <TextPreview item={node} highlighted={index == highlightedIndex} selectorMap={selectorMap} key={"text-preview" + index} />
      })}
    </div>
  )
}


function TextPreview(
  {
    item,
    highlighted = false,
    selectorMap
  }: {
    item: ChatItem
    highlighted: boolean
    selectorMap: Record<string, string>
  }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [highlighted]);

  return (
    <div className={"group w-full h-fit flex flex-col hover:bg-muted relative " + (highlighted && " bg-muted")} ref={ref}>
      <div className="w-1 h-full absolute top-0 left-0 bg-[#b0b0b0] group-hover:opacity-100 opacity-0 z-0"></div>
      {highlighted &&
        <div className="w-1 h-full absolute top-0 right-0 bg-[#04A179] z-0"></div>
      }
      <PreviewButton item={item} onClick={() => scrollElementIntoView(item.element)} selectorMap={selectorMap} />
      {item.children.length > 0 &&
        <div className="pl-10">
          {item.children.map((child, index) => <PreviewButton item={child} onClick={() => scrollElementIntoView(child.element)} selectorMap={selectorMap} padding={1} key={"preview-button" + index} />)}
        </div>
      }
    </div>
  )
}

function PreviewButton(
  {
    item,
    onClick,
    selectorMap,
    padding = 3,
    ref
  }: {
    item: ChatItem,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    selectorMap: Record<string, string>,
    padding?: number,
    ref?: React.Ref<HTMLDivElement>
  }
) {
  const { label, icon } = getItemInfo(item, selectorMap)
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
  const scrollContainer = getScrollableParent(element)
  if (scrollContainer) {
    scrollContainer.scrollTop = element.getBoundingClientRect().top + scrollContainer.scrollTop - 60
  }
}