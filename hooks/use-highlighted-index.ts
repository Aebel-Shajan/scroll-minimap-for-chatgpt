import { ChatItem } from "@/types"

export default function useHighlightedIndex(
  scrollContainer: HTMLElement | null,
  elementTree: ChatItem[]
) {
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  useEffect(() => {
    if (!scrollContainer || elementTree.length === 0) return

    const handleScroll = () => {
      const scrollPositions = elementTree.map((item, index) => ({
        offset: item.element.offsetTop,
        index
      }))

      const currentScroll = scrollContainer.scrollTop + 60
      const nearest = scrollPositions
        .filter(pos => pos.offset < currentScroll)
        .sort((a, b) => b.offset - a.offset)[0]

      setHighlightedIndex(nearest?.index ?? 0)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [scrollContainer, elementTree])

  return highlightedIndex
}
