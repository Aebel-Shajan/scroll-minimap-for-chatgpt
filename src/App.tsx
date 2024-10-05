import { useEffect, useState } from "react";
import OptionsContainer from "./components/OptionsContainer";
import Minimap from "./components/Minimap";
import { queryChatContainer } from "./utils/renderLogic";

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

  return (
    <div className="app-container" style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={onToggleMinimap}
        onRefreshMinimap={onRefreshMinimap}
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
