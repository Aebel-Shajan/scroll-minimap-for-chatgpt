import { useEffect, useState } from "react";
import OptionsContainer from "./components/OptionsContainer";
import Minimap from "./components/Minimap";
import { queryChatContainer } from "./utils/renderLogic";

export default function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [chatContainer, setChatContainer] = useState<HTMLElement|null>(null);

  useEffect(() => {
    console.log("show minimap state changed")
    setChatContainer(queryChatContainer())
  }, [showMinimap])

  const onToggleMinimap = () => setShowMinimap(!showMinimap);
  const onRefreshMinimap = () => {
    setChatContainer(queryChatContainer())
  }

  return (
    <div className="app-container" style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={onToggleMinimap}
        onRefreshMinimap={onRefreshMinimap}
        showMinimap={showMinimap}
      />
      {showMinimap ? <Minimap chatContainer={chatContainer}/> : null}
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
  userSelect: "none"
};