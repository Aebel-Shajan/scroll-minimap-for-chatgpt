import { useEffect, useState } from "react";
import OptionsContainer from "./components/OptionsContainer";
import Minimap from "./components/Minimap";
import { queryAllChatElements, queryChatContainer, queryChatScrollContainer, queryNavElement } from "./utils/renderLogic";

export default function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [chatContainer, setChatContainer] = useState<HTMLElement | null>(null);
  const [, manualRefresh] = useState<boolean>(false); 

  const updateChatContainer = () => {
    setTimeout(() => {
      const newChatContainer = queryChatContainer()
      setChatContainer(newChatContainer);
    }, 1000);
  };

  // Run when mounted
  useEffect(() => {
    console.log("app mounted____________________________________")
    addLocationObserver(updateChatContainer);
  }, []);

  // Run when app rerenders 
  useEffect(() => {
    console.log("app rerendered____________________________________") 
  }) 

  // Run when chatContainer state changed
  useEffect(() => {
    console.log("chat container state changed")
  })

  // Run when showminimap state changed
  useEffect(() => {
    console.log("show minimap state changed");
  }, [showMinimap]);

  const onToggleMinimap = () => {
    if (!showMinimap) {
      updateChatContainer();
    }
    setShowMinimap(!showMinimap);
  };
  const onRefreshMinimap = () => {
    manualRefresh((temp) => !temp)
    updateChatContainer();
  };
  const onNextChat = () => {
    const scrollContainer = queryChatScrollContainer()
    const navElement = queryNavElement()
    if (!scrollContainer || !navElement) return 
    const navHeight = navElement.offsetHeight;
    const chatElements = queryAllChatElements()
     const nextChats = chatElements.filter((element) => {
      return (element.getBoundingClientRect().top > 1.1 * navHeight)
    })
    if (nextChats.length === 0) return
    const firstNextChat = nextChats[0];
    scrollContainer.scrollTo(0, scrollContainer.scrollTop + firstNextChat.getBoundingClientRect().top - navHeight)
  }
  const onPreviousChat = () => {
    const scrollContainer = queryChatScrollContainer()
    const navElement = queryNavElement()
    if (!scrollContainer || !navElement) return 
    const navHeight = navElement.offsetHeight;
    const chatElements = queryAllChatElements()
     const nextChats = chatElements.filter((element) => {
      return (element.getBoundingClientRect().top < navHeight)
    })
    if (nextChats.length === 0) return
    const firstNextChat = nextChats[nextChats.length - 1];
    scrollContainer.scrollTo(0, scrollContainer.scrollTop + firstNextChat.getBoundingClientRect().top - navHeight)
  }


  return (
    <div className="app-container" style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={onToggleMinimap}
        onRefreshMinimap={onRefreshMinimap}
        onNextChat={onNextChat}
        onPreviousChat={onPreviousChat}
        showMinimap={showMinimap}
      />
      {showMinimap ? <Minimap chatContainer={chatContainer} /> : null}
    </div>
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
function addLocationObserver(callback: MutationCallback) {
  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: false };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);
}
