import { createContext, useEffect, useState } from "react";
import {
  queryChatContainer,
} from "../utils/renderLogic";
import ButtonContainer from "./ButtonContainer/ButtonContainer";
import MinimapContainer from "./MinimapContainer/MinimapContainer";

interface ContentContextType {
  currentChatContainer: HTMLElement|null,
  currentChatText: string,
  currentScrollContainer: HTMLElement|null,
  showMinimap: boolean,
  setShowMinimap: CallableFunction,
  searchForChat: CallableFunction
}
export const ContentContext = createContext<ContentContextType|null>(null);


export default function ContentContainer() {
  // states
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [showMinimap, setShowMinimap] = useState<boolean>(false)
  const [currentChatText, setCurrentChatText] = useState<string>("")
  const [currentChatContainer, setCurrentChatContainer] = useState<HTMLElement|null>(null)
  const [currentScrollContainer, setCurrentScrollContainer] = useState<HTMLElement|null>(null)

  // functions
  function updateCurrentUrl() {
    setCurrentUrl(location.href)
  }

  function delay(milliseconds: number) {
    return new Promise(res => setTimeout(res, milliseconds));
  }

  async function searchForChat(): Promise<null> {
    for (let i =0; i<10; i++) {
        const chat = queryChatContainer()
        if (chat) {
          setCurrentChatContainer(chat)
          setCurrentChatText(chat.innerText)
          if (chat) {
            setCurrentScrollContainer(chat?.parentElement)
          } else {
            setCurrentScrollContainer(null)
          }
          return null
        }
        
        await delay(100)
    }
    return null
}

  // On initial render
  useEffect(() => {
    const urlObserver = new MutationObserver(updateCurrentUrl)
    urlObserver.observe(document, {childList: true, subtree: true})
  }, [])

  // On current url change
  useEffect(() => {
    console.log("current url", currentUrl.slice(-2))
    searchForChat()
  }, [currentUrl])

  // On current chat change
  useEffect(() => {
    console.log("current chat", currentChatContainer?.innerText.replace(/\s/g, "").slice(0, 10))
  }, [currentChatContainer])


  return (
    <ContentContext.Provider value={
      {
        currentChatContainer, 
        currentChatText,
        currentScrollContainer, 
        searchForChat,
        setShowMinimap, 
        showMinimap
      }
      } >
      <div className="app-container" style={appContainerStyle}>
        <ButtonContainer />
        {showMinimap ? <MinimapContainer /> : null}
      </div>
    </ContentContext.Provider>
  );
}

const appContainerStyle: React.CSSProperties = {
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  justifyContent: "right",
  pointerEvents: "none",
  userSelect: "none",
};

