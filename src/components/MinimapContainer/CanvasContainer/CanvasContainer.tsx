import { memo, useEffect, useRef } from "react";
import { generateMinimapCanvas } from "../../../utils/renderLogic";

interface CanvasContainerProps {
  refreshCanvas: boolean;
  setScale: CallableFunction;
  chatContainer: HTMLElement | null;
}

const CanvasContainer = ({
  refreshCanvas,
  setScale,
  chatContainer,
}: CanvasContainerProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const canvasContainer = canvasContainerRef.current;
      if (!chatContainer || !canvasContainer) return;
      const canvas = await generateMinimapCanvas(chatContainer);
      canvasContainer.innerHTML = "";
      canvasContainer.appendChild(canvas);

      const scale = canvasContainer.offsetWidth / canvas.offsetWidth;
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale * canvas.offsetHeight}px`;
      setScale(scale);
    })();
  }, [refreshCanvas, setScale, chatContainer]);

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
