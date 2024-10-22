import { memo, useEffect, useRef } from "react";
import { generateMinimapCanvas } from "../../../utils/renderLogic";

interface CanvasContainerProps {
  setScale: CallableFunction;
  chatContainer: HTMLElement | null;
  chatText: string
}

const CanvasContainer = ({
  setScale,
  chatContainer,
  chatText
}: CanvasContainerProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isLoading = useRef<boolean>(false)

  // useEffect(()=> console.log("canvas container rerendered", isLoading.current, chatContainer===null))
  
  // On chat container change, on chat text change
  useEffect(() => {
    if (isLoading.current===true) return 
    (async () => {
      const canvasContainer = canvasContainerRef.current;
      if (!canvasContainer) return;
      // if (canvasContainer.parentElement){ // scroll to top to display message
      //   canvasContainer.parentElement.scrollTo(0, 0)
      // }
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
  }, [setScale, chatContainer, chatText]);

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
  color: "white",
  fontWeight: "bold"
};

export default memo(CanvasContainer);
