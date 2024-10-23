import { createContext, useEffect, useState } from "react";
import {
  queryChatContainer,
} from "../utils/renderLogic";
import ButtonContainer from "./ButtonContainer/ButtonContainer";
import MinimapContainer from "./MinimapContainer/MinimapContainer";
import styles from "./ContentContainer.module.css";
import { DEFAULT_OPTIONS } from "../../../constants";
import { ExtensionOptions } from "../../../types/options";

interface ContentContextType {
  currentChatContainer: HTMLElement|null,
  currentChatText: string,
  currentScrollContainer: HTMLElement|null,
  showMinimap: boolean,
  setShowMinimap: CallableFunction,
  searchForChat: CallableFunction,
  options: ExtensionOptions
}
export const ContentContext = createContext<ContentContextType|null>(null);


export default function ContentContainer() {
  // states
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [showMinimap, setShowMinimap] = useState<boolean>(false)
  const [currentChatText, setCurrentChatText] = useState<string>("")
  const [currentChatContainer, setCurrentChatContainer] = useState<HTMLElement|null>(null)
  const [currentScrollContainer, setCurrentScrollContainer] = useState<HTMLElement|null>(null)
  const [options, setOptions] = useState<ExtensionOptions>(DEFAULT_OPTIONS)

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
          setCurrentChatContainer(chat)
          setCurrentChatText(chat.innerText)
          setCurrentScrollContainer(chat.parentElement)
          return null
      }
      await delay(300)
    }
    setCurrentChatContainer(null)
    setCurrentChatText("")
    setCurrentScrollContainer(null)
    return null
}

  // On initial render
  useEffect(() => {
    const urlObserver = new MutationObserver(updateCurrentUrl)
    urlObserver.observe(document, {childList: true, subtree: true})

    chrome.storage.sync.get(['options'], function(data) {
        if (data.options) {
            const options: ExtensionOptions = {...data.options}
            setOptions(options)
        }
    })

  }, [])

  // On current url change
  useEffect(() => {
    // console.log("current url", currentUrl.slice(-2))
    searchForChat()
  }, [currentUrl])

  // On current chat change
  // useEffect(() => {
  //   console.log("current chat", currentChatContainer?.innerText.replace(/\s/g, "").slice(0, 10))
  // }, [currentChatContainer])

  // On options change
  useEffect(() => {
    // Auto refresh
    let autoRefreshInterval: number |null;
    if (options.autoRefresh) {
      autoRefreshInterval = setInterval(searchForChat, options.refreshPeriod * 1000);
    }

    // Keep open
    if (options.keepOpen) {
      setShowMinimap(true)
    }
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [options])

  return (
    <ContentContext.Provider value={
      {
        currentChatContainer, 
        currentChatText,
        currentScrollContainer, 
        searchForChat,
        setShowMinimap, 
        showMinimap,
        options
      }
      } >
      <div className={styles.appContainer}>
        <ButtonContainer />
        {showMinimap ? <MinimapContainer /> : null}
      </div>
    </ContentContext.Provider>
  );
}
