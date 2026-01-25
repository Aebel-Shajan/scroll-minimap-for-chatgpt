import { queryChatScrollContainer } from "@/lib/chatgptElementUtils"
import { chatProviders } from "@/lib/constants"

export default function useScrollContainer(chatProvider: chatProviders) {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = queryChatScrollContainer(chatProvider)
    if (container) {
      setScrollContainer(container)
      return
    }

    const timeout = setTimeout(() => {
      setScrollContainer(queryChatScrollContainer(chatProvider))
    }, 2000)

    return () => clearTimeout(timeout)
  }, [chatProvider])

  return scrollContainer
}
