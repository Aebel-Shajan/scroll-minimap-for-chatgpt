import { chatProviders } from "@/lib/constants"


export default function useChatProvider() {
  const [chatProvider, setChatProvider] = useState<chatProviders>("chatgpt")

  useEffect(() => {
    const url = window.location.hostname
    const urlMap: Record<string, chatProviders> = {
      "gemini.google.com": "gemini",
      "chatgpt.com": "chatgpt",
      "claude.ai": "claude"
    }
    Object.keys(urlMap).forEach(key => {
      if (url.includes(key)) {
        setChatProvider(urlMap[key])
        console.log(urlMap[key])
      }
    })
  }, [])

  return chatProvider
}