import { createContext, useEffect, useState } from "react";
import {
  queryChatContainer,
} from "../utils/renderLogic";
import styles from "./ContentContainer.module.css";
import { ExtensionOptions } from "../../../types/options";
import Minimap from "./Minimap/Minimap";

interface ContentContextType {
  currentChatContainer: HTMLElement|null,
  currentChatText: string,
  currentScrollContainer: HTMLElement|null,
  currentScrollPos: number,
  showMinimap: boolean,
  setShowMinimap: CallableFunction,
  searchForChat: CallableFunction,
  options: ExtensionOptions
}
export const ContentContext = createContext<ContentContextType|null>(null);


export default function ContentContainer() {
  // states
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [currentScrollContainer, setCurrentScrollContainer] = useState<HTMLElement|null>(null)

  // functions
  function updateCurrentUrl() {
    setCurrentUrl(location.href)
  }

  function delay(milliseconds: number) {
    return new Promise(res => setTimeout(res, milliseconds));
  }

  async function searchForChat(): Promise<null> {
    await delay(500)
    for (let i =0; i<10; i++) {
      const chat = queryChatContainer()
      if (chat) {
          setCurrentScrollContainer(chat.parentElement)
          return null
      }
      await delay(300)
    }
    setCurrentScrollContainer(null)
    return null
}

  // On initial render
  useEffect(() => {
    const urlObserver = new MutationObserver(updateCurrentUrl)
    urlObserver.observe(document, {childList: true, subtree: true})
  }, [])

  // On current url change
  useEffect(() => {
    // console.log("current url", currentUrl.slice(-2))
    searchForChat()
  }, [currentUrl])

  return (
 
      <div className={styles.appContainer}>
        <Minimap elementToMap={currentScrollContainer}/>
      </div>

  );
}
