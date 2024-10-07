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
  const isLoading = useRef<boolean>(false)

  // useEffect(()=> console.log("canvas container rerendered", isLoading.current, chatContainer===null))

  useEffect(() => {
    if (isLoading.current===true) return 
    (async () => {
      const canvasContainer = canvasContainerRef.current;
      if (!canvasContainer) return;
      if (!chatContainer) {
        canvasContainer.innerHTML = "No chat detected, try refreshing the minimap"
        return
      }
      isLoading.current = true
      // console.log("generating minmiap canvas...")
      canvasContainer.innerHTML = "loading.."
      const canvas = await generateMinimapCanvas(chatContainer);
      isLoading.current = false
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
