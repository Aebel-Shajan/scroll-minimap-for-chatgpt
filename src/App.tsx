import { useRef, useState } from "react";
import OptionsContainer from "./components/OptionsContainer";
import Minimap from "./components/Minimap";
import { rerenderMinimap } from "./utils/renderLogic";

export default function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const minimapRef = useRef(null);

  const onToggleMinimap = () => setShowMinimap(!showMinimap);
  const onRefreshMinimap = () => rerenderMinimap(minimapRef);

  return (
    <div className="app-container" style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={onToggleMinimap}
        onRefreshMinimap={onRefreshMinimap}
        showMinimap={showMinimap}
      />
      {showMinimap ? <Minimap ref={minimapRef} /> : null}
    </div>
  );
}

const appContainerStyle: React.CSSProperties = {
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  justifyContent: "right",
};