import { memo, useEffect, useRef } from "react";
import { generateMinimapCanvas, queryChatContainer } from "../../../utils/renderLogic";

interface CanvasContainerProps {
  refreshCanvas: boolean;
  setScale: CallableFunction;
}

const CanvasContainer = ({ refreshCanvas, setScale }: CanvasContainerProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("canvase rerendered");
    (async () => {
      const chatContainer = queryChatContainer();
      const canvasContainer = canvasContainerRef.current;
      if (!chatContainer || !canvasContainer) return;
      const canvas = await generateMinimapCanvas(chatContainer);
      canvasContainer.innerHTML = "";
      canvasContainer.appendChild(canvas);

      const scale = canvasContainer.offsetWidth / canvas.offsetWidth;
      setScale(scale);
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale * canvas.offsetHeight}px`;
    })();
  }, [refreshCanvas, setScale]);

  return (
    <div
      className="canvas-container"
      style={canvasContainerStyle}
      ref={canvasContainerRef}
    ></div>
  );
};

const canvasContainerStyle: React.CSSProperties = {
  width: "100%",
};

export default memo(CanvasContainer);
