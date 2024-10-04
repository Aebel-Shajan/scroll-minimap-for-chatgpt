import { useEffect, useRef } from "react";
import { generateMinimapCanvas } from "../utils/renderLogic";

interface MinimapProps {
  chatContainer: HTMLElement | null
}
const Minimap = ({chatContainer}: MinimapProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const currentViewRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    console.log("minimap rerendered");
    (async () => {
      const canvasContainer = canvasContainerRef.current
      if (!chatContainer || !canvasContainer) return
      const canvas = await generateMinimapCanvas(chatContainer)
      canvasContainer.innerHTML = ""
      canvasContainer.appendChild(canvas);
      
      const scale = canvasContainer.offsetWidth / canvas.offsetWidth;
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale * canvas.offsetHeight}px`;
    })()
  })
  



  return (
    <div className="minimap-container" style={minimapContainerStyle}>
      <div
        className="canvas-container"
        style={canvasContainerStyle}
        ref={canvasContainerRef}
      >

      </div>
      <div className="current-view" style={currentViewStyle} ref={currentViewRef}>

      </div>
    </div>
  );
};

const minimapContainerStyle: React.CSSProperties = {
  width: "5rem",
  height: "90vh",
  backgroundColor: "green",
  pointerEvents: "all",
  boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
};

const canvasContainerStyle: React.CSSProperties = {
  width: "100%",
}

const currentViewStyle: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  
}

export default Minimap;
