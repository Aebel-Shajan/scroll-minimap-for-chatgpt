import { extractFilteredTreeBySelectors, getItemInfo, getScrollableParent } from "@/lib/chatgptElementUtils";
import { HTMLElementItem } from "@/types"



const SELECTOR_MAP: { [key: string]: string } = {
  "user": '[data-turn="user"]',
  "assistant": '[data-turn="assistant"]',
  "code blocks": 'pre',
  "section headers": 'h1, h2, h3'
};

export default function ChatOutlineRewrite(
  {
    scrollContainer,
    options
  }: {
    scrollContainer: HTMLElement | null,
    options: Record<string, boolean>
  }
) {
  let elementTree: HTMLElementItem[] = []
  if (scrollContainer) {
    const allowedSelectors: string[] = []
    Object.keys(SELECTOR_MAP).forEach(key => {
      if (options[key]) {
        allowedSelectors.push(SELECTOR_MAP[key])
      }
    })
    elementTree = extractFilteredTreeBySelectors(scrollContainer, allowedSelectors)
  }

  return (
    <div className="w-full flex-1 text-foreground overflow-y-scroll">
      <ElementDropDowns elementTree={elementTree} />
    </div>
  )
}

function ElementDropDowns(
  {
    elementTree
  }: {
    elementTree: HTMLElementItem[]
  }
) {

  const dropDownElements = elementTree.map(node => {
    return <TextPreview item={node} />
  })

  if (elementTree.length === 0) {
    return <div className="p-3 w-full h-full">
      <div className="w-full h-full rounded-xl border-2 border-dashed bg-accent text-muted-foreground font-semibold flex items-center justify-center">
        No chats found!
      </div>
    </div>
  }

  return (
    <div className="w-full h-fit">
      {
        dropDownElements
      }
    </div>
  )
}



function TextPreview(
  {
    item
  }: {
    item: HTMLElementItem
  }
) {


  return (<div className="group w-full h-fit flex flex-col hover:bg-muted relative ">
    <div className="w-1 h-full absolute top-0 left-0 bg-[#04A179] group-hover:opacity-100 opacity-0 z-0"></div>
    <PreviewButton item={item} onClick={() => scrollElementIntoView(item.element)} />
    {item.children.length > 0 &&
      <div className="pl-10">
        {item.children.map(child => <PreviewButton item={child} onClick={() => scrollElementIntoView(child.element)} padding={1} textSize="[1px]" />)}
      </div>
    }
  </div>
  )
}

function PreviewButton(
  {
    item,
    onClick,
    padding=3
  }: {
    item: HTMLElementItem,
    OnClick: CallableFunction,
    padding: number,
    textSize: string
  }
) {
  const children = item.children
  const { label, icon } = getItemInfo(item)
  const ItemIcon = icon


  return (
    <div className={`shrink-100 cursor-pointer rounded-lg p-${padding} hover:text-muted-foreground flex gap-1`} onClick={() => onClick()}>
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
