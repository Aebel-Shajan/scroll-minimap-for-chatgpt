

export default function useChatProvider() {
  const [chatProvider, setChatProvider] = useState("chatgpt")

  useEffect(() => {
    const url = window.location.hostname
    if (url.includes('gemini.google.com')) {
      setChatProvider("gemini")
    }
    if (url.includes('chatgpt.com')) {
      setChatProvider("chatgpt")
    }
  }, [])

  return chatProvider
}