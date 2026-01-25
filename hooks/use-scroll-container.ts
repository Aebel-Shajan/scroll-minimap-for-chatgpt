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

    const interval = setInterval(() => {
      const container = queryChatScrollContainer(chatProvider)
      if (container) {
        setScrollContainer(container)
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [chatProvider])

  return scrollContainer
}
