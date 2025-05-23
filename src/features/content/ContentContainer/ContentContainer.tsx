import { useEffect, useState } from "react";
import {
  queryChatContainer,
} from "./Minimap/utils";
import styles from "./ContentContainer.module.css";
import Minimap from "./Minimap/Minimap";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl])

  return (
 
      <div className={styles.appContainer}>
        <Minimap elementToMap={currentScrollContainer}/>
      </div>

  );
}
